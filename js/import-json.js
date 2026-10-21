/* ===========================================================================
   Importar tópicos/itens via JSON
   Formato: { "nome do tópico": ["item 1", "item 2"], ... } ou um array simples.
   Na aba Conjunta, se existir a chave "mercado_compartilhado", só ela é usada
   (as demais pertencem à Pessoal). Na Pessoal essa chave é ignorada.
   ======================================================================== */

import { state } from './state.js';
import { TABLES } from './config.js';
import { $, uid } from './utils.js';
import { enfileirar } from './db.js';
import { toast, abrirModal, fecharModal } from './ui.js';
import { criarTopico, renderTopicos } from './lists.js';

let tipoAtual = null;

const humanizar = (chave) => chave.replace(/_/g, ' ').replace(/\b\p{L}/gu, (c) => c.toUpperCase());

function abrir(tipo) {
  if (!state.user) { toast('Escolha quem está acessando antes de importar itens.'); return; }
  if (!state.trip) { toast('Escolha uma viagem antes de importar itens.'); return; }
  tipoAtual = tipo;
  const conjunta = tipo === 'compartilhado';
  $('importJsonTitle').textContent = 'Importar lista — ' + (conjunta ? 'Conjunta' : 'Pessoal');
  $('importJsonMsg').textContent = conjunta
    ? 'Cole um JSON com listas por tópico. Se houver a chave "mercado_compartilhado", só ela é importada aqui.'
    : 'Cole um JSON com listas por tópico, ex: {"roupas": ["camiseta"]}. A chave "mercado_compartilhado" é ignorada.';
  $('importJsonInput').value = '';
  abrirModal('importJsonModal');
}

function mapaDeTopicos(dados, tipo) {
  if (Array.isArray(dados)) return { Importado: dados };
  if (!dados || typeof dados !== 'object') return {};
  const temMercado = Object.prototype.hasOwnProperty.call(dados, 'mercado_compartilhado');
  if (tipo === 'compartilhado') return temMercado ? { mercado_compartilhado: dados.mercado_compartilhado } : dados;
  const semMercado = { ...dados };
  delete semMercado.mercado_compartilhado;
  return semMercado;
}

function importar() {
  const texto = $('importJsonInput').value.trim();
  if (!texto) return;
  let dados;
  try { dados = JSON.parse(texto); } catch { toast('JSON inválido. Verifique o texto colado.'); return; }

  const tipo = tipoAtual;
  const mapa = mapaDeTopicos(dados, tipo);
  const chaves = Object.keys(mapa);
  if (!chaves.length) { toast('Nada para importar nesse JSON.'); return; }

  let topicosCriados = 0, itensCriados = 0;
  chaves.forEach((chave) => {
    const lista = mapa[chave];
    if (!Array.isArray(lista)) return;
    const nome = chave === 'mercado_compartilhado' ? 'Mercado Compartilhado' : humanizar(chave);
    let topico = state.topicos.find((t) => t.tipo === tipo && t.nome.trim().toLowerCase() === nome.toLowerCase());
    if (!topico) { topico = criarTopico(nome, tipo); topicosCriados++; }
    const existentes = new Set((state.itens[topico.id] || []).map((it) => it.label.trim().toLowerCase()));
    lista.forEach((valor) => {
      const label = String(valor || '').trim();
      if (!label || existentes.has(label.toLowerCase())) return;
      const novo = {
        id: uid(), viagem_id: state.trip.id, topico_id: topico.id, label,
        created_by: state.user, checked_fabricio: false, checked_carol: false, qty: null,
      };
      if (tipo === 'individual') novo.owner = state.user;
      (state.itens[topico.id] = state.itens[topico.id] || []).push(novo);
      existentes.add(label.toLowerCase());
      itensCriados++;
      enfileirar(TABLES.itens, 'insert', novo);
    });
  });

  renderTopicos();
  fecharModal('importJsonModal');
  toast(`${itensCriados} item(ns) importado(s) em ${topicosCriados} novo(s) tópico(s).`);
}

$('topicoImportConjunta').addEventListener('click', () => abrir('compartilhado'));
$('topicoImportPessoal').addEventListener('click', () => abrir('individual'));
$('importJsonCancel').addEventListener('click', () => fecharModal('importJsonModal'));
$('importJsonOk').addEventListener('click', importar);
