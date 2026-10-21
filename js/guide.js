/* ===========================================================================
   GUIA — roteiro dia a dia. É DADO (viagem_roteiro.conteudo, jsonb), uma
   linha por viagem. Viagem nova nasce sem roteiro e mostra o estado vazio;
   Ilhabela vira uma semente importável com um clique.
   Obs.: os campos de texto do roteiro aceitam HTML simples (negrito, links).
   ======================================================================== */

import { state, emit } from './state.js';
import { TABLES } from './config.js';
import { $, esc, clone } from './utils.js';
import { enfileirar, salvarCache } from './db.js';
import { toast } from './ui.js';
import { indiceDiaHoje } from './dates.js';
import { SEED_ILHABELA } from './seed-ilhabela.js';

const EXTENSO = ['zero', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove', 'dez'];

function vazioHtml() {
  return '<div class="empty-state big">' +
    '<h3>Esta viagem ainda não tem roteiro</h3>' +
    '<p>O roteiro fica salvo por viagem — cada destino tem o seu. Dá para começar com o de Ilhabela e editar depois.</p>' +
    '<button type="button" class="btn btn-primary" id="btnImportarSeed">Importar roteiro de Ilhabela</button></div>';
}

function diaHtml(d, i, idxHoje) {
  const ehHoje = i === idxHoje;
  return `<article class="day ${esc(d.cor || '')}${ehHoje ? ' is-today' : ''}" id="guia-${esc(d.id)}">` +
    '<header class="day-head">' +
      `<span class="day-num">${esc(d.dnum)}</span><h3>${esc(d.titulo)}</h3>` +
      (ehHoje ? '<span class="pill pill-sand">Hoje</span>' : '') +
      (d.tag ? `<span class="day-tag">${esc(d.tag)}</span>` : '') +
    '</header>' +
    (d.fork ? `<div class="callout">${d.fork}</div>` : '') +
    '<ul class="timeline">' + (d.itens || []).map((it) =>
      `<li${it.hi ? ' class="hi"' : ''}><span class="t-time">${esc(it.h || '')}</span>` +
      `<span class="t-body"><b>${esc(it.b || '')}</b>${it.s ? `<small>${it.s}</small>` : ''}</span></li>`).join('') +
    '</ul></article>';
}

function secaoHtml(s) {
  let html = `<section class="guide-section" id="${esc(s.id)}"><h2 class="section-title">${esc(s.titulo)}</h2>`;
  if (s.tipo === 'warns') {
    html += (s.itens || []).map((t) => `<div class="warn">${t}</div>`).join('');
  } else {
    html += '<div class="card info-box">' + (s.grupos || []).map((g) =>
      `<h4>${esc(g.h4)}</h4><ul>` + (g.linhas || []).map((l) =>
        `<li><span class="ib-d">${l.d || ''}</span><span class="ib-n">${l.n || ''}${l.s ? `<small>${l.s}</small>` : ''}</span></li>`).join('') +
      '</ul>').join('');
    if (s.links && s.links.length) {
      html += '<div class="link-row">' + s.links.map((l) =>
        `<a class="chip" href="${esc(l.u)}" target="_blank" rel="noopener">${esc(l.t)} ↗</a>`).join('') + '</div>';
    }
    html += '</div>';
  }
  return html + '</section>';
}

export function renderGuia() {
  const jump = $('guiaJump'), cont = $('guiaConteudo');
  if (!cont) return;
  const r = state.roteiro;
  if (!r || !r.dias || !r.dias.length) {
    jump.innerHTML = '';
    jump.hidden = true;
    cont.innerHTML = vazioHtml();
    return;
  }
  jump.hidden = false;
  const idxHoje = indiceDiaHoje(state.trip);
  jump.innerHTML = r.dias.map((d, i) =>
    `<a href="#guia-${esc(d.id)}" class="chip${i === idxHoje ? ' chip-active' : ''}">${esc(d.titulo.split('—')[0].trim())}</a>`)
    .concat((r.secoes || []).map((s) => `<a href="#${esc(s.id)}" class="chip">${esc(s.titulo.split(' ').slice(0, 2).join(' '))}</a>`))
    .join('');

  const n = r.dias.length;
  let html = `<section class="guide-section"><h2 class="section-title">Os ${EXTENSO[n] || n} dias</h2>` +
    r.dias.map((d, i) => diaHtml(d, i, idxHoje)).join('') + '</section>';
  html += (r.secoes || []).map(secaoHtml).join('');
  if (r.nota) html += `<p class="note">${r.nota}</p>`;
  cont.innerHTML = html;
}

export function salvarRoteiro() {
  if (!state.trip) return;
  salvarCache();
  enfileirar(TABLES.roteiro, 'upsert', { viagem_id: state.trip.id, conteudo: state.roteiro });
}

function importarIlhabela() {
  if (!state.trip) return;
  state.roteiro = clone(SEED_ILHABELA);
  salvarRoteiro();
  emit('roteiro:changed');
  toast('Roteiro importado — agora ele pertence a esta viagem.');
}

document.addEventListener('click', (e) => {
  if (e.target.closest && e.target.closest('#btnImportarSeed')) importarIlhabela();
  // Âncoras do índice: rola levando em conta o cabeçalho fixo.
  const a = e.target.closest && e.target.closest('#guiaJump a');
  if (a) {
    e.preventDefault();
    const alvo = document.querySelector(a.getAttribute('href'));
    if (alvo) alvo.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
});
