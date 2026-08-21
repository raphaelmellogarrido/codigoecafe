// src/pages/projects/JulimarDental/WhatsappFloatButton.jsx
// Contacto direto (fora do fluxo de carrinho): botão flutuante fixo.

import { FaWhatsapp } from 'react-icons/fa6';
import { WHATSAPP_NUMBER } from './constants.js';

const DEFAULT_MESSAGE = 'Olá! Gostaria de saber mais sobre os produtos da Julimar Dental.';

export default function WhatsappFloatButton() {
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(DEFAULT_MESSAGE)}`;

  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="jd-whatsapp-float" aria-label="Falar connosco no WhatsApp">
      <FaWhatsapp />
    </a>
  );
}
