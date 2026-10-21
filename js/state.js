// Estado global do app + um barramento de eventos mínimo.
// Os módulos leem/escrevem em `state` e avisam mudanças com emit(); o main.js
// decide o que re-renderizar. Isso evita importações circulares entre telas.

import { LS, TABS } from './config.js';
import { lsRaw } from './utils.js';

const abaSalva = lsRaw(LS.tab);

export const state = {
  user: lsRaw(LS.user),      // 'fabricio' | 'carol' | null
  trip: null,                // linha de `viagens`
  topicos: [],
  itens: {},                 // { [topico_id]: item[] }
  roteiro: null,             // { dias:[], secoes:[], nota }
  diario: [],
  clima: null,               // daily do Open-Meteo
  tab: TABS.includes(abaSalva) ? abaSalva : 'hoje',
  screen: null,
};

const handlers = {};
export function on(evento, fn) { (handlers[evento] = handlers[evento] || []).push(fn); }
export function emit(evento, dados) { (handlers[evento] || []).forEach((fn) => fn(dados)); }

export function limparDadosDaViagem() {
  state.topicos = [];
  state.itens = {};
  state.roteiro = null;
  state.diario = [];
  state.clima = null;
}
