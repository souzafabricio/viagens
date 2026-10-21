/* ===========================================================================
   MODO MERCADO — tela cheia, fonte grande, só o que falta, por corredor.
   ======================================================================== */

import { state } from './state.js';
import { TABLES, PEOPLE } from './config.js';
import { $, esc } from './utils.js';
import { enfileirar } from './db.js';
import { toast, abrirModal, fecharModal, modalAberto } from './ui.js';
import { itensMarcaveis, feitoParaMim, toggleMarca, renderTopicos } from './lists.js';

const CORREDORES = [
  { nome: 'Hortifrúti', chaves: ['alface','tomate','cebola','alho','batata','banana','maçã','maca','laranja','limão','limao','abacaxi','manga','melancia','uva','cenoura','pepino','salada','fruta','legume','verdura','abacate','mamão','mamao','morango'] },
  { nome: 'Padaria', chaves: ['pão','pao','bisnaga','baguete','bolo','torrada','croissant','biscoito','bolacha'] },
  { nome: 'Frios e laticínios', chaves: ['queijo','presunto','mussarela','muçarela','leite','iogurte','manteiga','requeijão','requeijao','margarina','ovo','ovos','creme de leite','nata','salame','mortadela'] },
  { nome: 'Carnes', chaves: ['carne','frango','picanha','linguiça','linguica','bacon','peixe','camarão','camarao','costela','hambúrguer','hamburguer','salsicha'] },
  { nome: 'Mercearia', chaves: ['arroz','feijão','feijao','macarrão','macarrao','sal','açúcar','acucar','óleo','oleo','azeite','café','cafe','farinha','molho','tempero','vinagre','miojo','atum','milho','ervilha','achocolatado','cereal','granola','mel'] },
  { nome: 'Bebidas', chaves: ['água','agua','cerveja','refrigerante','suco','vinho','espumante','gelo','energético','energetico','whisky','vodka','gin','tônica','tonica','coca','guaraná','guarana','champagne','champanhe'] },
  { nome: 'Congelados', chaves: ['sorvete','congelado','pizza','nuggets','picolé','picole'] },
  { nome: 'Limpeza', chaves: ['detergente','sabão','sabao','esponja','papel toalha','desinfetante','álcool','alcool','saco de lixo','lixo','amaciante','água sanitária','agua sanitaria'] },
  { nome: 'Higiene', chaves: ['shampoo','condicionador','sabonete','pasta de dente','escova','desodorante','papel higiênico','papel higienico','absorvente','protetor solar','repelente','fio dental','gilete','barbear','hidratante','perfume','lenço','lenco'] },
  { nome: 'Farmácia', chaves: ['remédio','remedio','analgésico','analgesico','antialérgico','antialergico','band-aid','curativo','dramin','enjoo','pomada','neosoro','dipirona','paracetamol','ibuprofeno'] },
];
const ORDEM = CORREDORES.map((c) => c.nome).concat('Outros');

// Cada chave casa no início de uma palavra e a mais longa vence:
// "macarrão" não cai em Hortifrúti por causa de "maca", "salada" não vira "sal".
const CHAVES = CORREDORES
  .flatMap((c) => c.chaves.map((k) => ({ nome: c.nome, k, re: new RegExp('(^|[^\\p{L}])' + k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'iu') })))
  .sort((a, b) => b.k.length - a.k.length);
function corredorDe(nome) {
  const n = String(nome || '');
  const hit = CHAVES.find((c) => c.re.test(n));
  return hit ? hit.nome : 'Outros';
}

let soMeus = false;

export function abrirMercado() {
  if (!state.user) { toast('Escolha quem está acessando antes.'); return; }
  abrirModal('marketMode');
  renderMercado();
}

export function renderMercado() {
  if (!modalAberto('marketMode')) return;
  const body = $('mkBody');
  const todos = itensMarcaveis();
  const pendentes = todos.filter((x) => !feitoParaMim(x.topico, x.item));
  const visiveis = soMeus ? pendentes.filter((x) => !x.item.assigned_to || x.item.assigned_to === state.user) : pendentes;

  $('mkCount').textContent = `${todos.length - pendentes.length} de ${todos.length}`;
  $('mkBar').style.width = (todos.length ? Math.round(((todos.length - pendentes.length) / todos.length) * 100) : 0) + '%';

  if (!todos.length) { body.innerHTML = '<p class="mk-empty">Nenhum item na lista ainda.</p>'; return; }
  if (!pendentes.length) { body.innerHTML = '<div class="mk-done">Tudo comprado.<br><small>Podem ir embora.</small></div>'; return; }
  if (!visiveis.length) { body.innerHTML = '<p class="mk-empty">Nada sobrou para você — o resto está com a outra pessoa.</p>'; return; }

  const grupos = {};
  visiveis.forEach((x) => { const c = corredorDe(x.item.label); (grupos[c] = grupos[c] || []).push(x); });
  body.innerHTML = ORDEM.filter((c) => grupos[c]).map((c) =>
    `<div class="mk-aisle"><h3>${esc(c)} <span>${grupos[c].length}</span></h3>` +
    grupos[c].map(({ item }) => {
      const quem = item.assigned_to;
      return `<button type="button" class="mk-item" data-mk-id="${esc(item.id)}">` +
        '<span class="mk-box" aria-hidden="true"></span>' +
        `<span class="mk-nome">${esc(item.label)}</span>` +
        (item.qty ? `<span class="mk-qty">${esc(item.qty)}</span>` : '') +
        (quem ? `<span class="who who-${quem[0]}">${esc(PEOPLE[quem])}</span>` : '') +
        '</button>';
    }).join('') + '</div>').join('');
}

function setFiltro(meus) {
  soMeus = meus;
  $('mkFiltroTodos').setAttribute('aria-pressed', meus ? 'false' : 'true');
  $('mkFiltroMeus').setAttribute('aria-pressed', meus ? 'true' : 'false');
  renderMercado();
}

$('mkClose').addEventListener('click', () => fecharModal('marketMode'));
$('mkFiltroTodos').addEventListener('click', () => setFiltro(false));
$('mkFiltroMeus').addEventListener('click', () => setFiltro(true));

$('mkBody').addEventListener('click', (e) => {
  const el = e.target.closest('.mk-item');
  if (!el || el.classList.contains('done')) return;
  el.classList.add('done');
  setTimeout(() => toggleMarca(el.dataset.mkId), 260);
});

// Divide alternadamente o que falta entre os dois. Fica gravado no banco, então
// os dois celulares veem a mesma divisão em tempo real.
$('mkDividir').addEventListener('click', () => {
  const pendentes = itensMarcaveis().filter((x) => !feitoParaMim(x.topico, x.item) && x.topico.tipo !== 'individual');
  if (!pendentes.length) { toast('Não há o que dividir.'); return; }
  pendentes.sort((a, b) => ORDEM.indexOf(corredorDe(a.item.label)) - ORDEM.indexOf(corredorDe(b.item.label)));
  pendentes.forEach((x, i) => {
    const quem = i % 2 === 0 ? 'fabricio' : 'carol';
    x.item.assigned_to = quem;
    enfileirar(TABLES.itens, 'update', { assigned_to: quem }, x.item.id);
  });
  renderTopicos();
  toast('Lista dividida — toque em "Só os meus".');
});

$('mkLimparDivisao').addEventListener('click', () => {
  itensMarcaveis().forEach(({ item }) => {
    if (!item.assigned_to) return;
    item.assigned_to = null;
    enfileirar(TABLES.itens, 'update', { assigned_to: null }, item.id);
  });
  setFiltro(false);
  renderTopicos();
  toast('Divisão desfeita.');
});
