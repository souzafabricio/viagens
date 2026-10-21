/* ===========================================================================
   Mapa (Leaflet + Nominatim) e tópico "Onde Comprar" (Overpass/OSM).
   ======================================================================== */

import { state } from './state.js';
import { TABLES } from './config.js';
import { $, uid } from './utils.js';
import { supa, enfileirar } from './db.js';
import { toast, abrirModal, fecharModal } from './ui.js';
import { renderTopicos } from './lists.js';

const ESTADOS_UF = {
  'acre':'AC','alagoas':'AL','amapa':'AP','amazonas':'AM','bahia':'BA','ceara':'CE','distrito federal':'DF',
  'espirito santo':'ES','goias':'GO','maranhao':'MA','mato grosso':'MT','mato grosso do sul':'MS',
  'minas gerais':'MG','para':'PA','paraiba':'PB','parana':'PR','pernambuco':'PE','piaui':'PI',
  'rio de janeiro':'RJ','rio grande do norte':'RN','rio grande do sul':'RS','rondonia':'RO','roraima':'RR',
  'santa catarina':'SC','sao paulo':'SP','sergipe':'SE','tocantins':'TO',
};
const normalizar = (s) => (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const ufDoEstado = (nome) => ESTADOS_UF[normalizar(nome)] || '';

/* ---------------- Seletor no mapa ---------------- */

let mapa = null, pino = null, resultado = null;
let aoConfirmar = null;

// onConfirm recebe { bairro, cidade, uf, lat, lon }
export function abrirMapPicker(onConfirm) {
  if (typeof window.L === 'undefined') { toast('O mapa não carregou — preencha bairro, cidade e UF à mão.'); return; }
  aoConfirmar = onConfirm;
  abrirModal('mapPickerModal');
  const L = window.L;
  if (!mapa) {
    mapa = L.map('mapPickerMap').setView([-14.235, -51.9253], 4);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; OpenStreetMap' }).addTo(mapa);
    mapa.on('click', (ev) => posicionar(ev.latlng));
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => { if (!pino) mapa.setView([pos.coords.latitude, pos.coords.longitude], 13); },
        () => {}, { timeout: 4000 });
    }
  }
  setTimeout(() => mapa.invalidateSize(), 50);
}

function posicionar(latlng) {
  const L = window.L;
  if (!pino) {
    pino = L.marker(latlng, { draggable: true }).addTo(mapa);
    pino.on('dragend', () => posicionar(pino.getLatLng()));
  } else pino.setLatLng(latlng);
  buscarEndereco(latlng);
}

async function buscarEndereco(latlng) {
  const addr = $('mapPickerAddr'), ok = $('mapPickerConfirmBtn');
  ok.disabled = true; resultado = null;
  addr.textContent = 'Buscando endereço…';
  try {
    const url = 'https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=' + latlng.lat +
      '&lon=' + latlng.lng + '&addressdetails=1&accept-language=pt-BR';
    const data = await (await fetch(url)).json();
    const a = data.address || {};
    resultado = {
      bairro: a.suburb || a.neighbourhood || a.city_district || '',
      cidade: a.city || a.town || a.village || a.municipality || '',
      uf: ufDoEstado(a.state), lat: latlng.lat, lon: latlng.lng,
    };
    addr.textContent = data.display_name || 'Local selecionado.';
    ok.disabled = false;
  } catch {
    addr.textContent = 'Não foi possível identificar o endereço — tente outro ponto.';
  }
}

$('mapPickerCancelBtn').addEventListener('click', () => fecharModal('mapPickerModal'));
$('mapPickerConfirmBtn').addEventListener('click', () => {
  if (!resultado) return;
  if (aoConfirmar) aoConfirmar(resultado);
  fecharModal('mapPickerModal');
});

/* ---------------- Geocodificação e lojas próximas ---------------- */

function distanciaMetros(lat1, lon1, lat2, lon2) {
  const R = 6371000, rad = (g) => (g * Math.PI) / 180;
  const dLat = rad(lat2 - lat1), dLon = rad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

async function geocodificar(trip) {
  if (trip.lat && trip.lon) return { lat: trip.lat, lon: trip.lon };
  const q = [trip.endereco_bairro, trip.endereco_cidade, trip.endereco_uf, 'Brasil'].filter(Boolean).join(', ');
  if (!q) return null;
  try {
    const data = await (await fetch('https://nominatim.openstreetmap.org/search?format=json&limit=1&q=' + encodeURIComponent(q))).json();
    return data.length ? { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) } : null;
  } catch { return null; }
}

const CATEGORIAS = [
  { chave: 'shop', valor: 'supermarket', label: 'Supermercado' },
  { chave: 'amenity', valor: 'pharmacy', label: 'Farmácia' },
  { chave: 'amenity', valor: 'fuel', label: 'Posto' },
  { chave: 'shop', valor: 'bakery', label: 'Padaria' },
  { chave: 'shop', valor: 'convenience', label: 'Conveniência' },
];
const OVERPASS = ['https://overpass.kumi.systems/api/interpreter', 'https://overpass-api.de/api/interpreter'];

async function lugaresProximos(lat, lon) {
  const filtros = CATEGORIAS.map((c) => `nwr["${c.chave}"="${c.valor}"](around:2000,${lat},${lon});`).join('\n');
  const query = `[out:json][timeout:25];(${filtros});out center 30;`;
  for (const endpoint of OVERPASS) {
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' },
        body: 'data=' + encodeURIComponent(query),
      });
      if (!res.ok) continue;
      const data = await res.json();
      const vistos = new Set();
      const lugares = (data.elements || [])
        .filter((el) => el.tags && el.tags.name)
        .map((el) => {
          const t = el.tags;
          const elLat = el.lat != null ? el.lat : el.center && el.center.lat;
          const elLon = el.lon != null ? el.lon : el.center && el.center.lon;
          const cat = CATEGORIAS.find((c) => t[c.chave] === c.valor);
          const end = [t['addr:street'], t['addr:housenumber'], t['addr:suburb']].filter(Boolean).join(', ');
          return {
            nome: t.name, categoria: cat ? cat.label : 'Loja', endereco: end || null, lat: elLat, lon: elLon,
            distancia: elLat != null && elLon != null ? Math.round(distanciaMetros(lat, lon, elLat, elLon)) : null,
          };
        })
        .filter((l) => l.lat != null && !vistos.has(l.nome) && vistos.add(l.nome))
        .sort((a, b) => a.distancia - b.distancia)
        .slice(0, 10);
      return { ok: true, lugares };
    } catch (err) { console.warn('Overpass falhou em ' + endpoint, err); }
  }
  return { ok: false, lugares: [] };
}

const fmtDist = (m) => (m == null ? null : m < 1000 ? m + ' m' : (m / 1000).toFixed(1).replace('.', ',') + ' km');

export async function removerTopicosLugares(viagemId) {
  if (!supa) return;
  const resT = await supa.from(TABLES.topicos).select('id').eq('viagem_id', viagemId).eq('tipo', 'lugares');
  if (resT.error || !resT.data || !resT.data.length) return;
  const ids = resT.data.map((t) => t.id);
  await supa.from(TABLES.itens).delete().in('topico_id', ids);
  await supa.from(TABLES.topicos).delete().in('id', ids);
  if (state.trip && state.trip.id === viagemId) {
    state.topicos = state.topicos.filter((t) => t.tipo !== 'lugares');
    ids.forEach((id) => delete state.itens[id]);
    renderTopicos();
  }
}

// Gera o tópico "Onde Comprar" e grava lat/lon na viagem (usado pelo clima).
// Retorna as coordenadas usadas, ou null.
export async function gerarOndeComprar(trip) {
  if (!trip.endereco_bairro && !trip.endereco_cidade && !trip.lat) return null;
  const coords = await geocodificar(trip);
  if (!coords) { toast('Não localizamos esse endereço — inclua cidade e UF.'); return null; }
  if (supa && (trip.lat !== coords.lat || trip.lon !== coords.lon)) {
    await supa.from(TABLES.viagens).update({ lat: coords.lat, lon: coords.lon }).eq('id', trip.id);
  }
  const r = await lugaresProximos(coords.lat, coords.lon);
  if (!r.ok) { toast('Não foi possível buscar lojas próximas agora.'); return coords; }
  if (!r.lugares.length) { toast('Nenhuma loja encontrada perto desse endereço.'); return coords; }

  const topico = { id: uid(), viagem_id: trip.id, nome: 'Onde Comprar', tipo: 'lugares', ordem: 99, created_by: state.user };
  enfileirar(TABLES.topicos, 'insert', topico);
  const novos = r.lugares.map((l) => ({
    id: uid(), viagem_id: trip.id, topico_id: topico.id, label: l.nome, qty: fmtDist(l.distancia),
    endereco: l.endereco, categoria: l.categoria, created_by: state.user, checked_fabricio: false, checked_carol: false,
  }));
  novos.forEach((n) => enfileirar(TABLES.itens, 'insert', n));
  if (state.trip && state.trip.id === trip.id) {
    state.topicos.push(topico);
    state.itens[topico.id] = novos;
    renderTopicos();
  }
  toast('"Onde Comprar" atualizado com lojas próximas.');
  return coords;
}
