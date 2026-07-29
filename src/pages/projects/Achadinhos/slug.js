// src/pages/projects/Achadinhos/slug.js
export const SLUG_REGEX = /^[a-z0-9]+(-[a-z0-9]+)*$/;

// Faixa Unicode das marcas diacriticas combinantes (acentos), usada apos
// normalize('NFD') para tirar acentos de forma segura (á -> a + marca -> a).
const DIACRITICS_REGEX = new RegExp('[̀-ͯ]', 'g');

export function slugify(text) {
  return (text || '')
    .toString()
    .normalize('NFD')
    .replace(DIACRITICS_REGEX, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
