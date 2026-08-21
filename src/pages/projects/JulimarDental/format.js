// src/pages/projects/JulimarDental/format.js
// Formata valores em reais (R$ 0.000,00) — usado no grid de produtos, no
// carrinho e na mensagem do WhatsApp.

export function formatBRL(value) {
  return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
