// src/pages/projects/Pizzaria/WhatsappFloatButton.jsx
// Botão flutuante fixo (canto inferior direito) que abre o WhatsApp da
// pizzaria com uma mensagem pronta para dúvidas gerais — independente do
// fluxo de checkout do carrinho (que usa buildWhatsappUrl com o pedido).

import { FaWhatsapp } from 'react-icons/fa6';
import { WHATSAPP_NUMBER } from './whatsapp.js';

const DEFAULT_MESSAGE = 'Estou com uma dúvida e preciso de ajuda';

export default function WhatsappFloatButton() {
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(DEFAULT_MESSAGE)}`;

  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="pz-whatsapp-float" aria-label="Falar no WhatsApp">
      <FaWhatsapp />
    </a>
  );
}
