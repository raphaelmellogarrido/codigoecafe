// src/pages/projects/StudioTattoo/WhatsappFloatButton.jsx
// Botão flutuante, canto inferior direito, sempre visível — abre o WhatsApp
// com a mensagem de agendamento geral.

import { FaWhatsapp } from 'react-icons/fa6';
import { buildBookingMessage, buildWhatsappUrl } from './whatsapp';

export default function WhatsappFloatButton() {
  const href = buildWhatsappUrl(buildBookingMessage());

  return (
    <a
      href={href}
      className="st-whatsapp-float"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Agendar horário pelo WhatsApp"
    >
      <FaWhatsapp className="st-whatsapp-float-icon" />
      <span>Agendar horário</span>
    </a>
  );
}
