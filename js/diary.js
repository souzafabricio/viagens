/* ===========================================================================
   DIÁRIO DE BORDO — memórias por dia, com foto opcional.
   O formulário fica fora da lista para o realtime não apagar o que está
   sendo digitado.
   ======================================================================== */

import { state } from './state.js';
import { TABLES, PEOPLE, UNDO_MS } from './config.js';
import { $, esc, uid } from './utils.js';
import { enfileirar, salvarCache } from './db.js';
import { toast } from './ui.js';
import { datasDaViagem, indiceDiaHoje, isoDe, hoje, DIAS_SEMANA, MESES, tituloCurto } from './dates.js';
import { escolherFoto, abrirFotoViewer } from './photos.js';
import { ICON } from './icons.js';

let fotoPendente = null;
let tripDoForm = null;

function renderForm() {
  const datas = datasDaViagem(state.trip);
  const r = state.roteiro;
  const sel = $('dcDia');
  const anterior = sel.value;
  sel.innerHTML = datas.map((d, i) => {
    const rot = r && r.dias && r.dias[i];
    const label = `${DIAS_SEMANA[d.getDay()]}, ${d.getDate()}/${String(d.getMonth() + 1).padStart(2, '0')}${rot ? ' — ' + tituloCurto(rot.titulo) : ''}`;
    return `<option value="${isoDe(d)}">${esc(label)}</option>`;
  }).join('') || `<option value="${isoDe(hoje())}">Hoje</option>`;

  // Só escolhe o dia padrão quando a viagem muda; depois respeita a escolha.
  if (tripDoForm !== (state.trip && state.trip.id)) {
    tripDoForm = state.trip && state.trip.id;
    const idx = indiceDiaHoje(state.trip);
    if (idx !== null && datas[idx]) sel.value = isoDe(datas[idx]);
    $('dcTexto').value = '';
    limparFoto();
  } else if (anterior) sel.value = anterior;
}

function limparFoto() {
  fotoPendente = null;
  const btn = $('dcFoto');
  btn.classList.remove('has');
  btn.querySelector('span').textContent = 'Foto';
}

export function renderDiario() {
  const lista = $('diarioLista');
  if (!lista) return;
  $('diarioForm').classList.toggle('hidden', !state.trip);
  if (!state.trip) { lista.innerHTML = '<p class="empty">Escolha uma viagem.</p>'; return; }
  renderForm();

  const datas = datasDaViagem(state.trip);
  if (!datas.length) { lista.innerHTML = '<p class="empty">Defina as datas da viagem para organizar o diário por dia.</p>'; return; }

  const porDia = {};
  state.diario.forEach((m) => (porDia[m.dia] = porDia[m.dia] || []).push(m));
  const r = state.roteiro;

  lista.innerHTML = datas.map((d, i) => {
    const memorias = (porDia[isoDe(d)] || []).slice().sort((a, b) => ((a.created_at || '') < (b.created_at || '') ? -1 : 1));
    const rot = r && r.dias && r.dias[i];
    return '<section class="diary-day">' +
      `<h3 class="diary-day-title"><span class="day-num">Dia ${i + 1}</span>${esc(`${DIAS_SEMANA[d.getDay()]}, ${d.getDate()} de ${MESES[d.getMonth()]}`)}</h3>` +
      (rot ? `<p class="diary-plan">${esc(tituloCurto(rot.titulo))}</p>` : '') +
      (memorias.length ? memorias.map((m) => {
        const quem = m.created_by === 'carol' ? 'c' : 'f';
        return `<div class="memory" data-mem-id="${esc(m.id)}">` +
          (m.foto ? `<img src="${esc(m.foto)}" alt="" data-mem-foto="${esc(m.id)}">` : '') +
          `<div class="memory-body"><div class="memory-who who-${quem}">${esc(PEOPLE[m.created_by] || '')}</div>` +
          `<p>${esc(m.texto || '')}</p></div>` +
          `<button type="button" class="icon-btn danger mem-del" title="Remover" aria-label="Remover memória">${ICON.trash}</button></div>`;
      }).join('') : '<p class="empty sm">Nada guardado ainda.</p>') +
      '</section>';
  }).join('');
}

function salvarMemoria() {
  if (!state.user) { toast('Escolha quem está acessando.'); return; }
  const texto = $('dcTexto').value.trim();
  if (!texto && !fotoPendente) { toast('Escreva algo ou anexe uma foto.'); $('dcTexto').focus(); return; }
  const nova = {
    id: uid(), viagem_id: state.trip.id, dia: $('dcDia').value || isoDe(hoje()),
    texto: texto || null, foto: fotoPendente || null,
    created_by: state.user, created_at: new Date().toISOString(),
  };
  state.diario.push(nova);
  $('dcTexto').value = '';
  limparFoto();
  enfileirar(TABLES.diario, 'insert', nova);
  salvarCache();
  renderDiario();
  toast('Guardado no diário.');
}

$('dcFoto').addEventListener('click', async () => {
  const dataUrl = await escolherFoto();
  if (!dataUrl) return;
  fotoPendente = dataUrl;
  $('dcFoto').classList.add('has');
  $('dcFoto').querySelector('span').textContent = 'Foto anexada';
});
$('dcEnviar').addEventListener('click', salvarMemoria);

$('diarioLista').addEventListener('click', (e) => {
  const del = e.target.closest('.mem-del');
  const img = e.target.closest('[data-mem-foto]');
  if (del) {
    const id = del.closest('[data-mem-id]').dataset.memId;
    const copia = state.diario.find((m) => m.id === id);
    state.diario = state.diario.filter((m) => m.id !== id);
    renderDiario();
    const timer = setTimeout(() => enfileirar(TABLES.diario, 'delete', null, id), UNDO_MS);
    toast('Memória removida.', {
      duracao: UNDO_MS - 200,
      desfazer: () => { clearTimeout(timer); if (copia) state.diario.push(copia); renderDiario(); },
    });
  } else if (img) {
    const m = state.diario.find((x) => x.id === img.dataset.memFoto);
    if (m) abrirFotoViewer({ titulo: 'Diário · ' + (PEOPLE[m.created_by] || ''), src: m.foto });
  }
});
