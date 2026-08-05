// src/pages/projects/Imobiliaria/imageCrop.js
// Garante que TODAS as fotos de imóveis ficam com o mesmo tamanho/proporção,
// não importa o tamanho da foto original — recorta no centro (como
// "object-fit: cover") e redimensiona para FOTO_LARGURA x FOTO_ALTURA num
// <canvas>, antes de enviar para o servidor. Assim a galeria nunca fica com
// fotos "torcidas" ou de proporções diferentes.

import { FOTO_ALTURA, FOTO_LARGURA } from './constants';

export function cropImageToStandardSize(file, width = FOTO_LARGURA, height = FOTO_ALTURA) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      const targetRatio = width / height;
      const sourceRatio = img.width / img.height;

      // Calcula a área de origem a recortar (o maior retângulo com a
      // proporção alvo que cabe dentro da imagem original), centrada.
      let sx, sy, sWidth, sHeight;
      if (sourceRatio > targetRatio) {
        sHeight = img.height;
        sWidth = sHeight * targetRatio;
        sx = (img.width - sWidth) / 2;
        sy = 0;
      } else {
        sWidth = img.width;
        sHeight = sWidth / targetRatio;
        sx = 0;
        sy = (img.height - sHeight) / 2;
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Não foi possível processar esta imagem.'));
            return;
          }
          resolve(new File([blob], renameToJpg(file.name), { type: 'image/jpeg' }));
        },
        'image/jpeg',
        0.85
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Ficheiro de imagem inválido.'));
    };

    img.src = objectUrl;
  });
}

function renameToJpg(name) {
  return name.replace(/\.[a-z0-9]+$/i, '') + '.jpg';
}
