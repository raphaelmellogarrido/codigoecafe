// src/pages/projects/Imobiliaria/ImobiliariaFooter.jsx
import { Link } from 'react-router-dom';
import { FaFacebookF, FaHouseChimney, FaInstagram, FaWhatsapp } from 'react-icons/fa6';
import { WHATSAPP_URL } from './constants';

export default function ImobiliariaFooter() {
  return (
    <footer id="contacto" className="im-footer">
      <div className="im-footer-cta">
        <h2>Não encontraste o imóvel ideal?</h2>
        <p>Fala connosco no WhatsApp — percebemos o que procuras e mostramos-te opções à tua medida.</p>
        <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="im-btn-whatsapp">
          <FaWhatsapp /> Falar no WhatsApp
        </a>
      </div>

      <div className="im-footer-content">
        <div className="im-footer-brand">
          <Link to="/imobiliaria" className="im-nav-logo">
            <FaHouseChimney /> Dom<span className="im-logo-accent">us</span>
          </Link>
          <p>Imobiliária de confiança para comprar, vender ou arrendar em Portugal.</p>
        </div>

        <div className="im-footer-links">
          <Link to="/imobiliaria">Início</Link>
          <Link to="/imobiliaria/imoveis">Imóveis</Link>
          <Link to="/imobiliaria" state={{ scrollTo: 'sobre' }}>
            Sobre
          </Link>
          <a href="#contacto">Contacto</a>
        </div>

        <div className="im-footer-socials">
          <a href="#" aria-label="Facebook">
            <FaFacebookF />
          </a>
          <a href="#" aria-label="Instagram">
            <FaInstagram />
          </a>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
            <FaWhatsapp />
          </a>
        </div>
      </div>

      <div className="im-footer-bottom">
        <p>© 2026 Domus Imobiliária. Todos os direitos reservados.</p>
        <p className="im-footer-note">
          Protótipo de portfólio — parte do site{' '}
          <a href="http://www.codigoecafe.com">Código e Café</a>.
        </p>
      </div>
    </footer>
  );
}
