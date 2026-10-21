/* ===========================================================================
   Carregar a viagem do servidor + inscrição no realtime do Supabase.
   ======================================================================== */

import { state, emit } from './state.js';
import { TABLES, PEOPLE } from './config.js';
import { esc } from './utils.js';
import { supa, salvarCache } from './db.js';
import { toast } from './ui.js';
import { renderTopicos } from './lists.js';

let canais = [];

export async function carregarTudoDaViagem() {
  if (!supa || !state.trip) return;
  const id = state.trip.id;
  try {
    const [resT, resI, resR, resD] = await Promise.all([
      supa.from(TABLES.topicos).select('*').eq('viagem_id', id),
      supa.from(TABLES.itens).select('*').eq('viagem_id', id).order('created_at'),
      supa.from(TABLES.roteiro).select('conteudo').eq('viagem_id', id).maybeSingle(),
      supa.from(TABLES.diario).select('*').eq('viagem_id', id).order('created_at'),
    ]);
    if (!state.trip || state.trip.id !== id) return; // trocou de viagem no meio
    if (!resT.error) state.topicos = resT.data || [];
    if (!resI.error) {
      state.itens = {};
      (resI.data || []).forEach((it) => (state.itens[it.topico_id] = state.itens[it.topico_id] || []).push(it));
    }
    if (!resR.error) state.roteiro = resR.data ? resR.data.conteudo : null;
    if (!resD.error) state.diario = resD.data || [];
  } catch (err) {
    console.warn('Sem rede ao carregar — seguindo com o cache local.', err);
  }
  salvarCache();
  emit('data:loaded');
}

export function desinscrever() {
  if (supa) canais.forEach((c) => supa.removeChannel(c));
  canais = [];
}

function canal(nome, tabela, handler) {
  const filter = 'viagem_id=eq.' + state.trip.id;
  return supa.channel(nome + '-' + state.trip.id)
    .on('postgres_changes', { event: '*', schema: 'public', table: tabela, filter }, handler)
    .subscribe();
}

function upsertEm(lista, linha) {
  const i = lista.findIndex((x) => x.id === linha.id);
  if (i === -1) lista.push(linha); else lista[i] = linha;
}

export function inscreverRealtime() {
  if (!supa || !state.trip) return;
  desinscrever();

  canais.push(canal('t', TABLES.topicos, (p) => {
    if (p.eventType === 'DELETE') {
      state.topicos = state.topicos.filter((t) => t.id !== p.old.id);
      delete state.itens[p.old.id];
    } else upsertEm(state.topicos, p.new);
    renderTopicos();
  }));

  canais.push(canal('i', TABLES.itens, (p) => {
    if (p.eventType === 'DELETE') {
      // O payload de DELETE só traz a chave primária: procura em todos os tópicos.
      for (const tid in state.itens) state.itens[tid] = state.itens[tid].filter((it) => it.id !== p.old.id);
      renderTopicos();
      return;
    }
    const novo = p.new, antigo = p.old;
    upsertEm((state.itens[novo.topico_id] = state.itens[novo.topico_id] || []), novo);
    renderTopicos();
    if (p.eventType === 'UPDATE' && antigo && state.user) {
      ['fabricio', 'carol'].forEach((pessoa) => {
        const campo = 'checked_' + pessoa;
        if (pessoa !== state.user && campo in antigo && antigo[campo] !== novo[campo]) {
          toast(`<b>${esc(PEOPLE[pessoa])}</b> ${novo[campo] ? 'marcou' : 'desmarcou'}: ${esc(novo.label)}`);
        }
      });
    }
  }));

  canais.push(canal('r', TABLES.roteiro, (p) => {
    state.roteiro = p.eventType === 'DELETE' ? null : p.new.conteudo;
    salvarCache();
    emit('roteiro:changed');
  }));

  canais.push(canal('d', TABLES.diario, (p) => {
    if (p.eventType === 'DELETE') state.diario = state.diario.filter((m) => m.id !== p.old.id);
    else upsertEm(state.diario, p.new);
    salvarCache();
    emit('diario:changed');
  }));
}
