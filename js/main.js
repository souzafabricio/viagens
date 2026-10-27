/* ===========================================================================
   Boot do app: liga eventos globais, decide o que re-renderizar quando o
   estado muda e registra o service worker.
   ======================================================================== */

import { state, on } from './state.js';
import { LS, PEOPLE } from './config.js';
import { $, lsRaw } from './utils.js';
import { supa, drenarOutbox, atualizarSyncPill, avisarQuandoSincronizar, salvarCache } from './db.js';
import { toast, showScreen, mostrarAba, abrirModal, fecharModal, aplicarTema } from './ui.js';
import { renderTopicos, contar, limparMinhasMarcas } from './lists.js';
import './import-json.js';
import { renderGuia } from './guide.js';
import { renderHoje } from './today.js';
import { renderDiario } from './diary.js';
import { carregarClima } from './weather.js';
import { carregarTudoDaViagem } from './realtime.js';
import { abrirViagens, editarViagemAtual, abrirViagemInicial, atualizarHero } from './trips.js';

/* ---------------- O que re-renderizar quando algo muda ---------------- */

function renderTudo() {
  renderTopicos();   // dispara lists:changed → progresso, badges, hoje
  renderGuia();
  renderDiario();
}

function atualizarProgresso() {
  const r = contar();
  const pct = r.total ? Math.round((r.feito / r.total) * 100) : 0;
  $('heroBar').style.width = pct + '%';
  $('heroProgressTxt').textContent = state.user
    ? (r.total ? `${r.feito} de ${r.total} itens marcados por você` : 'Nenhum item nas listas ainda')
    : 'Escolha quem está acessando';
  ['conjunta', 'pessoal'].forEach((aba) => {
    const badge = document.querySelector(`.tab-btn[data-tab="${aba}"] .badge`);
    const falta = contar(aba).falta;
    badge.textContent = falta > 99 ? '99+' : String(falta);
    badge.hidden = !falta;
  });
}

on('lists:changed', () => {
  atualizarProgresso();
  salvarCache();
  if (state.tab === 'hoje') renderHoje();
});
on('trip:changed', () => { renderTudo(); atualizarHero(); });
on('data:loaded', renderTudo);
on('roteiro:changed', () => { renderGuia(); renderHoje(); renderDiario(); });
on('diario:changed', renderDiario);
on('clima:changed', () => { if (state.tab === 'hoje') renderHoje(); });
on('tab', (tab) => {
  if (tab === 'hoje') renderHoje();
  medirCabecalho();
});
on('screen', medirCabecalho);

/* ---------------- Usuário ---------------- */

function atualizarWhoami() {
  const btn = $('whoami');
  const nome = state.user ? PEOPLE[state.user] : '';
  btn.textContent = nome ? nome.charAt(0) : '?';
  btn.className = 'avatar' + (state.user ? ' is-' + state.user : '');
  btn.setAttribute('aria-label', 'Menu' + (nome ? ' — ' + nome : ''));
  $('menuUser').textContent = nome ? `Você está como ${nome}` : 'Ninguém escolhido';
  $('menuUser').className = 'menu-user' + (state.user ? ' is-' + state.user : '');
}

let telaAntesDoLogin = null;

function abrirLogin() {
  telaAntesDoLogin = state.screen;
  $('loginCancelBtn').classList.toggle('hidden', !(telaAntesDoLogin && state.user));
  showScreen('login');
}

function selecionarUsuario(pessoa) {
  state.user = pessoa;
  lsRaw(LS.user, pessoa);
  atualizarWhoami();
  if (telaAntesDoLogin) {
    showScreen(telaAntesDoLogin);
    telaAntesDoLogin = null;
    renderTudo();
    return;
  }
  abrirViagemInicial();
}

document.querySelectorAll('.choice').forEach((b) => b.addEventListener('click', () => selecionarUsuario(b.dataset.person)));
$('loginCancelBtn').addEventListener('click', () => { if (telaAntesDoLogin) showScreen(telaAntesDoLogin); telaAntesDoLogin = null; });

/* ---------------- Ações globais (data-action) ---------------- */

const ACOES = {
  menu: () => abrirModal('menuSheet'),
  'trocar-viagem': () => { fecharModal('menuSheet', { silencioso: true }); abrirViagens(); },
  'editar-viagem': () => { fecharModal('menuSheet', { silencioso: true }); editarViagemAtual(); },
  'limpar-meus': () => { fecharModal('menuSheet', { silencioso: true }); limparMinhasMarcas(); },
  'trocar-usuario': () => { fecharModal('menuSheet', { silencioso: true }); abrirLogin(); },
  'fechar-menu': () => fecharModal('menuSheet'),
};

document.addEventListener('click', (e) => {
  if (!e.target.closest) return;
  const a = e.target.closest('[data-action]');
  if (a && ACOES[a.dataset.action]) { ACOES[a.dataset.action](a); return; }
  const tema = e.target.closest('[data-theme-opt]');
  if (tema) { aplicarTema(tema.dataset.themeOpt); return; }
  const tab = e.target.closest('.tab-btn');
  if (tab) { mostrarAba(tab.dataset.tab); return; }
  const go = e.target.closest('[data-tab-go]');
  if (go) mostrarAba(go.dataset.tabGo);
});

// Setas esquerda/direita navegam entre abas (padrão de tablist).
$('tabs').addEventListener('keydown', (e) => {
  if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
  const btns = [...document.querySelectorAll('.tab-btn')];
  const i = btns.findIndex((b) => b.dataset.tab === state.tab);
  const prox = btns[(i + (e.key === 'ArrowRight' ? 1 : btns.length - 1)) % btns.length];
  mostrarAba(prox.dataset.tab);
  prox.focus();
});

/* ---------------- Cabeçalho fixo: mede a altura real ---------------- */
// As âncoras e o índice do Guia ficam logo abaixo do cabeçalho fixo; em vez de
// números mágicos no CSS, a altura é medida e exposta em --sticky-top.

function medirCabecalho() {
  const appbar = $('appbar');
  const tabs = $('tabs');
  if (!appbar) return;
  const tabsTopo = getComputedStyle(tabs).position === 'sticky' ? tabs.offsetHeight : 0;
  document.documentElement.style.setProperty('--appbar-h', appbar.offsetHeight + 'px');
  document.documentElement.style.setProperty('--sticky-top', appbar.offsetHeight + tabsTopo + 'px');
}
if ('ResizeObserver' in window) new ResizeObserver(medirCabecalho).observe($('appbar'));
window.addEventListener('resize', medirCabecalho);

/* ---------------- Rede ---------------- */

window.addEventListener('online', () => {
  toast('Conexão de volta — sincronizando.');
  avisarQuandoSincronizar();
  drenarOutbox();
  if (state.trip) carregarTudoDaViagem().then(() => carregarClima()).then(() => { if (state.tab === 'hoje') renderHoje(); });
});
window.addEventListener('offline', () => {
  atualizarSyncPill();
  toast('Sem conexão — pode continuar marcando, tudo sobe depois.');
});
document.addEventListener('visibilitychange', () => { if (!document.hidden) drenarOutbox(); });
setInterval(drenarOutbox, 20000);

// O "próximo compromisso" do Hoje muda sozinho com o relógio.
setInterval(() => { if (state.tab === 'hoje' && state.screen === 'trip') renderHoje(); }, 60 * 1000);

/* ---------------- Boot ---------------- */

aplicarTema();
atualizarWhoami();
mostrarAba(state.tab, { rolar: false });
atualizarSyncPill();
drenarOutbox();
if (!supa) console.warn('Supabase não configurado/carregado — o app funciona só localmente.');

if (!state.user) showScreen('login');
else abrirViagemInicial();

if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch((err) => console.warn('Service worker não registrado:', err));
  });
}
