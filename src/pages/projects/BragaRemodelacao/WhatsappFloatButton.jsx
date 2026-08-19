// src/pages/projects/BragaRemodelacao/WhatsappFloatButton.jsx
// Botão flutuante, canto inferior direito, sempre visível.

import { FaWhatsapp } from 'react-icons/fa6';
import { buildBookingMessage, buildWhatsappUrl } from './whatsapp';

export default function WhatsappFloatButton() {
  const href = buildWhatsappUrl(buildBookingMessage());

  return (
    <a
      href={href}
      className="brm-whatsapp-float"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Tirar dúvidas pelo WhatsApp"
    >
      <FaWhatsapp className="brm-whatsapp-float-icon" />
      <span>Dúvidas?</span>
    </a>
  );
}
