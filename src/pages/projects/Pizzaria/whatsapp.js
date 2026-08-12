// src/pages/projects/Pizzaria/whatsapp.js
// Monta o texto do pedido (com sabores, tamanho, modificações de ingredientes
// e total) e o link wa.me para abrir o WhatsApp da pizzaria já preenchido.

import { getSizeByKey } from './menuData.js';
import { getItemLineTotal, getCartTotal, formatBRL } from './pricing.js';

function buildHalfModificationLine(half, showName) {
  const mods = [
    ...half.added.map((ingredient) => `adicionar ${ingredient.toLowerCase()}`),
    ...half.removed.map((ingredient) => `remover ${ingredient.toLowerCase()}`),
  ];
  if (mods.length === 0) return null;
  const prefix = showName ? `${half.name}: ` : '';
  return `  ${prefix}${mods.join(', ')}`;
}

function buildPizzaLines(item) {
  const size = getSizeByKey(item.sizeKey);
  const flavorLabel = item.half2
    ? `metade ${item.half1.name}, metade ${item.half2.name}`
    : item.half1.name;

  const lines = [`${item.quantity}x Pizza ${size.label} (${size.cm}cm) - ${flavorLabel}`];

  const half1Line = buildHalfModificationLine(item.half1, Boolean(item.half2));
  if (half1Line) lines.push(half1Line);

  if (item.half2) {
    const half2Line = buildHalfModificationLine(item.half2, true);
    if (half2Line) lines.push(half2Line);
  }

  lines.push(`  ${formatBRL(getItemLineTotal(item))}`);
  return lines;
}

function buildDrinkLines(item) {
  return [`${item.quantity}x ${item.name} ${item.sizeLabel}`, `  ${formatBRL(getItemLineTotal(item))}`];
}

export function buildOrderMessage(items) {
  const lines = ['Olá! Meu pedido:', ''];

  items.forEach((item) => {
    const itemLines = item.type === 'pizza' ? buildPizzaLines(item) : buildDrinkLines(item);
    lines.push(...itemLines, '');
  });

  lines.push(`Total: ${formatBRL(getCartTotal(items))}`);

  return lines.join('\n');
}

export function buildWhatsappUrl(items, phoneNumber = '351913247176') {
  const message = buildOrderMessage(items);
  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
}
