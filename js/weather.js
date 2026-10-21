/* ===========================================================================
   CLIMA — Open-Meteo, sem chave de API.
   A previsão só existe ~16 dias à frente; fora dessa janela o card explica
   quando ela aparece em vez de inventar um número.
   ======================================================================== */

import { state } from './state.js';
import { LS } from './config.js';
import { esc, lsGet, lsSet } from './utils.js';
import { parseData, isoDe, hoje, UM_DIA, DIAS_SEMANA, diasEntre, tituloCurto } from './dates.js';

const WMO = {
  0: ['☀️', 'Céu limpo'], 1: ['🌤️', 'Sol com nuvens'], 2: ['⛅', 'Parcialmente nublado'], 3: ['☁️', 'Nublado'],
  45: ['🌫️', 'Névoa'], 48: ['🌫️', 'Névoa'], 51: ['🌦️', 'Garoa'], 53: ['🌦️', 'Garoa'], 55: ['🌦️', 'Garoa forte'],
  61: ['🌧️', 'Chuva fraca'], 63: ['🌧️', 'Chuva'], 65: ['🌧️', 'Chuva forte'],
  71: ['🌨️', 'Neve'], 73: ['🌨️', 'Neve'], 75: ['🌨️', 'Neve'],
  80: ['🌦️', 'Pancadas'], 81: ['🌧️', 'Pancadas'], 82: ['⛈️', 'Pancadas fortes'],
  95: ['⛈️', 'Tempestade'], 96: ['⛈️', 'Tempestade'], 99: ['⛈️', 'Tempestade'],
};
const JANELA = 15;

export async function carregarClima() {
  state.clima = null;
  const t = state.trip;
  if (!t || !t.lat || !t.lon || !t.data_inicio) return;
  const inicio = parseData(t.data_inicio);
  const fim = parseData(t.data_fim) || inicio;
  const h = hoje();
  const limite = new Date(h.getTime() + JANELA * UM_DIA);
  if (inicio > limite) return;
  const de = inicio < h ? h : inicio;
  const ate = fim > limite ? limite : fim;
  if (ate < de) return;
  try {
    const url = 'https://api.open-meteo.com/v1/forecast?latitude=' + t.lat + '&longitude=' + t.lon +
      '&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max' +
      '&timezone=America%2FSao_Paulo&start_date=' + isoDe(de) + '&end_date=' + isoDe(ate);
    const res = await fetch(url);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();
    if (data && data.daily && data.daily.time) {
      state.clima = data.daily;
      lsSet(LS.clima(t.id), { daily: state.clima, quando: Date.now() });
    }
  } catch {
    const cache = lsGet(LS.clima(t.id), null);   // offline: usa a última previsão
    if (cache && cache.daily) state.clima = cache.daily;
  }
}

const card = (corpo) => `<div class="card today-card"><h3 class="card-title">Previsão do tempo</h3>${corpo}</div>`;

export function cardClima() {
  const t = state.trip, c = state.clima;
  if (!t) return '';
  if (!t.lat || !t.lon) return card('<p class="empty sm">Escolha o local da hospedagem no mapa (Editar viagem) para ver a previsão.</p>');
  if (!c || !c.time || !c.time.length) {
    const inicio = parseData(t.data_inicio);
    const faltam = inicio ? diasEntre(hoje(), inicio) : null;
    return card(`<p class="empty sm">${faltam && faltam > JANELA
      ? `A previsão fica disponível ${JANELA} dias antes — aparece aqui em ${faltam - JANELA} dias.`
      : 'Não foi possível carregar a previsão agora.'}</p>`);
  }

  const probs = c.precipitation_probability_max || [];
  const dias = c.time.map((iso, i) => {
    const d = parseData(iso);
    const code = c.weather_code[i];
    const [icone, desc] = WMO[code] || ['🌡️', '—'];
    const prob = probs[i];
    const chuvoso = (prob != null && prob >= 60) || code >= 61;
    return `<div class="wx-day${chuvoso ? ' rain' : ''}" title="${esc(desc)}">` +
      `<span class="wx-d">${DIAS_SEMANA[d.getDay()].slice(0, 3)} ${d.getDate()}</span>` +
      `<span class="wx-i">${icone}</span>` +
      `<span class="wx-t">${Math.round(c.temperature_2m_max[i])}° <small>${Math.round(c.temperature_2m_min[i])}°</small></span>` +
      (prob != null ? `<span class="wx-p">${prob}%</span>` : '') + '</div>';
  }).join('');

  // Se algum dia tem chuva alta, aponta para as trocas do roteiro.
  let alerta = '';
  const idx = probs.findIndex((p) => p >= 70);
  if (idx !== -1) {
    const d = parseData(c.time[idx]);
    const iDia = diasEntre(parseData(t.data_inicio), d);
    const r = state.roteiro;
    const dia = r && r.dias && r.dias[iDia];
    const trocas = ((r && r.secoes) || []).find((s) => /troca/i.test(s.id || '') || /troca/i.test(s.titulo || ''));
    alerta = `<div class="callout"><b>${probs[idx]}% de chuva em ${DIAS_SEMANA[d.getDay()]}, dia ${d.getDate()}.</b> ` +
      (dia ? `O plano desse dia é "${esc(tituloCurto(dia.titulo))}". ` : '') +
      (trocas ? `Veja "<b>${esc(trocas.titulo)}</b>" no Guia.` : 'Vale já pensar num plano B.') + '</div>';
  }
  return card(`<div class="wx-row">${dias}</div>${alerta}`);
}
