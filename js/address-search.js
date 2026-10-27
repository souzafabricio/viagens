/* ===========================================================================
   Busca de endereço com sugestões (combobox). CEP vai para o ViaCEP; texto
   livre vai para o Photon (OSM, feito para autocomplete — o Nominatim
   proíbe esse uso). Cada sugestão vira { bairro, cidade, uf, lat, lon }.
   ======================================================================== */

import { esc } from './utils.js';
import { ufDoEstado } from './places.js';

const PHOTON = 'https://photon.komoot.io/api/';
const BBOX_BRASIL = '-74.0,-33.8,-34.7,5.3';
const ESPERA_MS = 350;
const MIN_CARACTERES = 3;

const ehCep = (t) => /^\s*\d{5}-?\d{3}\s*$/.test(t);
const juntar = (partes, sep) => partes.filter(Boolean).join(sep);

async function photon(q, limite, sinal) {
  const url = PHOTON + '?q=' + encodeURIComponent(q) + '&limit=' + limite + '&bbox=' + BBOX_BRASIL;
  const data = await (await fetch(url, { signal: sinal })).json();
  return (data.features || []).filter((f) => f.properties && f.properties.countrycode === 'BR');
}

function deFeature(f) {
  const p = f.properties;
  const [lon, lat] = f.geometry.coordinates;
  const ehCidade = ['city', 'town', 'village'].includes(p.osm_value) || p.type === 'city';
  const cidade = p.city || (ehCidade ? p.name : '') || p.county || '';
  const uf = ufDoEstado(p.state);
  const rua = juntar([p.street, p.housenumber], ', ');
  const ehBairro = ['suburb', 'neighbourhood', 'quarter'].includes(p.osm_value);
  const bairro = (ehBairro ? p.name : '') || p.district || p.locality || '';
  const titulo = p.name || rua || cidade;
  return {
    bairro, cidade, uf, lat, lon, titulo,
    detalhe: juntar([titulo !== rua ? rua : '', bairro !== titulo ? bairro : '',juntar([cidade !== titulo ? cidade : '', uf], '/'), p.postcode], ' · '),
  };
}

async function buscarPorCep(texto, sinal) {
  const cep = texto.replace(/\D/g, '');
  const v = await (await fetch('https://viacep.com.br/ws/' + cep + '/json/', { signal: sinal })).json();
  if (!v || v.erro) return [];
  // ViaCEP não traz coordenadas: localiza a rua (ou, na falta, a cidade) no Photon.
  let geo = v.logradouro ? await photon(juntar([v.logradouro, v.localidade, v.uf], ', '), 1, sinal) : [];
  if (!geo.length) geo = await photon(v.localidade + ', ' + v.uf, 1, sinal);
  const [lon, lat] = geo.length ? geo[0].geometry.coordinates : [null, null];
  const cepFmt = cep.slice(0, 5) + '-' + cep.slice(5);
  return [{
    bairro: v.bairro || '', cidade: v.localidade || '', uf: v.uf || '', lat, lon,
    titulo: v.logradouro || 'CEP ' + cepFmt,
    detalhe: juntar([v.bairro, v.localidade + '/' + v.uf, 'CEP ' + cepFmt], ' · '),
  }];
}

async function buscar(texto, sinal) {
  if (ehCep(texto)) return buscarPorCep(texto, sinal);
  const vistos = new Set();
  return (await photon(texto, 8, sinal)).map(deFeature).filter((r) => {
    const chave = r.titulo + '|' + r.detalhe;
    if (vistos.has(chave)) return false;
    vistos.add(chave);
    return true;
  }).slice(0, 6);
}

// Liga o input à lista. onSelect recebe a sugestão escolhida.
export function ligarBuscaEndereco(input, lista, onSelect) {
  let timer = null, controle = null, sugestoes = [], ativo = -1;

  function fechar() {
    clearTimeout(timer);
    if (controle) controle.abort();
    lista.hidden = true;
    lista.innerHTML = '';
    input.setAttribute('aria-expanded', 'false');
    input.removeAttribute('aria-activedescendant');
    sugestoes = []; ativo = -1;
  }

  function mensagem(txt) {
    lista.innerHTML = `<li class="ac-msg" role="presentation">${esc(txt)}</li>`;
    lista.hidden = false;
    input.setAttribute('aria-expanded', 'true');
  }

  function desenhar() {
    lista.innerHTML = sugestoes.map((s, i) =>
      `<li id="${lista.id}-${i}" class="ac-opt" role="option" aria-selected="${i === ativo}" data-i="${i}">` +
      `<strong>${esc(s.titulo)}</strong>${s.detalhe ? `<small>${esc(s.detalhe)}</small>` : ''}</li>`).join('');
    lista.hidden = false;
    input.setAttribute('aria-expanded', 'true');
    if (ativo >= 0) {
      input.setAttribute('aria-activedescendant', `${lista.id}-${ativo}`);
      lista.children[ativo].scrollIntoView({ block: 'nearest' });
    } else input.removeAttribute('aria-activedescendant');
  }

  function escolher(i) {
    const s = sugestoes[i];
    if (!s) return;
    input.value = juntar([s.titulo, s.detalhe], ' · ');
    fechar();
    onSelect(s);
  }

  async function executar(texto) {
    if (controle) controle.abort();
    controle = new AbortController();
    const sinal = controle.signal;
    mensagem('Buscando…');
    try {
      const r = await buscar(texto, sinal);
      if (sinal.aborted) return;
      sugestoes = r; ativo = -1;
      if (r.length) desenhar();
      else mensagem(ehCep(texto) ? 'CEP não encontrado.' : 'Nenhum endereço encontrado — tente incluir a cidade.');
    } catch (err) {
      if (err.name !== 'AbortError') mensagem('Sem conexão com o serviço de endereços. Use o mapa ou preencha à mão.');
    }
  }

  input.addEventListener('input', () => {
    clearTimeout(timer);
    const texto = input.value.trim();
    const digitos = texto.replace(/\D/g, '');
    // CEP pela metade: espera completar os 8 dígitos.
    if (texto.length < MIN_CARACTERES || (/^[\d\s-]+$/.test(texto) && digitos.length < 8)) { fechar(); return; }
    timer = setTimeout(() => executar(texto), ESPERA_MS);
  });

  input.addEventListener('keydown', (e) => {
    if (lista.hidden || !sugestoes.length) {
      if (e.key === 'Escape') fechar();
      if (e.key === 'Enter') e.preventDefault();   // não envia o formulário por engano
      return;
    }
    if (e.key === 'ArrowDown') { e.preventDefault(); ativo = (ativo + 1) % sugestoes.length; desenhar(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); ativo = (ativo - 1 + sugestoes.length) % sugestoes.length; desenhar(); }
    else if (e.key === 'Enter') { e.preventDefault(); escolher(ativo >= 0 ? ativo : 0); }
    else if (e.key === 'Escape') { e.preventDefault(); fechar(); }
  });

  // mousedown, não click: precisa acontecer antes do blur do input.
  lista.addEventListener('mousedown', (e) => {
    const opt = e.target.closest('[data-i]');
    if (!opt) return;
    e.preventDefault();
    escolher(Number(opt.dataset.i));
  });

  input.addEventListener('blur', () => setTimeout(fechar, 150));

  return { fechar };
}
