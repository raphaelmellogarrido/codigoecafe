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

export function buildWhatsappUrl(message, phoneNumber = WHATSAPP_NUMBER) {
  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
}
