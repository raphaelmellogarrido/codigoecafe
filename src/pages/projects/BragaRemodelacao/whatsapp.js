// src/pages/projects/BragaRemodelacao/whatsapp.js
// Monta as mensagens (contacto geral e pedido de orçamento) e o link wa.me
// para abrir o WhatsApp já preenchido. Sem backend — este é o único "envio"
// que o site faz.

import { WHATSAPP_NUMBER } from './constants.js';

export function buildBookingMessage() {
  return 'Olá! Gostaria de pedir mais informações sobre uma remodelação com a BragaRenova.';
}

// Recebe os campos já resolvidos: tipoLabel/inicioLabel são o texto exibido
// no formulário (ex.: "Cozinha", "Nos próximos 3 meses"), não o value interno
// do <select> — quem chama (QuoteForm.jsx) já fez essa tradução, para este
// ficheiro não depender das listas de opções do formulário. Campos opcionais
// vazios (email, localidade, inicioLabel, mensagem) são omitidos da mensagem.
export function buildQuoteMessage({ nome, telefone, email, localidade, tipoLabel, inicioLabel, mensagem }) {
  const lines = [
    'Olá! Gostaria de pedir um orçamento com os seguintes dados:',
    `Nome: ${nome}`,
    `Telefone: ${telefone}`,
  ];

  if (email) lines.push(`Email: ${email}`);
  if (localidade) lines.push(`Localidade: ${localidade}`);

  lines.push(`Tipo de remodelação: ${tipoLabel}`);

  if (inicioLabel) lines.push(`Previsão de início: ${inicioLabel}`);
  if (mensagem) lines.push(`Mensagem: ${mensagem}`);

  return lines.join('\n');
}

export function buildWhatsappUrl(message, phoneNumber = WHATSAPP_NUMBER) {
  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
}
