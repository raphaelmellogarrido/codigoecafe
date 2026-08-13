// src/pages/projects/FazTudo/whatsapp.js
// Monta as mensagens (pedido de orçamento e atendimento urgente) e o link
// wa.me para abrir o WhatsApp já preenchido.

import { WHATSAPP_NUMBER } from './constants.js';

function formatServiceList(names) {
  if (names.length === 0) return '';
  if (names.length === 1) return names[0];
  return `${names.slice(0, -1).join(', ')} e ${names[names.length - 1]}`;
}

export function buildQuoteMessage(serviceNames) {
  return `Olá, eu preciso dos seus serviços de: ${formatServiceList(serviceNames)}`;
}

export function buildUrgentMessage() {
  return 'Olá, preciso de atendimento urgente.';
}

export function buildWhatsappUrl(message, phoneNumber = WHATSAPP_NUMBER) {
  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
}
