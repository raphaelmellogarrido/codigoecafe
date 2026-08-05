// src/pages/projects/Imobiliaria/WhatsappFloatButton.jsx
// Botão flutuante de WhatsApp — presente em qualquer ponto do scroll nas
// páginas públicas, além do CTA no menu (padrão comum em sites de
// imobiliárias/serviços: contacto rápido sempre visível).

import { FaWhatsapp } from 'react-icons/fa6';
import { WHATSAPP_URL } from './constants';

export default function WhatsappFloatButton({ href = WHATSAPP_URL }) {
  return (
    <a href={href} className="im-whatsapp-float" target="_blank" rel="noopener noreferrer" aria-label="Falar connosco no WhatsApp">
      <FaWhatsapp />
    </a>
  );
}
