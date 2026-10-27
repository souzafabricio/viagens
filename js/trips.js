/* ===========================================================================
   VIAGENS — lista, criação/edição (com cópia de outra viagem), exclusão e
   troca da viagem ativa.
   ======================================================================== */

import { state, emit, limparDadosDaViagem } from './state.js';
import { TABLES, LS, PEOPLE, APP_NAME } from './config.js';
import { $, esc, uid, lsGet, lsSet, lsRaw, plural } from './utils.js';
import { supa, enfileirar, carregarCache } from './db.js';
import { toast, confirmar, showScreen } from './ui.js';
import { periodoCurto, periodoExtenso, noites, faseDaViagem, textoContagem } from './dates.js';
import { criarTopicosPadrao, renderTopicos } from './lists.js';
import { carregarTudoDaViagem, inscreverRealtime, desinscrever } from './realtime.js';
import { carregarClima } from './weather.js';
import { abrirMapPicker, gerarOndeComprar, removerTopicosLugares } from './places.js';
import { ICON } from './icons.js';
import { ligarBuscaEndereco } from './address-search.js';

let editandoId = null;
let enderecoOriginal = null;
let coordsEscolhidas = null;   // vindas do mapa: { lat, lon }

/* ---------------- Dados ---------------- */

export async function carregarViagens() {
  if (!supa) return lsGet(LS.trips, []);
  try {
    const res = await supa.from(TABLES.viagens).select('*').order('data_inicio', { ascending: false, nullsFirst: false });
    if (res.error) throw res.error;
    lsSet(LS.trips, res.data || []);
    return res.data || [];
  } catch (err) {
    console.warn('Sem rede — listando viagens do cache.', err);
    return lsGet(LS.trips, []);
  }
}

/* ---------------- Hero da viagem ---------------- */

export function atualizarHero() {
  const t = state.trip;
  if (!t) return;
  document.title = t.nome + ' · ' + APP_NAME;
  const periodo = periodoExtenso(t.data_inicio, t.data_fim);
  $('heroTitle').textContent = t.nome;
  $('heroKicker').textContent = [t.local, periodo].filter(Boolean).join(' · ') || APP_NAME;
  $('appbarTitle').textContent = t.nome;
  const n = noites(t);
  const chips = [];
  const cont = textoContagem(t);
  if (cont) chips.push(`<span class="hero-chip strong">${esc(cont)}</span>`);
  if (n) chips.push(`<span class="hero-chip">${plural(n, 'noite', 'noites')}</span>`);
  if (t.endereco_cidade) chips.push(`<span class="hero-chip">${ICON.pin} ${esc([t.endereco_bairro, t.endereco_cidade].filter(Boolean).join(', '))}</span>`);
  $('heroChips').innerHTML = chips.join('');
  $('footerTrip').textContent = [APP_NAME, t.local, periodo].filter(Boolean).join(' · ');
}

/* ---------------- Lista de viagens ---------------- */

function statusPill(v) {
  const s = faseDaViagem(v);
  if (s.fase === 'antes') return `<span class="pill pill-sand">${s.dias === 1 ? 'amanhã' : `em ${s.dias} dias`}</span>`;
  if (s.fase === 'durante') return '<span class="pill pill-ok">agora</span>';
  if (s.fase === 'depois') return '<span class="pill">concluída</span>';
  return '';
}

export function renderListaViagens(viagens) {
  const lista = $('tripList');
  if (!viagens.length) {
    lista.innerHTML = '<div class="empty-state"><p>Nenhuma viagem cadastrada ainda.</p><p class="sm">Crie a primeira abaixo.</p></div>';
    return;
  }
  lista.innerHTML = viagens.map((v) => {
    const ativa = state.trip && state.trip.id === v.id;
    const meta = [periodoCurto(v.data_inicio, v.data_fim), v.local].filter(Boolean).join(' · ');
    return `<div class="trip-card${ativa ? ' active' : ''}" data-trip-id="${esc(v.id)}">` +
      `<button type="button" class="trip-open" data-trip-act="abrir" aria-label="Abrir ${esc(v.nome)}">` +
        `<span class="trip-name">${esc(v.nome)}${ativa ? ' <span class="trip-current">atual</span>' : ''}</span>` +
        `<span class="trip-meta">${esc(meta || 'Sem datas')}</span>` +
      '</button>' +
      statusPill(v) +
      '<span class="item-actions">' +
        `<button type="button" class="icon-btn" data-trip-act="editar" title="Editar viagem" aria-label="Editar viagem">${ICON.edit}</button>` +
        `<button type="button" class="icon-btn danger" data-trip-act="excluir" title="Excluir viagem" aria-label="Excluir viagem">${ICON.trash}</button>` +
      '</span></div>';
  }).join('');
}

function preencherCopiarDe(viagens) {
  $('tripCopyFrom').innerHTML = '<option value="">Começar com listas padrão</option>' +
    viagens.map((v) => `<option value="${esc(v.id)}">${esc(v.nome)}</option>`).join('');
}

async function atualizarTelaViagens() {
  const v = await carregarViagens();
  renderListaViagens(v);
  preencherCopiarDe(v);
  return v;
}

export function abrirViagens() {
  fecharForm();
  $('tripList').classList.remove('hidden');
  $('tripNewToggleBtn').classList.remove('hidden');
  $('tripsBackBtn').classList.toggle('hidden', !state.trip);
  $('tripsKicker').textContent = state.user ? `Olá, ${PEOPLE[state.user]}` : APP_NAME;
  showScreen('trips');
  atualizarTelaViagens();
}

export function editarViagemAtual() {
  if (!state.trip) return;
  abrirViagens();
  $('tripList').classList.add('hidden');
  $('tripNewToggleBtn').classList.add('hidden');
  iniciarEdicao(state.trip.id);
}

function voltarParaViagem() {
  fecharForm();
  if (state.trip) showScreen('trip');
}

/* ---------------- Trocar a viagem ativa ---------------- */

export async function trocarParaViagem(viagem) {
  state.trip = viagem;
  lsRaw(LS.trip, viagem.id);
  atualizarHero();
  desinscrever();
  limparDadosDaViagem();
  carregarCache(viagem.id);        // mostra algo na hora, mesmo offline
  emit('trip:changed');
  await carregarTudoDaViagem();
  inscreverRealtime();
  carregarClima().then(() => emit('clima:changed'));
}

async function selecionarViagem(id) {
  if (state.trip && state.trip.id === id) { showScreen('trip'); return; }
  const viagem = (await carregarViagens()).find((v) => v.id === id);
  if (!viagem) return;
  showScreen('trip');
  await trocarParaViagem(viagem);
}

// Ao abrir o app: a última viagem usada, senão a mais próxima/atual.
export async function abrirViagemInicial() {
  const viagens = await carregarViagens();
  if (!viagens.length) { abrirViagens(); return; }
  const salva = lsRaw(LS.trip);
  const fase = (v) => faseDaViagem(v).fase;
  const escolhida = viagens.find((v) => v.id === salva) ||
    viagens.find((v) => fase(v) === 'durante') ||
    viagens.filter((v) => fase(v) === 'antes').sort((a, b) => (a.data_inicio < b.data_inicio ? -1 : 1))[0] ||
    viagens[0];
  showScreen('trip');
  await trocarParaViagem(escolhida);
}

async function limparDependencias(id) {
  const tabelas = ['checklist_item_overrides', 'checklist_items', 'checklist_marks',
    TABLES.itens, TABLES.topicos, TABLES.roteiro, TABLES.diario];
  for (const t of tabelas) {
    try {
      const res = await supa.from(t).delete().eq('viagem_id', id);
      if (res.error) console.warn('Limpeza de ' + t + ':', res.error.message);
    } catch (e) { console.warn('Limpeza de ' + t + ' falhou', e); }
  }
}

async function excluirViagem(id) {
  if (!supa) { toast('Sem conexão com o banco agora.'); return; }
  const viagens = await carregarViagens();
  const viagem = viagens.find((v) => v.id === id);
  if (!viagem) return;
  const ok = await confirmar(`"${viagem.nome}" será excluída com todos os tópicos, itens, roteiro e diário. Isso não pode ser desfeito.`, { titulo: 'Excluir viagem?' });
  if (!ok) return;
  await limparDependencias(id);
  const res = await supa.from(TABLES.viagens).delete().eq('id', id);
  if (res.error) { toast('Não foi possível excluir. (' + esc(res.error.message) + ')'); return; }
  lsRaw(LS.cache(id), null);
  if (state.trip && state.trip.id === id) {
    const restantes = viagens.filter((v) => v.id !== id);
    if (restantes.length) await trocarParaViagem(restantes[0]);
    else {
      state.trip = null;
      lsRaw(LS.trip, null);
      desinscrever();
      limparDadosDaViagem();
      renderTopicos();
    }
    $('tripsBackBtn').classList.toggle('hidden', !state.trip);
  }
  atualizarTelaViagens();
  toast('Viagem excluída.');
}

/* ---------------- Formulário ---------------- */

function fecharForm() {
  editandoId = null; enderecoOriginal = null; coordsEscolhidas = null;
  const form = $('tripForm');
  form.reset();
  form.classList.add('hidden');
  $('tripMapStatus').textContent = '';
  buscaEndereco.fechar();
  $('tripNewToggleBtn').classList.remove('hidden');
}

function abrirFormNovo() {
  fecharForm();
  $('tripFormTitle').textContent = 'Nova viagem';
  $('tripFormSubmit').textContent = 'Criar viagem';
  $('tripCopyWrap').classList.remove('hidden');
  $('tripForm').classList.remove('hidden');
  $('tripNewToggleBtn').classList.add('hidden');
  $('tripNome').focus();
}

async function iniciarEdicao(id) {
  const v = (await carregarViagens()).find((x) => x.id === id);
  if (!v) return;
  fecharForm();
  editandoId = id;
  enderecoOriginal = { bairro: v.endereco_bairro || '', cidade: v.endereco_cidade || '', uf: v.endereco_uf || '' };
  $('tripNome').value = v.nome || '';
  $('tripLocal').value = v.local || '';
  $('tripInicio').value = v.data_inicio || '';
  $('tripFim').value = v.data_fim || '';
  $('tripBairro').value = v.endereco_bairro || '';
  $('tripCidade').value = v.endereco_cidade || '';
  $('tripUf').value = v.endereco_uf || '';
  $('tripMapStatus').textContent = v.lat ? 'Local marcado no mapa ✓' : '';
  $('tripFormTitle').textContent = 'Editar viagem';
  $('tripFormSubmit').textContent = 'Salvar alterações';
  $('tripCopyWrap').classList.add('hidden');
  $('tripForm').classList.remove('hidden');
  $('tripNewToggleBtn').classList.add('hidden');
  $('tripForm').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Reaproveita a estrutura de outra viagem: mesmos tópicos e itens, ids novos,
// marcações zeradas. "Quer usar a mala de Ubatuba?"
async function copiarEstrutura(origemId, destino) {
  if (!supa) return;
  const resT = await supa.from(TABLES.topicos).select('*').eq('viagem_id', origemId);
  if (resT.error || !resT.data) return;
  const resI = await supa.from(TABLES.itens).select('*').eq('viagem_id', origemId);
  const mapa = {};
  resT.data.filter((t) => t.tipo !== 'lugares').forEach((t) => {
    const novo = { id: uid(), viagem_id: destino.id, nome: t.nome, tipo: t.tipo, ordem: t.ordem, created_by: state.user };
    mapa[t.id] = novo.id;
    state.topicos.push(novo);
    enfileirar(TABLES.topicos, 'insert', novo);
  });
  ((resI && resI.data) || []).forEach((it) => {
    if (!mapa[it.topico_id]) return;
    const novo = {
      id: uid(), viagem_id: destino.id, topico_id: mapa[it.topico_id], label: it.label,
      qty: it.qty || null, owner: it.owner || null, created_by: state.user,
      checked_fabricio: false, checked_carol: false,
    };
    (state.itens[novo.topico_id] = state.itens[novo.topico_id] || []).push(novo);
    enfileirar(TABLES.itens, 'insert', novo);
  });
  renderTopicos();
}

async function enviarForm(ev) {
  ev.preventDefault();
  if (!state.user) { toast('Escolha quem está acessando antes de continuar.'); return; }
  if (!supa) { toast('Sem conexão com o banco — criar e editar viagens precisa de internet.'); return; }
  const val = (id) => $(id).value.trim();
  const nome = val('tripNome');
  if (!nome) { $('tripNome').focus(); return; }
  const inicio = $('tripInicio').value, fim = $('tripFim').value;
  if (inicio && fim && fim < inicio) { toast('A volta é antes da ida — confira as datas.'); $('tripFim').focus(); return; }
  const bairro = val('tripBairro'), cidade = val('tripCidade'), uf = val('tripUf').toUpperCase();

  const payload = {
    nome, local: val('tripLocal') || null, data_inicio: inicio || null, data_fim: fim || null,
    endereco_bairro: bairro || null, endereco_cidade: cidade || null, endereco_uf: uf || null,
  };
  const btn = $('tripFormSubmit');
  btn.disabled = true;

  try {
    if (editandoId) {
      const id = editandoId, antes = enderecoOriginal;
      const mudouEndereco = !!coordsEscolhidas || (antes && (bairro !== antes.bairro || cidade !== antes.cidade || uf !== antes.uf));
      if (coordsEscolhidas) Object.assign(payload, coordsEscolhidas);
      else if (mudouEndereco) Object.assign(payload, { lat: null, lon: null });
      const res = await supa.from(TABLES.viagens).update(payload).eq('id', id).select();
      if (res.error) { toast('Não foi possível salvar. (' + esc(res.error.message) + ')'); return; }
      const atualizada = res.data[0];
      fecharForm();
      if (state.trip && state.trip.id === id) {
        state.trip = atualizada;
        atualizarHero();
        emit('trip:changed');
        showScreen('trip');
      } else {
        abrirViagens();
      }
      toast('Viagem atualizada.');
      if (mudouEndereco && (bairro || cidade || atualizada.lat)) {
        await removerTopicosLugares(id);
        const coords = await gerarOndeComprar(atualizada);
        if (coords && state.trip && state.trip.id === id) {
          Object.assign(state.trip, coords);
          carregarClima().then(() => emit('clima:changed'));
        }
      }
      return;
    }

    payload.created_by = state.user;
    if (coordsEscolhidas) Object.assign(payload, coordsEscolhidas);
    const res = await supa.from(TABLES.viagens).insert(payload).select();
    if (res.error) { toast('Não foi possível criar a viagem. (' + esc(res.error.message) + ')'); return; }
    const nova = res.data[0];
    const copiarDe = $('tripCopyFrom').value;
    fecharForm();
    showScreen('trip');
    await trocarParaViagem(nova);
    if (copiarDe) { await copiarEstrutura(copiarDe, nova); toast('Tópicos e itens copiados, sem as marcações.'); }
    else criarTopicosPadrao();
    if (bairro || cidade || nova.lat) {
      const coords = await gerarOndeComprar(nova);
      if (coords && state.trip && state.trip.id === nova.id) {
        Object.assign(state.trip, coords);
        carregarClima().then(() => emit('clima:changed'));
      }
    }
  } finally {
    btn.disabled = false;
  }
}

/* ---------------- Eventos ---------------- */

$('tripList').addEventListener('click', (e) => {
  const act = e.target.closest('[data-trip-act]');
  if (!act) return;
  const id = act.closest('[data-trip-id]').dataset.tripId;
  if (act.dataset.tripAct === 'abrir') selecionarViagem(id);
  else if (act.dataset.tripAct === 'editar') iniciarEdicao(id);
  else excluirViagem(id);
});
$('tripNewToggleBtn').addEventListener('click', abrirFormNovo);
$('tripFormCancel').addEventListener('click', () => {
  const soEdicao = $('tripList').classList.contains('hidden');
  fecharForm();
  if (soEdicao) voltarParaViagem();
});
$('tripsBackBtn').addEventListener('click', voltarParaViagem);
$('tripForm').addEventListener('submit', enviarForm);
$('mapPickerOpenBtn').addEventListener('click', () => abrirMapPicker((r) => {
  $('tripBairro').value = r.bairro;
  $('tripCidade').value = r.cidade;
  $('tripUf').value = r.uf;
  coordsEscolhidas = { lat: r.lat, lon: r.lon };
  $('tripMapStatus').textContent = 'Local marcado no mapa ✓';
}));

// Sugestão escolhida na busca: preenche o endereço e, se vier, a coordenada.
// Sem coordenada (CEP que o Photon não achou), o salvar geocodifica por bairro/cidade.
const buscaEndereco = ligarBuscaEndereco($('tripBusca'), $('tripBuscaLista'), (r) => {
  $('tripBairro').value = r.bairro;
  $('tripCidade').value = r.cidade;
  $('tripUf').value = r.uf;
  if (!$('tripLocal').value.trim() && r.cidade) $('tripLocal').value = r.cidade + (r.uf ? ', ' + r.uf : '');
  coordsEscolhidas = r.lat != null ? { lat: r.lat, lon: r.lon } : null;
  $('tripMapStatus').textContent = r.lat != null ? 'Local encontrado ✓' : 'Endereço preenchido — sem ponto exato no mapa';
});
