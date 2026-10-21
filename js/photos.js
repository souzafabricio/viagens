// Fotos: escolhidas no celular, redimensionadas no cliente antes de subir
// (vão como data URL no próprio registro), e um visualizador simples.

import { $ } from './utils.js';
import { toast, abrirModal, fecharModal } from './ui.js';

function comprimirImagem(file, maxLado = 520, qualidade = 0.62) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Não foi possível ler o arquivo.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Arquivo não é uma imagem válida.'));
      img.onload = () => {
        const escala = Math.min(1, maxLado / Math.max(img.width, img.height));
        const w = Math.round(img.width * escala), h = Math.round(img.height * escala);
        const canvas = document.createElement('canvas');
        canvas.width = w; canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', qualidade));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

// Abre o seletor de arquivo e resolve com a data URL comprimida.
// Se a pessoa cancelar o seletor, a promessa simplesmente não resolve.
export function escolherFoto() {
  return new Promise((resolve) => {
    const input = $('fotoInput');
    input.value = '';
    input.onchange = async () => {
      const file = input.files && input.files[0];
      if (!file) return;
      try { resolve(await comprimirImagem(file)); }
      catch (err) { console.error(err); toast('Não deu para usar essa imagem.'); }
    };
    input.click();
  });
}

let aoRemover = null;

export function abrirFotoViewer({ titulo, src, onRemove }) {
  aoRemover = onRemove || null;
  $('fotoViewerTitle').textContent = titulo || 'Foto';
  $('fotoViewerImg').src = src;
  $('fotoViewerRemove').classList.toggle('hidden', !onRemove);
  abrirModal('fotoViewer');
}

$('fotoViewerClose').addEventListener('click', () => fecharModal('fotoViewer'));
$('fotoViewerRemove').addEventListener('click', () => {
  if (aoRemover) aoRemover();
  fecharModal('fotoViewer');
});
