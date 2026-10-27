/* ===========================================================================
   MODO MERCADO — tela cheia, fonte grande, só o que falta, por corredor.
   A busca acha qualquer item (inclusive os já comprados); o que não existir
   é adicionado ao tópico "Mercado".
   ======================================================================== */

import { state } from './state.js';
import { $, esc } from './utils.js';
import { toast, abrirModal, fecharModal, modalAberto } from './ui.js';
import { itensMarcaveis, feitoParaMim, toggleMarca, salvarItem, removerItem, novoItem, criarTopico, encontrarItem } from './lists.js';
import { ICON } from './icons.js';

const CORREDORES = [
  { nome: 'Hortifrúti', chaves: ['alface','tomate','cebola','alho','batata','banana','maçã','maca','laranja','limão','limao','abacaxi','manga','melancia','uva','cenoura','pepino','salada','fruta','legume','verdura','abacate','mamão','mamao','morango'] },
  { nome: 'Padaria', chaves: ['pão','pao','bisnaga','baguete','bolo','torrada','croissant','biscoito','bolacha'] },
  { nome: 'Frios e laticínios', chaves: ['queijo','presunto','mussarela','muçarela','leite','iogurte','manteiga','requeijão','requeijao','margarina','ovo','ovos','creme de leite','nata','salame','mortadela'] },
  { nome: 'Carnes', chaves: ['carne','frango','picanha','linguiça','linguica','bacon','peixe','camarão','camarao','costela','hambúrguer','hamburguer','salsicha'] },
  { nome: 'Mercearia', chaves: ['arroz','feijão','feijao','macarrão','macarrao','sal','açúcar','acucar','óleo','oleo','azeite','café','cafe','farinha','molho','tempero','vinagre','miojo','atum','milho','ervilha','achocolatado','cereal','granola','mel'] },
  { nome: 'Bebidas', chaves: ['água','agua','cerveja','refrigerante','suco','vinho','espumante','gelo','energético','energetico','whisky','vodka','gin','tônica','tonica','coca','guaraná','guarana','champagne','champanhe'] },
  { nome: 'Congelados', chaves: ['sorvete','congelado','pizza','nuggets','picolé','picole'] },
  { nome: 'Limpeza', chaves: ['detergente','sabão','sabao','esponja','papel toalha','desinfetante','álcool','alcool','saco de lixo','lixo','amaciante','água sanitária','agua sanitaria'] },
  { nome: 'Higiene', chaves: ['shampoo','condicionador','sabonete','pasta de dente','escova','desodorante','papel higiênico','papel higienico','absorvente','protetor solar','repelente','fio dental','gilete','barbear','hidratante','perfume','lenço','lenco'] },
  { nome: 'Farmácia', chaves: ['remédio','remedio','analgésico','analgesico','antialérgico','antialergico','band-aid','curativo','dramin','enjoo','pomada','neosoro','dipirona','paracetamol','ibuprofeno'] },
];
const ORDEM = CORREDORES.map((c) => c.nome).concat('Outros');

// Cada chave casa no início de uma palavra e a mais longa vence:
// "macarrão" não cai em Hortifrúti por causa de "maca", "salada" não vira "sal".
const CHAVES = CORREDORES
  .flatMap((c) => c.chaves.map((k) => ({ nome: c.nome, k, re: new RegExp('(^|[^\\p{L}])' + k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'iu') })))
  .sort((a, b) => b.k.length - a.k.length);
function corredorDe(nome) {
  const n = String(nome || '');
  const hit = CHAVES.find((c) => c.re.test(n));
  return hit ? hit.nome : 'Outros';
}

const normalizar = (t) => String(t || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();

export function abrirMercado() {
  if (!state.user) { toast('Escolha quem está acessando antes.'); return; }
  $('mkBusca').value = '';
  $('mkQtd').value = '';
  abrirModal('marketMode');
  renderMercado();
}

function itemHtml({ topico, item }) {
  const feito = feitoParaMim(topico, item);
  return `<div class="mk-item${feito ? ' done' : ''}" data-mk-id="${esc(item.id)}">` +
    `<button type="button" class="mk-toggle" data-mk-act="toggle" aria-pressed="${feito}">` +
      '<span class="mk-box" aria-hidden="true"></span>' +
      `<span class="mk-nome">${esc(item.label)}</span>` +
      (item.qty ? `<span class="mk-qty">${esc(item.qty)}</span>` : '') +
    '</button>' +
    `<button type="button" class="icon-btn" data-mk-act="editar" title="Editar" aria-label="Editar ${esc(item.label)}">${ICON.edit}</button>` +
    `<button type="button" class="icon-btn danger" data-mk-act="remover" title="Excluir" aria-label="Excluir ${esc(item.label)}">${ICON.trash}</button>` +
    '</div>';
}

export function renderMercado() {
  if (!modalAberto('marketMode')) return;
  const body = $('mkBody');
  // Não redesenha por cima de uma edição em andamento.
  if (body.querySelector('.mk-edit')) return;
  const todos = itensMarcaveis();
  const pendentes = todos.filter((x) => !feitoParaMim(x.topico, x.item));
  const busca = normalizar($('mkBusca').value);
  $('mkAdd').disabled = !busca;

  $('mkCount').textContent = `${todos.length - pendentes.length} de ${todos.length}`;
  $('mkBar').style.width = (todos.length ? Math.round(((todos.length - pendentes.length) / todos.length) * 100) : 0) + '%';

  // Com busca, mostra também o que já foi comprado (para desmarcar ou editar).
  const visiveis = busca ? todos.filter((x) => normalizar(x.item.label).includes(busca)) : pendentes;
  if (busca && !visiveis.length) {
    body.innerHTML = `<p class="mk-empty">Nada com “${esc($('mkBusca').value.trim())}”.<br><small>Toque em <b>Adicionar</b> para incluir na lista.</small></p>`;
    return;
  }
  if (!todos.length) { body.innerHTML = '<p class="mk-empty">Nenhum item na lista ainda.<br><small>Digite acima e toque em <b>Adicionar</b>.</small></p>'; return; }
  if (!visiveis.length) { body.innerHTML = '<div class="mk-done">Tudo comprado.<br><small>Podem ir embora.</small></div>'; return; }

  const grupos = {};
  visiveis.forEach((x) => { const c = corredorDe(x.item.label); (grupos[c] = grupos[c] || []).push(x); });
  body.innerHTML = ORDEM.filter((c) => grupos[c]).map((c) =>
    `<div class="mk-aisle"><h3>${esc(c)} <span>${grupos[c].length}</span></h3>` +
    grupos[c].map(itemHtml).join('') + '</div>').join('');
}

// Destino dos itens novos: o tópico "Mercado"; na falta, o primeiro conjunto;
// na falta de qualquer um, cria o "Mercado".
function topicoDoMercado() {
  const conjuntos = state.topicos.filter((t) => t.tipo === 'compartilhado');
  return conjuntos.find((t) => normalizar(t.nome) === 'mercado') || conjuntos[0] || criarTopico('Mercado', 'compartilhado');
}

function adicionar() {
  if (!state.trip) return;
  const nome = $('mkBusca').value.trim();
  if (!nome) { $('mkBusca').focus(); return; }
  const topico = topicoDoMercado();
  novoItem(topico, nome, $('mkQtd').value.trim());
  $('mkBusca').value = '';
  $('mkQtd').value = '';
  renderMercado();
  $('mkBusca').focus();
  toast(`Adicionado em <b>${esc(topico.nome)}</b>: ${esc(nome)}`);
}

function editar(el) {
  const id = el.dataset.mkId;
  const item = encontrarItem(id);
  if (!item) return;
  const wrap = document.createElement('div');
  wrap.className = 'mk-edit';
  wrap.innerHTML = '<input type="text" class="mk-edit-nome" aria-label="Nome">' +
    '<input type="text" class="mk-edit-qtd" aria-label="Quantidade" placeholder="Qtd">';
  const [inNome, inQtd] = wrap.querySelectorAll('input');
  inNome.value = item.label || '';
  inQtd.value = item.qty || '';
  el.querySelector('.mk-toggle').replaceWith(wrap);
  el.querySelectorAll('.icon-btn').forEach((b) => (b.hidden = true));
  inNome.focus(); inNome.select();

  let feito = false;
  const terminar = (salvar) => {
    if (feito) return;
    feito = true;
    wrap.remove(); // libera o renderMercado
    const nome = inNome.value.trim(), qty = inQtd.value.trim() || null;
    if (salvar && nome && (nome !== item.label || qty !== (item.qty || null))) salvarItem(id, { label: nome, qty });
    else renderMercado();
  };
  wrap.addEventListener('focusout', () => setTimeout(() => { if (!wrap.contains(document.activeElement)) terminar(true); }, 0));
  wrap.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter') { ev.preventDefault(); terminar(true); }
    if (ev.key === 'Escape') { ev.preventDefault(); ev.stopPropagation(); terminar(false); }
  });
}

$('mkClose').addEventListener('click', () => fecharModal('marketMode'));
$('mkBusca').addEventListener('input', renderMercado);
$('mkAddForm').addEventListener('submit', (e) => { e.preventDefault(); adicionar(); });

$('mkBody').addEventListener('click', (e) => {
  const btn = e.target.closest('[data-mk-act]');
  if (!btn) return;
  const el = btn.closest('.mk-item');
  const act = btn.dataset.mkAct;
  if (act === 'editar') editar(el);
  else if (act === 'remover') removerItem(el.dataset.mkId);
  else if (el.classList.contains('done')) toggleMarca(el.dataset.mkId);   // desmarcar (aparece na busca)
  else {
    el.classList.add('done');
    setTimeout(() => toggleMarca(el.dataset.mkId), 260);
  }
});
