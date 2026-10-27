/* ===========================================================================
   LISTAS — tópicos e itens das abas Conjunta e Pessoal.
   Tudo offline-first: altera o estado, re-renderiza, enfileira para o banco.
   ======================================================================== */

import { state, emit } from './state.js';
import { TABLES, PEOPLE, UNDO_MS } from './config.js';
import { $, esc, uid, clone, mapsUrl } from './utils.js';
import { enfileirar, adiarExclusao } from './db.js';
import { toast, confirmar, perguntar } from './ui.js';
import { escolherFoto, abrirFotoViewer } from './photos.js';
import { ICON } from './icons.js';

const CAMPO = { fabricio: 'checked_fabricio', carol: 'checked_carol' };

const busca = { conjunta: '', pessoal: '' };
const soFalta = { conjunta: false, pessoal: false };

/* ---------------- Consultas ---------------- */

export function topicosOrdenados() {
  return state.topicos.slice().sort((a, b) => {
    const oa = a.ordem || 0, ob = b.ordem || 0;
    if (oa !== ob) return oa - ob;
    return (a.created_at || '') < (b.created_at || '') ? -1 : 1;
  });
}

export const abaDoTopico = (t) => (t.tipo === 'individual' ? 'pessoal' : 'conjunta');

export function itensDoTopico(topico) {
  const itens = state.itens[topico.id] || [];
  return topico.tipo === 'individual' ? itens.filter((it) => it.owner === state.user) : itens;
}

export function feitoParaMim(topico, item) {
  if (!state.user) return false;
  const pessoa = topico.tipo === 'individual' ? item.owner : state.user;
  return !!item[CAMPO[pessoa]];
}

export function encontrarItem(id) {
  for (const t in state.itens) {
    const it = state.itens[t].find((x) => x.id === id);
    if (it) return it;
  }
  return null;
}
const encontrarTopico = (id) => state.topicos.find((t) => t.id === id) || null;

// Itens "marcáveis" (exclui o tópico de lugares), opcionalmente por aba.
export function itensMarcaveis(aba) {
  const out = [];
  state.topicos.forEach((topico) => {
    if (topico.tipo === 'lugares') return;
    if (aba && abaDoTopico(topico) !== aba) return;
    itensDoTopico(topico).forEach((item) => out.push({ topico, item }));
  });
  return out;
}

export function contar(aba) {
  const todos = itensMarcaveis(aba);
  const feito = todos.filter((x) => feitoParaMim(x.topico, x.item)).length;
  return { total: todos.length, feito, falta: todos.length - feito };
}

/* ---------------- Render ---------------- */

function marksHtml(topico, item) {
  const botao = (pessoa, habilitado) => {
    const marcado = !!item[CAMPO[pessoa]];
    return `<button type="button" class="mark mark-${pessoa[0]}${marcado ? ' checked' : ''}" data-person="${pessoa}"` +
      ` aria-pressed="${marcado}" aria-label="${esc(PEOPLE[pessoa])}: ${marcado ? 'marcado' : 'não marcado'}"` +
      `${habilitado ? '' : ' disabled'}></button>`;
  };
  if (topico.tipo === 'individual') return `<span class="marks">${botao(item.owner, true)}</span>`;
  return `<span class="marks">${botao('fabricio', state.user === 'fabricio')}${botao('carol', state.user === 'carol')}</span>`;
}

function acoesHtml(comFoto, item) {
  return '<span class="item-actions">' +
    (comFoto ? `<button type="button" class="icon-btn" data-item-act="foto" title="Foto" aria-label="Anexar foto"${item.foto ? ' data-has="1"' : ''}>${ICON.cam}</button>` : '') +
    `<button type="button" class="icon-btn" data-item-act="editar" title="Editar" aria-label="Editar">${ICON.edit}</button>` +
    `<button type="button" class="icon-btn danger" data-item-act="remover" title="Remover" aria-label="Remover">${ICON.trash}</button>` +
    '</span>';
}

function lugarHtml(item) {
  const cidade = state.trip ? (state.trip.endereco_cidade || state.trip.local || '') : '';
  const q = [item.label, item.endereco, cidade].filter(Boolean).join(', ');
  return `<div class="place" data-item-id="${esc(item.id)}">` +
    '<div class="place-body">' +
      `<h3>${esc(item.label)}${item.categoria ? ` <span class="tag">${esc(item.categoria)}</span>` : ''}</h3>` +
      `<p>${esc(item.endereco || 'Endereço não informado')}${item.qty ? ` · <b>${esc(item.qty)}</b>` : ''}</p>` +
    '</div>' +
    `<a class="icon-btn" href="${esc(mapsUrl(q))}" target="_blank" rel="noopener" title="Abrir no mapa" aria-label="Abrir no mapa">${ICON.pin}</a>` +
    acoesHtml(false, item) + '</div>';
}

function itemHtml(topico, item) {
  if (topico.tipo === 'lugares') return lugarHtml(item);
  const feito = feitoParaMim(topico, item);
  const quem = item.assigned_to && topico.tipo !== 'individual'
    ? ` <span class="who who-${item.assigned_to[0]}" title="Dividido para ${esc(PEOPLE[item.assigned_to])}">${esc(PEOPLE[item.assigned_to])}</span>` : '';
  return `<div class="item${feito ? ' done' : ''}" data-item-id="${esc(item.id)}">` +
    marksHtml(topico, item) +
    (item.foto ? `<img class="item-foto" src="${esc(item.foto)}" alt="" data-item-act="ver-foto">` : '') +
    `<span class="txt" data-item-act="toggle"><b>${esc(item.label)}</b>${item.qty ? ` <span class="qty">${esc(item.qty)}</span>` : ''}${quem}</span>` +
    acoesHtml(true, item) + '</div>';
}

function topicoHtml(topico, aba) {
  const todos = itensDoTopico(topico);
  const q = busca[aba].trim().toLowerCase();
  let visiveis = todos;
  if (q) visiveis = visiveis.filter((it) => String(it.label || '').toLowerCase().includes(q));
  if (soFalta[aba] && topico.tipo !== 'lugares') visiveis = visiveis.filter((it) => !feitoParaMim(topico, it));

  // Com busca ativa, esconde tópicos sem nenhum resultado.
  if (q && !visiveis.length) return '';

  const ehLugar = topico.tipo === 'lugares';
  const feitos = ehLugar ? 0 : todos.filter((it) => feitoParaMim(topico, it)).length;
  const pct = todos.length ? Math.round((feitos / todos.length) * 100) : 0;

  let corpo = visiveis.map((it) => itemHtml(topico, it)).join('');
  if (!visiveis.length) corpo = `<p class="empty sm">${todos.length ? 'Tudo marcado aqui.' : 'Nenhum item ainda.'}</p>`;

  const addRow = `<div class="add-row" data-topico-id="${esc(topico.id)}">` +
    `<input type="text" class="add-name" placeholder="${ehLugar ? 'Lugar' : 'Adicionar item'}" aria-label="Novo item em ${esc(topico.nome)}" enterkeyhint="done">` +
    `<input type="text" class="add-extra" placeholder="${ehLugar ? 'Endereço' : 'Qtd'}" aria-label="${ehLugar ? 'Endereço' : 'Quantidade'}">` +
    '<button type="button" class="add-btn" aria-label="Adicionar">+</button></div>';

  return `<section class="topico${ehLugar ? ' topico-lugares' : ''}" data-topico-id="${esc(topico.id)}">` +
    '<header class="topico-head">' +
      `<h2 class="topico-nome">${esc(topico.nome)}</h2>` +
      (ehLugar ? `<span class="topico-count">${todos.length}</span>` : `<span class="topico-count${pct === 100 ? ' ok' : ''}">${feitos}/${todos.length}</span>`) +
      '<span class="item-actions">' +
        `<button type="button" class="icon-btn" data-topico-act="renomear" title="Renomear tópico" aria-label="Renomear tópico">${ICON.edit}</button>` +
        `<button type="button" class="icon-btn danger" data-topico-act="excluir" title="Excluir tópico" aria-label="Excluir tópico">${ICON.trash}</button>` +
      '</span>' +
    '</header>' +
    (ehLugar ? '' : `<div class="bar" aria-hidden="true"><i style="width:${pct}%"></i></div>`) +
    `<div class="card list">${corpo}${addRow}</div></section>`;
}

// Guarda o que está sendo digitado e onde está o cursor, para o realtime da
// outra pessoa não apagar o texto no meio da frase.
function snapshotRascunhos() {
  const snap = { valores: {}, foco: null, ini: null, fim: null };
  document.querySelectorAll('.add-row input').forEach((inp) => {
    const chave = inp.closest('.add-row').dataset.topicoId + '::' + inp.className;
    if (inp.value) snap.valores[chave] = inp.value;
    if (document.activeElement === inp) { snap.foco = chave; snap.ini = inp.selectionStart; snap.fim = inp.selectionEnd; }
  });
  return snap;
}
function restaurarRascunhos(snap) {
  document.querySelectorAll('.add-row input').forEach((inp) => {
    const chave = inp.closest('.add-row').dataset.topicoId + '::' + inp.className;
    if (snap.valores[chave] != null) inp.value = snap.valores[chave];
    if (snap.foco === chave) {
      inp.focus({ preventScroll: true });
      try { inp.setSelectionRange(snap.ini, snap.fim); } catch { /* tipo sem seleção */ }
    }
  });
}

export function renderTopicos() {
  const cont = { conjunta: $('topicosConjunta'), pessoal: $('topicosPessoal') };
  if (!cont.conjunta || !cont.pessoal) return;
  // Não re-renderiza por cima de uma edição inline em andamento.
  if (document.querySelector('.topico .edit-row')) { emit('lists:changed'); return; }
  const snap = snapshotRascunhos();
  const ordenados = topicosOrdenados();
  ['conjunta', 'pessoal'].forEach((aba) => {
    const lista = ordenados.filter((t) => abaDoTopico(t) === aba);
    let html = lista.map((t) => topicoHtml(t, aba)).join('');
    if (!lista.length) html = `<div class="empty-state"><p>Nenhum tópico ${aba === 'conjunta' ? 'conjunto' : 'pessoal'} ainda.</p><p class="sm">Crie o primeiro aqui embaixo.</p></div>`;
    else if (!html) html = '<p class="empty">Nada encontrado para essa busca.</p>';
    cont[aba].innerHTML = html;
  });
  restaurarRascunhos(snap);
  emit('lists:changed');
}

/* ---------------- Itens ---------------- */

export function toggleMarca(itemId) {
  const item = encontrarItem(itemId);
  if (!item || !state.user) return;
  const campo = CAMPO[state.user];
  item[campo] = !item[campo];
  renderTopicos();
  enfileirar(TABLES.itens, 'update', { [campo]: item[campo] }, itemId);
}

export function salvarItem(itemId, campos) {
  const item = encontrarItem(itemId);
  if (item) Object.assign(item, campos);
  renderTopicos();
  enfileirar(TABLES.itens, 'update', campos, itemId);
}

function editarItem(el) {
  if (!state.user) { toast('Escolha quem está acessando antes de editar.'); return; }
  const itemId = el.dataset.itemId;
  const item = encontrarItem(itemId);
  if (!item) return;
  const ehLugar = el.classList.contains('place');
  const alvo = el.querySelector(ehLugar ? '.place-body' : '.txt');

  const wrap = document.createElement('span');
  wrap.className = 'edit-row';
  wrap.innerHTML = `<input type="text" class="edit-name" aria-label="Nome"><input type="text" class="edit-extra" aria-label="${ehLugar ? 'Endereço' : 'Quantidade'}" placeholder="${ehLugar ? 'Endereço' : 'Qtd'}">`;
  const [inNome, inExtra] = wrap.querySelectorAll('input');
  inNome.value = item.label || '';
  inExtra.value = (ehLugar ? item.endereco : item.qty) || '';
  alvo.replaceWith(wrap);
  el.classList.add('editing');
  inNome.focus(); inNome.select();

  let feito = false;
  const terminar = (salvar) => {
    if (feito) return;
    feito = true;
    wrap.remove(); // libera o renderTopicos
    const nome = inNome.value.trim(), extra = inExtra.value.trim();
    if (!salvar || !nome) { renderTopicos(); return; }
    salvarItem(itemId, ehLugar ? { label: nome, endereco: extra || null } : { label: nome, qty: extra || null });
  };
  wrap.addEventListener('focusout', () => setTimeout(() => { if (!wrap.contains(document.activeElement)) terminar(true); }, 0));
  wrap.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter') { ev.preventDefault(); terminar(true); }
    if (ev.key === 'Escape') { ev.preventDefault(); ev.stopPropagation(); terminar(false); }
  });
}

// Exclusão: some da tela na hora, mas só vira DELETE no banco depois de UNDO_MS
// (ou ao recarregar/fechar a página). Nesse intervalo o "Desfazer" cancela tudo.
function removerItem(itemId) {
  const item = encontrarItem(itemId);
  if (!item) return;
  const tid = item.topico_id;
  const lista = state.itens[tid] || [];
  const pos = lista.findIndex((it) => it.id === itemId);
  const copia = clone(item);
  state.itens[tid] = lista.filter((it) => it.id !== itemId);
  renderTopicos();
  const cancelar = adiarExclusao(() => enfileirar(TABLES.itens, 'delete', null, itemId), UNDO_MS);
  toast(`Removido: <b>${esc(copia.label)}</b>`, {
    duracao: UNDO_MS - 200,
    desfazer: () => {
      if (!cancelar()) return;
      const l = (state.itens[tid] = state.itens[tid] || []);
      l.splice(pos < 0 ? l.length : pos, 0, copia);
      renderTopicos();
    },
  });
}

function adicionarItem(row) {
  if (!state.user) { toast('Escolha quem está acessando antes de adicionar itens.'); return; }
  if (!state.trip) return;
  const topico = encontrarTopico(row.dataset.topicoId);
  if (!topico) return;
  const inNome = row.querySelector('.add-name'), inExtra = row.querySelector('.add-extra');
  const nome = inNome.value.trim();
  if (!nome) { inNome.focus(); return; }

  const novo = {
    id: uid(), viagem_id: state.trip.id, topico_id: topico.id, label: nome,
    created_by: state.user, checked_fabricio: false, checked_carol: false,
  };
  if (topico.tipo === 'lugares') novo.endereco = inExtra.value.trim() || null;
  else {
    novo.qty = inExtra.value.trim() || null;
    if (topico.tipo === 'individual') novo.owner = state.user;
  }
  (state.itens[topico.id] = state.itens[topico.id] || []).push(novo);
  inNome.value = ''; inExtra.value = '';
  renderTopicos();
  const novoInput = document.querySelector(`.add-row[data-topico-id="${CSS.escape(topico.id)}"] .add-name`);
  if (novoInput) novoInput.focus({ preventScroll: true });
  enfileirar(TABLES.itens, 'insert', novo);
}

async function fotoDoItem(itemId) {
  const dataUrl = await escolherFoto();
  if (!dataUrl) return;
  salvarItem(itemId, { foto: dataUrl });
  toast('Foto anexada.');
}

function verFoto(itemId) {
  const item = encontrarItem(itemId);
  if (!item || !item.foto) return;
  abrirFotoViewer({ titulo: item.label, src: item.foto, onRemove: () => salvarItem(itemId, { foto: null }) });
}

/* ---------------- Tópicos ---------------- */

export function criarTopico(nome, tipo, ordem = state.topicos.length) {
  const novo = { id: uid(), viagem_id: state.trip.id, nome, tipo, ordem, created_by: state.user };
  state.topicos.push(novo);
  enfileirar(TABLES.topicos, 'insert', novo);
  return novo;
}

export function criarTopicosPadrao() {
  [['Mercado', 'compartilhado', 1], ['Bebidas', 'compartilhado', 2], ['Mala', 'individual', 3]]
    .forEach(([n, t, o]) => criarTopico(n, t, o));
  renderTopicos();
}

function criarTopicoNaAba(aba) {
  if (!state.user) { toast('Escolha quem está acessando antes de criar um tópico.'); return; }
  if (!state.trip) { toast('Escolha uma viagem antes de criar um tópico.'); return; }
  const input = $(aba === 'conjunta' ? 'topicoNomeConjunta' : 'topicoNomePessoal');
  const nome = input.value.trim();
  if (!nome) { input.focus(); return; }
  criarTopico(nome, aba === 'conjunta' ? 'compartilhado' : 'individual');
  input.value = '';
  renderTopicos();
  toast(`Tópico <b>${esc(nome)}</b> criado.`);
}

async function renomearTopico(id) {
  const topico = encontrarTopico(id);
  if (!topico) return;
  const nome = await perguntar('Renomear tópico', topico.nome);
  if (!nome || nome === topico.nome) return;
  topico.nome = nome;
  renderTopicos();
  enfileirar(TABLES.topicos, 'update', { nome }, id);
}

async function excluirTopico(id) {
  const topico = encontrarTopico(id);
  if (!topico) return;
  const qtd = (state.itens[id] || []).length;
  const ok = await confirmar(`O tópico "${topico.nome}"${qtd ? ` e os ${qtd} itens dele` : ''} serão excluídos.`, { titulo: 'Excluir tópico?' });
  if (!ok) return;
  const copiaTopico = clone(topico);
  const copiaItens = clone(state.itens[id] || []);
  state.topicos = state.topicos.filter((t) => t.id !== id);
  delete state.itens[id];
  renderTopicos();
  const cancelar = adiarExclusao(() => {
    enfileirar(TABLES.itens, 'deleteBy', { campo: 'topico_id', valor: id });
    enfileirar(TABLES.topicos, 'delete', null, id);
  }, UNDO_MS);
  toast(`Tópico removido: <b>${esc(copiaTopico.nome)}</b>`, {
    duracao: UNDO_MS - 200,
    desfazer: () => {
      if (!cancelar()) return;
      state.topicos.push(copiaTopico);
      state.itens[id] = copiaItens;
      renderTopicos();
    },
  });
}

export async function limparMinhasMarcas() {
  if (!state.user) return;
  const ok = await confirmar('Todos os SEUS itens serão desmarcados. As marcações da outra pessoa não mudam.',
    { titulo: 'Limpar suas marcações?', okTexto: 'Limpar' });
  if (!ok) return;
  const campo = CAMPO[state.user];
  const ids = [];
  itensMarcaveis().forEach(({ item }) => { if (item[campo]) { item[campo] = false; ids.push(item.id); } });
  renderTopicos();
  ids.forEach((id) => enfileirar(TABLES.itens, 'update', { [campo]: false }, id));
  toast(`${ids.length} item(ns) desmarcado(s).`);
}

/* ---------------- Eventos (delegação) ---------------- */

document.addEventListener('click', (e) => {
  const t = e.target;
  if (!t.closest) return;

  const mark = t.closest('.item .mark');
  if (mark) {
    if (!mark.disabled && mark.dataset.person === state.user) toggleMarca(mark.closest('.item').dataset.itemId);
    return;
  }

  const act = t.closest('[data-item-act]');
  if (act) {
    const row = act.closest('[data-item-id]');
    const id = row.dataset.itemId;
    switch (act.dataset.itemAct) {
      case 'toggle':   if (state.user) toggleMarca(id); break;
      case 'editar':   editarItem(row); break;
      case 'remover':  removerItem(id); break;
      case 'foto':     fotoDoItem(id); break;
      case 'ver-foto': verFoto(id); break;
    }
    return;
  }

  const tAct = t.closest('[data-topico-act]');
  if (tAct) {
    const id = tAct.closest('.topico').dataset.topicoId;
    if (tAct.dataset.topicoAct === 'renomear') renomearTopico(id); else excluirTopico(id);
    return;
  }

  const add = t.closest('.add-row .add-btn');
  if (add) adicionarItem(add.closest('.add-row'));
});

document.addEventListener('keydown', (e) => {
  const inp = e.target.closest && e.target.closest('.add-row input');
  if (inp && e.key === 'Enter') { e.preventDefault(); adicionarItem(inp.closest('.add-row')); }
});

['conjunta', 'pessoal'].forEach((aba) => {
  const Aba = aba.charAt(0).toUpperCase() + aba.slice(1);
  const input = $('busca' + Aba), btn = $('filtroFalta' + Aba);
  input.addEventListener('input', () => { busca[aba] = input.value; renderTopicos(); });
  btn.addEventListener('click', () => {
    soFalta[aba] = !soFalta[aba];
    btn.setAttribute('aria-pressed', soFalta[aba] ? 'true' : 'false');
    renderTopicos();
  });
  $('topicoAdd' + Aba).addEventListener('click', () => criarTopicoNaAba(aba));
  $('topicoNome' + Aba).addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); criarTopicoNaAba(aba); } });
});
