// src/pages/projects/Pizzaria/PizzariaFooter.jsx
// Rodapé simples: marca, contato via WhatsApp e créditos do portfólio.

import { FaWhatsapp } from 'react-icons/fa6';
import { WHATSAPP_NUMBER } from './whatsapp.js';

export default function PizzariaFooter() {
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Estou com uma dúvida e preciso de ajuda')}`;

  return (
    <footer className="pz-footer">
      <div className="pz-footer-content">
        <div className="pz-footer-brand">
          <span className="pz-navbar-brand">Pizzaria Mello's</span>
          <p>Pizza artesanal feita na hora, pedida em segundos pelo WhatsApp.</p>
        </div>

        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="pz-button pz-button-secondary">
          <FaWhatsapp /> Falar no WhatsApp
        </a>
      </div>

      <div className="pz-footer-bottom">
        <p>© 2026 Pizzaria Mello's. Todos os direitos reservados.</p>
        <p className="pz-footer-note">
          Protótipo de portfólio — parte do site{' '}
          <a href="http://www.codigoecafe.com">Código e Café</a>.
        </p>
      </div>
    </footer>
  );
}
