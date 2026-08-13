// src/pages/projects/FazTudo/WhatsappFloatButton.jsx
// Botão flutuante, canto inferior direito, presente nas 3 páginas (renderizado
// pelo layout FazTudo.jsx). Mensagem fixa de urgência, independente da
// seleção feita na calculadora de orçamento.

import { FaWhatsapp } from 'react-icons/fa6';
import { buildUrgentMessage, buildWhatsappUrl } from './whatsapp';

export default function WhatsappFloatButton() {
  const href = buildWhatsappUrl(buildUrgentMessage());

  return (
    <a
      href={href}
      className="ft-whatsapp-float"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Atendimento rápido ou urgências pelo WhatsApp"
    >
      <FaWhatsapp className="ft-whatsapp-float-icon" />
      <span>Atendimento rápido/urgências</span>
    </a>
  );
}
