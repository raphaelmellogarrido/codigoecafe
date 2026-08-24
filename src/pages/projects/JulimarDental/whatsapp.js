// src/pages/projects/JulimarDental/whatsapp.js
// Monta a mensagem do orçamento (itens, subtotal, dados de entrega em branco)
// e o link wa.me que abre o WhatsApp já preenchido. Sem backend — este é o
// único "envio" que o site faz.

import { WHATSAPP_NUMBER } from "./constants.js";
import { formatBRL } from "./format.js";

export function getCartSubtotal(items) {
  return items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
}

function buildItemLine(item) {
  const subtotal = item.unitPrice * item.quantity;
  return `• ${item.quantity}x ${item.name} - ${formatBRL(item.unitPrice)} un. = ${formatBRL(subtotal)}`;
}

export function buildOrderMessage(items) {
  const subtotal = getCartSubtotal(items);

  const lines = [
    "Olá, gostaria de fazer um pedido/orçamento! ",
    "",
    " *ITENS DO PEDIDO:*",
    ...items.map(buildItemLine),
    "",
    "💰 *RESUMO:*",
    `Subtotal: ${formatBRL(subtotal)}`,
    "Frete: A calcular",
    `*Total do pedido: ${formatBRL(subtotal)}*`,
    "",
    " *Dados para entrega:*",
    "Clínica:",
    "CNPJ/CPF:",
    "Endereço:",
    "",
    " Preciso para: [data]",
    "",
    "Pode me confirmar disponibilidade e prazo? Obrigado!",
  ];

  return lines.join("\n");
}

export function buildWhatsappUrl(items, phoneNumber = WHATSAPP_NUMBER) {
  const message = buildOrderMessage(items);
  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
}
