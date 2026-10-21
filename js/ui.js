// Peças de interface reutilizáveis: toasts, modais (com pilha e Esc),
// confirmação/prompt, troca de telas e abas, tema.

import { state, emit } from './state.js';
import { LS, TABS } from './config.js';
import { $, esc, lsRaw } from './utils.js';

/* ---------------- Toasts ---------------- */

export function toast(mensagemHtml, { desfazer, duracao = 3400 } = {}) {
  const container = $('toastContainer');
  if (!container) return null;
  const el = document.createElement('div');
  el.className = 'toast';
  el.setAttribute('role', 'status');
  el.innerHTML = `<span class="toast-txt">${mensagemHtml}</span>`;
  const sumir = () => { el.classList.remove('show'); setTimeout(() => el.remove(), 300); };
  if (desfazer) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'toast-undo';
    b.textContent = 'Desfazer';
    b.addEventListener('click', () => { desfazer(); sumir(); });
    el.appendChild(b);
  }
  container.appendChild(el);
  requestAnimationFrame(() => el.classList.add('show'));
  setTimeout(sumir, duracao);
  return el;
}

/* ---------------- Modais ---------------- */
// Pilha de modais abertos: Esc e clique no fundo fecham sempre o do topo.

const pilha = [];

export function abrirModal(id, { onClose } = {}) {
  const el = $(id);
  if (!el) return;
  if (pilha.some((m) => m.el === el)) return;
  el.classList.remove('hidden');
  pilha.push({ el, onClose, foco: document.activeElement });
  document.body.classList.add('no-scroll');
  requestAnimationFrame(() => {
    const alvo = el.querySelector('[data-autofocus]:not(.hidden)') ||
      el.querySelector('input:not(.hidden):not([type=hidden]), textarea, .btn-primary, button');
    if (alvo) alvo.focus({ preventScroll: true });
  });
}

export function fecharModal(id, { silencioso = false } = {}) {
  const el = $(id);
  const i = pilha.findIndex((m) => m.el === el);
  if (i === -1) { if (el) el.classList.add('hidden'); return; }
  const [m] = pilha.splice(i, 1);
  el.classList.add('hidden');
  if (!pilha.length) document.body.classList.remove('no-scroll');
  if (m.foco && m.foco.focus) m.foco.focus({ preventScroll: true });
  if (!silencioso && m.onClose) m.onClose();
}

export const modalAberto = (id) => pilha.some((m) => m.el.id === id);

function fecharTopo() {
  const topo = pilha[pilha.length - 1];
  if (topo) fecharModal(topo.el.id);
}

document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && pilha.length) { e.preventDefault(); fecharTopo(); } });
document.addEventListener('click', (e) => {
  const topo = pilha[pilha.length - 1];
  if (topo && e.target === topo.el && topo.el.classList.contains('modal-backdrop')) fecharTopo();
});

/* ---------------- Confirmar / perguntar ---------------- */

let askResolver = null;

function abrirAsk({ titulo = 'Confirmar', mensagem = '', prompt = false, valor = '', okTexto = 'Confirmar', perigo = false }) {
  return new Promise((resolve) => {
    askResolver = resolve;
    $('askTitle').textContent = titulo;
    $('askMsg').textContent = mensagem;
    $('askMsg').classList.toggle('hidden', !mensagem);
    const input = $('askInput');
    input.classList.toggle('hidden', !prompt);
    input.value = valor || '';
    const ok = $('askOk');
    ok.textContent = okTexto;
    ok.className = 'btn ' + (perigo ? 'btn-danger' : 'btn-primary');
    abrirModal('askModal', { onClose: () => resolverAsk(null) });
    if (prompt) setTimeout(() => input.select(), 60);
  });
}
function resolverAsk(valor) {
  if (askResolver) { const r = askResolver; askResolver = null; r(valor); }
}
function confirmarAsk() {
  const input = $('askInput');
  const valor = input.classList.contains('hidden') ? true : input.value.trim();
  resolverAsk(valor);
  fecharModal('askModal', { silencioso: true });
}
$('askOk').addEventListener('click', confirmarAsk);
$('askCancel').addEventListener('click', () => fecharModal('askModal'));
$('askInput').addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); confirmarAsk(); } });

export function confirmar(mensagem, { titulo = 'Tem certeza?', okTexto = 'Excluir', perigo = true } = {}) {
  return abrirAsk({ titulo, mensagem, okTexto, perigo });
}
export function perguntar(titulo, valor) {
  return abrirAsk({ titulo, prompt: true, valor, okTexto: 'Salvar' });
}

/* ---------------- Telas e abas ---------------- */

export function showScreen(nome) {
  document.querySelectorAll('.screen').forEach((s) => s.classList.remove('active'));
  const el = $('screen' + nome.charAt(0).toUpperCase() + nome.slice(1));
  if (el) el.classList.add('active');
  state.screen = nome;
  window.scrollTo(0, 0);
  emit('screen', nome);
}

export function mostrarAba(tab, { rolar = true } = {}) {
  if (!TABS.includes(tab)) tab = 'hoje';
  const mudou = state.tab !== tab;
  state.tab = tab;
  lsRaw(LS.tab, tab);
  document.querySelectorAll('.tab-btn').forEach((b) => {
    const ativo = b.dataset.tab === tab;
    b.classList.toggle('active', ativo);
    b.setAttribute('aria-selected', ativo ? 'true' : 'false');
  });
  document.querySelectorAll('.tab-panel').forEach((p) => p.classList.toggle('active', p.dataset.tabPanel === tab));
  if (mudou && rolar) {
    const hero = document.querySelector('#screenTrip .hero');
    const topo = hero ? hero.offsetHeight : 0;
    if (window.scrollY > topo) window.scrollTo({ top: topo, behavior: 'instant' });
  }
  emit('tab', tab);
}

/* ---------------- Tema ---------------- */

const media = window.matchMedia('(prefers-color-scheme: dark)');

export function temaPreferido() { return lsRaw(LS.theme) || 'auto'; }

export function aplicarTema(pref = temaPreferido()) {
  lsRaw(LS.theme, pref === 'auto' ? null : pref);
  const real = pref === 'auto' ? (media.matches ? 'dark' : 'light') : pref;
  document.documentElement.dataset.theme = real;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.content = real === 'dark' ? '#0b1a20' : '#0f2c33';
  document.querySelectorAll('[data-theme-opt]').forEach((b) =>
    b.setAttribute('aria-pressed', b.dataset.themeOpt === pref ? 'true' : 'false'));
}
media.addEventListener('change', () => { if (temaPreferido() === 'auto') aplicarTema('auto'); });

/* ---------------- Pequenos helpers de HTML ---------------- */

export const vazio = (texto) => `<p class="empty">${esc(texto)}</p>`;
