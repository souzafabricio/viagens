/* ===========================================================================
   Seção "mapa" do Guia — trajeto de carro entre pontos fixos, desenhado com
   Leaflet. A rota vem do OSRM (estradas reais) e fica em cache local, para o
   mapa abrir sem sinal; sem rota, liga os pontos em linha tracejada.
   Formato: { id, titulo, tipo:'mapa', pontos:[{ n, s?, lat, lon }], links? }
   ======================================================================== */

import { esc, lsGet, lsSet } from './utils.js';

const OSRM = 'https://router.project-osrm.org/route/v1/driving/';
const LETRAS = 'ABCDEFGHIJ';

export function rotaHtml(s) {
  const pontos = s.pontos || [];
  return '<div class="card route-card">' +
    `<div class="route-map" data-rota="${esc(s.id)}" role="img" aria-label="Mapa da rota: ${esc(pontos.map((p) => p.n).join(' → '))}"></div>` +
    '<p class="route-resumo" data-rota-resumo>Carregando a rota…</p>' +
    '<ol class="route-stops">' + pontos.map((p, i) =>
      `<li><span class="route-pin">${LETRAS[i]}</span><span class="ib-n">${esc(p.n)}${p.s ? `<small>${p.s}</small>` : ''}</span></li>`).join('') +
    '</ol>' +
    (s.links && s.links.length ? '<div class="link-row">' + s.links.map((l) =>
      `<a class="chip" href="${esc(l.u)}" target="_blank" rel="noopener">${esc(l.t)} ↗</a>`).join('') + '</div>' : '') +
    '</div>';
}

function formatarDuracao(seg) {
  const min = Math.round(seg / 60), h = Math.floor(min / 60), m = min % 60;
  return h ? `${h}h${m ? String(m).padStart(2, '0') : ''}` : `${m} min`;
}

async function buscarRota(pontos) {
  const coords = pontos.map((p) => `${p.lon},${p.lat}`).join(';');
  const chave = 'rota:' + coords;
  const salvo = lsGet(chave, null);
  if (salvo) return salvo;
  const data = await (await fetch(OSRM + coords + '?overview=full&geometries=geojson')).json();
  if (data.code !== 'Ok' || !data.routes || !data.routes.length) throw new Error('sem rota');
  const r = data.routes[0];
  const rota = {
    linha: r.geometry.coordinates.map(([lon, lat]) => [lat, lon]),
    km: r.distance / 1000, seg: r.duration,
  };
  lsSet(chave, rota);
  return rota;
}

async function montar(el, s) {
  const L = window.L;
  const cor = getComputedStyle(document.documentElement).getPropertyValue('--sea').trim() || '#2f7f8c';
  const pontos = s.pontos || [];
  const resumo = el.parentElement.querySelector('[data-rota-resumo]');
  const mapa = L.map(el, { scrollWheelZoom: false, tap: false });
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; OpenStreetMap' }).addTo(mapa);
  pontos.forEach((p, i) => {
    L.marker([p.lat, p.lon], {
      icon: L.divIcon({ className: 'route-marker', html: `<span class="route-pin">${LETRAS[i]}</span>`, iconSize: [26, 26], iconAnchor: [13, 13] }),
      title: p.n,
    }).addTo(mapa).bindPopup(`<b>${esc(p.n)}</b>`);
  });
  const limites = L.latLngBounds(pontos.map((p) => [p.lat, p.lon]));
  mapa.fitBounds(limites, { padding: [24, 24] });

  try {
    const rota = await buscarRota(pontos);
    const linha = L.polyline(rota.linha, { color: cor, weight: 5, opacity: .85 }).addTo(mapa);
    mapa.fitBounds(linha.getBounds(), { padding: [24, 24] });
    resumo.textContent = `≈ ${Math.round(rota.km)} km · ${formatarDuracao(rota.seg)} de carro, sem paradas e sem trânsito`;
  } catch {
    L.polyline(pontos.map((p) => [p.lat, p.lon]), { color: cor, weight: 3, dashArray: '6 8' }).addTo(mapa);
    resumo.textContent = 'Sem conexão para traçar as estradas — a linha só liga os pontos.';
  }
}

// Monta cada mapa só quando ele aparece na tela: numa aba escondida o
// container tem tamanho zero e o Leaflet desenharia errado.
export function ativarMapasDeRota(container, secoes) {
  const porId = Object.fromEntries((secoes || []).filter((s) => s.tipo === 'mapa').map((s) => [s.id, s]));
  const els = container.querySelectorAll('[data-rota]');
  if (!els.length) return;
  const iniciar = (el) => {
    if (el.dataset.montado) return;
    if (typeof window.L === 'undefined') { window.addEventListener('load', () => iniciar(el), { once: true }); return; }
    el.dataset.montado = '1';
    montar(el, porId[el.dataset.rota]);
  };
  if (!('IntersectionObserver' in window)) { els.forEach(iniciar); return; }
  const obs = new IntersectionObserver((entradas) => entradas.forEach((e) => {
    if (e.isIntersecting) { obs.unobserve(e.target); iniciar(e.target); }
  }));
  els.forEach((el) => obs.observe(el));
}
