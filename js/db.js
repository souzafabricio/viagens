/* ===========================================================================
   Supabase + CAMADA OFFLINE
   Toda escrita é aplicada na memória e no cache local primeiro, depois entra
   numa fila (outbox) drenada quando há rede. É isso que faz o app funcionar
   em Castelhanos, onde não há sinal.
   Ids são gerados no cliente (uuid): uma linha criada offline mantém o mesmo
   id ao subir — não é preciso remapear referência nenhuma.
   ======================================================================== */

import { SUPABASE_URL, SUPABASE_KEY, LS } from './config.js';
import { state } from './state.js';
import { uid, lsGet, lsSet, $ } from './utils.js';

// Se o CDN do Supabase não carregar (wifi de hotel, portal cativo, offline no
// primeiro acesso), o app NÃO pode morrer: cai para modo local e segue.
export let supa = null;
try {
  if (window.supabase && typeof window.supabase.createClient === 'function') {
    supa = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
  }
} catch (err) {
  console.warn('Supabase indisponível — modo local.', err);
}

let outbox = lsGet(LS.outbox, []);
let mostrarOkAoTerminar = false;

function salvarOutbox() { lsSet(LS.outbox, outbox); atualizarSyncPill(); }

export function enfileirar(table, action, payload, matchId) {
  outbox.push({ oid: uid(), table, action, payload, matchId: matchId || null });
  salvarOutbox();
  drenarOutbox();
}

async function executar(op) {
  const t = supa.from(op.table);
  switch (op.action) {
    case 'insert':   return t.insert(op.payload);
    case 'update':   return t.update(op.payload).eq('id', op.matchId);
    case 'upsert':   return t.upsert(op.payload);
    case 'delete':   return t.delete().eq('id', op.matchId);
    case 'deleteBy': return t.delete().eq(op.payload.campo, op.payload.valor);
    default:         return { error: null };
  }
}

// Uma drenagem por vez; quem chama durante uma em andamento recebe a mesma
// promessa (o carregamento da viagem espera a fila esvaziar antes de ler).
let drenagem = null;
export function drenarOutbox() {
  if (!drenagem) drenagem = drenar().finally(() => { drenagem = null; atualizarSyncPill(); });
  return drenagem;
}

async function drenar() {
  if (!supa || !outbox.length) return;
  if (!navigator.onLine) return;
  atualizarSyncPill();
  while (outbox.length) {
    const op = outbox[0];
    let res;
    try { res = await executar(op); } catch (err) { res = { error: err }; }
    if (res && res.error) {
      const msg = String(res.error.message || res.error);
      // Erro de rede: para e tenta de novo depois, sem perder a operação.
      if (/fetch|network|timeout/i.test(msg)) return;
      // Erro de dados (linha já apagada, coluna inexistente): descarta e segue,
      // senão a fila trava para sempre num item impossível.
      console.error('Operação descartada da fila:', op, res.error);
    }
    outbox.shift();
    salvarOutbox();
  }
}

// Ids que ainda têm DELETE esperando na fila — o carregamento os esconde,
// senão o que foi excluído offline "volta" ao recarregar.
export function exclusoesPendentes(table) {
  const ids = new Set(), porCampo = [];
  outbox.forEach((op) => {
    if (op.table !== table) return;
    if (op.action === 'delete') ids.add(op.matchId);
    else if (op.action === 'deleteBy') porCampo.push(op.payload);
  });
  return (row) => ids.has(row.id) || porCampo.some((c) => row[c.campo] === c.valor);
}

/* ---- exclusão com "Desfazer" ----
   Some da tela na hora e só entra na fila depois de ms. Se a página for
   recarregada ou fechada antes, a exclusão é efetivada na saída — antes ela
   se perdia e o tópico/item "voltava". */
const exclusoesAdiadas = new Map();

// Retorna cancelar(): true se cancelou a tempo.
export function adiarExclusao(efetivar, ms) {
  const chave = uid();
  const timer = setTimeout(() => { exclusoesAdiadas.delete(chave); efetivar(); }, ms);
  exclusoesAdiadas.set(chave, { timer, efetivar });
  return () => {
    if (!exclusoesAdiadas.has(chave)) return false;
    clearTimeout(timer);
    exclusoesAdiadas.delete(chave);
    return true;
  };
}

window.addEventListener('pagehide', () => {
  exclusoesAdiadas.forEach(({ timer, efetivar }) => { clearTimeout(timer); efetivar(); });
  exclusoesAdiadas.clear();
});

export function avisarQuandoSincronizar() { if (outbox.length) mostrarOkAoTerminar = true; }

export function atualizarSyncPill() {
  const pill = $('syncPill');
  if (!pill) return;
  const txt = pill.querySelector('.sync-txt');
  pill.className = 'sync-pill';
  if (!navigator.onLine) {
    pill.classList.add('show', 'offline');
    txt.textContent = outbox.length ? `Offline · ${outbox.length} na fila` : 'Offline';
  } else if (outbox.length) {
    pill.classList.add('show', 'pending');
    txt.textContent = outbox.length === 1 ? '1 pendente' : `${outbox.length} pendentes`;
  } else if (mostrarOkAoTerminar) {
    mostrarOkAoTerminar = false;
    pill.classList.add('show', 'synced');
    txt.textContent = 'Sincronizado';
    setTimeout(() => pill.classList.remove('show'), 2600);
  }
}

/* ---- cache local por viagem (o app abre offline) ---- */

export function salvarCache() {
  if (!state.trip) return;
  lsSet(LS.cache(state.trip.id), {
    trip: state.trip, topicos: state.topicos, itens: state.itens,
    roteiro: state.roteiro, diario: state.diario, quando: Date.now(),
  });
}

export function carregarCache(tripId) {
  const c = lsGet(LS.cache(tripId), null);
  if (!c) return false;
  state.topicos = c.topicos || [];
  state.itens = c.itens || {};
  state.roteiro = c.roteiro || null;
  state.diario = c.diario || [];
  return true;
}
