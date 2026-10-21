/* ===========================================================================
   HOJE — antes da viagem: contagem e pendências; durante: o que vem agora.
   ======================================================================== */

import { state } from './state.js';
import { $, esc, mapsUrl, plural } from './utils.js';
import { faseDaViagem, periodoExtenso, DIAS_SEMANA, tituloCurto } from './dates.js';
import { itensMarcaveis, feitoParaMim, contar } from './lists.js';
import { cardClima } from './weather.js';
import { ICON } from './icons.js';

// "9h30", "14h", "Manhã" → minutos desde a meia-noite.
function minutosDe(h) {
  if (!h) return null;
  const s = String(h).toLowerCase().trim();
  if (s === 'manhã' || s === 'manha') return 8 * 60;
  if (s === 'tarde') return 14 * 60;
  if (s === 'durante' || s === 'noite') return 20 * 60;
  const m = s.match(/^(\d{1,2})h(\d{2})?/);
  return m ? Number(m[1]) * 60 + (m[2] ? Number(m[2]) : 0) : null;
}

function emQuanto(min) {
  if (min <= 0) return 'É agora';
  if (min < 60) return `em ${min} min`;
  return `em ${Math.floor(min / 60)}h${min % 60 ? String(min % 60).padStart(2, '0') : ''}`;
}

// Telefones do dia viram botão de um toque; o destaque vira link de mapa.
function acoesDoDia(dia) {
  const texto = (dia.itens || []).map((i) => (i.b || '') + ' ' + (i.s || '')).join(' ') + ' ' + (dia.fork || '');
  const tels = [...new Set(texto.match(/\(\d{2}\)\s?\d{4,5}-\d{4}/g) || [])].slice(0, 3);
  const destaque = (dia.itens || []).find((i) => i.hi);
  const cidade = state.trip.endereco_cidade || state.trip.local || '';
  const acoes = [];
  if (destaque) acoes.push(`<a class="chip" href="${esc(mapsUrl(destaque.b + ' ' + cidade))}" target="_blank" rel="noopener">${ICON.pin} Abrir no mapa</a>`);
  tels.forEach((t) => acoes.push(`<a class="chip" href="tel:${t.replace(/\D/g, '')}">${ICON.phone} ${esc(t)}</a>`));
  acoes.push(`<button type="button" class="chip" data-action="mercado">${ICON.cart} Modo mercado</button>`);
  return `<div class="chip-row">${acoes.join('')}</div>`;
}

function cardPendencias() {
  const faltando = itensMarcaveis().filter((x) => !feitoParaMim(x.topico, x.item)).map((x) => x.item.label);
  if (!faltando.length) return '<div class="card today-card"><h3 class="card-title">Sua lista</h3><p class="empty sm">Tudo marcado. Nada pendente.</p></div>';
  return `<div class="card today-card"><h3 class="card-title">Falta você marcar <span class="count">${faltando.length}</span></h3>` +
    '<div class="tag-cloud">' + faltando.slice(0, 24).map((n) => `<span>${esc(n)}</span>`).join('') +
    (faltando.length > 24 ? `<span class="more">+${faltando.length - 24}</span>` : '') + '</div></div>';
}

export function renderHoje() {
  const cont = $('hojeConteudo');
  if (!cont) return;
  const t = state.trip;
  if (!t) { cont.innerHTML = '<p class="empty">Escolha uma viagem.</p>'; return; }

  const s = faseDaViagem(t);
  let html = '';

  if (s.fase !== 'durante') {
    if (s.fase === 'antes' || s.fase === null) {
      const r = contar();
      const pct = r.total ? Math.round((r.feito / r.total) * 100) : 0;
      html += '<div class="spotlight">' +
        `<p class="eyebrow">${s.fase === 'antes' ? 'Contagem regressiva' : 'Sem data definida'}</p>` +
        `<h2>${s.fase === 'antes' ? (s.dias === 1 ? 'Falta 1 dia' : `Faltam ${s.dias} dias`) : esc(t.nome)}</h2>` +
        `<p>${esc(periodoExtenso(t.data_inicio, t.data_fim) || 'Defina as datas em Editar viagem.')}</p>` +
        `<div class="spot-progress"><div class="bar"><i style="width:${pct}%"></i></div><span>${r.feito} de ${plural(r.total, 'item pronto', 'itens prontos')}</span></div>` +
        '</div>';
      html += cardPendencias() + cardClima();
    } else {
      html += '<div class="spotlight"><p class="eyebrow">Depois da viagem</p><h2>Viagem concluída</h2>' +
        '<p>Guarde as memórias na aba Diário.</p>' +
        '<div class="chip-row"><button type="button" class="chip" data-tab-go="diario">Abrir o diário</button></div></div>';
    }
    cont.innerHTML = html;
    return;
  }

  const dia = state.roteiro && state.roteiro.dias ? state.roteiro.dias[s.indice] : null;
  const agora = new Date();
  const minAgora = agora.getHours() * 60 + agora.getMinutes();

  if (dia) {
    const proximo = (dia.itens || []).find((it) => { const m = minutosDe(it.h); return m !== null && m >= minAgora; });
    html += '<div class="spotlight">' +
      `<p class="eyebrow">${DIAS_SEMANA[agora.getDay()]} · ${esc(dia.dnum)} de ${state.roteiro.dias.length}</p>` +
      `<h2>${esc(tituloCurto(dia.titulo))}</h2>` +
      (proximo
        ? `<p><b>A seguir:</b> ${esc(proximo.b)}</p><span class="pill pill-sand">${emQuanto(minutosDe(proximo.h) - minAgora)} · ${esc(proximo.h)}</span>`
        : '<p>O roteiro de hoje acabou. Boa noite.</p>') +
      acoesDoDia(dia) + '</div>';

    html += '<div class="card today-card"><h3 class="card-title">O dia inteiro</h3><ul class="timeline compact">' +
      (dia.itens || []).map((it) => {
        const m = minutosDe(it.h);
        const cls = it === proximo ? 'now' : (m !== null && m < minAgora ? 'past' : '');
        return `<li class="${cls}"><span class="t-time">${esc(it.h || '')}</span>` +
          `<span class="t-body"><b>${esc(it.b)}</b>${it.s ? `<small>${it.s}</small>` : ''}</span></li>`;
      }).join('') + '</ul></div>';
  } else {
    html += `<div class="spotlight"><p class="eyebrow">Dia ${s.indice + 1} da viagem</p><h2>Sem roteiro para hoje</h2>` +
      '<p>Importe ou monte o roteiro na aba Guia.</p></div>';
  }
  cont.innerHTML = html + cardClima() + cardPendencias();
}
