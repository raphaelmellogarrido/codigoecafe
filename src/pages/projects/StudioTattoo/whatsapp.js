// src/pages/projects/StudioTattoo/whatsapp.js
// Monta as mensagens (agendamento geral e com tatuador específico) e o link
// wa.me para abrir o WhatsApp já preenchido.

import { WHATSAPP_NUMBER } from './constants.js';

export function buildBookingMessage() {
  return 'Olá, gostaria de agendar um horário no Studio Tattoo.';
}

export function buildArtistMessage(artistName) {
  return `Olá, gostaria de agendar um horário com ${artistName} no Studio Tattoo.`;
}

// Monta a frase do orçamento com a concordância certa em português: cada
// zona do corpo já sabe se pede "no", "na" ou "nas" (ver bodyZonesData.js).
// Ex: "Olá, quero fazer orçamento de uma tatuagem no peito com tamanho
// aproximado de 10-15cm no estilo realismo."
export function buildQuoteMessage(zone, sizeLabel, styleName) {
  return `Olá, quero fazer orçamento de uma tatuagem ${zone.preposition} ${zone.name.toLowerCase()} com tamanho aproximado de ${sizeLabel} no estilo ${styleName.toLowerCase()}.`;
}

export function buildWhatsappUrl(message, phoneNumber = WHATSAPP_NUMBER) {
  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
}
