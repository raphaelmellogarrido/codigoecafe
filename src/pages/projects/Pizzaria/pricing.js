// src/pages/projects/Pizzaria/pricing.js
// Funções puras de precificação do carrinho. Usadas tanto pelo CartContext
// (totais em tempo real) quanto pelo whatsapp.js (mensagem final do pedido).

import { getPizzaBasePrice, EXTRA_INGREDIENT_PRICE } from './menuData.js';

export function getPizzaItemUnitPrice(item) {
  const price1 = getPizzaBasePrice(item.half1.pizzaId, item.sizeKey);
  const price2 = item.half2 ? getPizzaBasePrice(item.half2.pizzaId, item.sizeKey) : 0;
  const basePrice = Math.max(price1, price2);
  const addedCount =
    item.half1.added.length + (item.half2 ? item.half2.added.length : 0);
  return basePrice + addedCount * EXTRA_INGREDIENT_PRICE;
}

export function getItemUnitPrice(item) {
  return item.type === 'pizza' ? getPizzaItemUnitPrice(item) : item.unitPrice;
}

export function getItemLineTotal(item) {
  return getItemUnitPrice(item) * item.quantity;
}

export function getCartTotal(items) {
  return items.reduce((sum, item) => sum + getItemLineTotal(item), 0);
}

export function formatBRL(value) {
  return `R$ ${value.toFixed(2).replace('.', ',')}`;
}
