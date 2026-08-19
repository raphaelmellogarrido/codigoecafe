// src/pages/projects/BragaRemodelacao/BragaRemodelacaoFooter.jsx
// Footer em 4 colunas (marca, links rápidos, serviços, contacto/redes).

import { FaFacebook, FaInstagram, FaWhatsapp } from 'react-icons/fa6';
import { BUSINESS_NAME, BUSINESS_TAGLINE, SOCIAL_LINKS, WHATSAPP_NUMBER_DISPLAY } from './constants';
import { SERVICES } from './servicesData';
import { buildBookingMessage, buildWhatsappUrl } from './whatsapp';
import { scrollToSection } from './scrollToSection';

export default function BragaRemodelacaoFooter() {
  const whatsappHref = buildWhatsappUrl(buildBookingMessage());

  return (
    <footer className="brm-footer">
      <div className="container brm-footer-grid">
        <div className="brm-footer-col">
          <span className="brm-footer-brand">{BUSINESS_NAME}</span>
          <p className="brm-footer-text">{BUSINESS_TAGLINE}</p>
          <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="brm-footer-link">
            <FaWhatsapp aria-hidden="true" />
            {WHATSAPP_NUMBER_DISPLAY}
          </a>
        </div>

        <div className="brm-footer-col">
          <h3 className="brm-footer-heading">Links Rápidos</h3>
          <ul className="brm-footer-list">
            <li><a href="#inicio" onClick={(event) => scrollToSection(event, 'inicio')}>Início</a></li>
            <li><a href="#sobre" onClick={(event) => scrollToSection(event, 'sobre')}>Sobre Nós</a></li>
            <li><a href="#servicos" onClick={(event) => scrollToSection(event, 'servicos')}>Serviços</a></li>
            <li><a href="#projetos" onClick={(event) => scrollToSection(event, 'projetos')}>Projetos</a></li>
            <li><a href="#orcamento" onClick={(event) => scrollToSection(event, 'orcamento')}>Contactos</a></li>
          </ul>
        </div>

        <div className="brm-footer-col">
          <h3 className="brm-footer-heading">Serviços</h3>
          <ul className="brm-footer-list">
            {SERVICES.map((service) => (
              <li key={service.id}>{service.title}</li>
            ))}
          </ul>
        </div>

        <div className="brm-footer-col">
          <h3 className="brm-footer-heading">Contacto</h3>
          <p className="brm-footer-text">Braga, Portugal</p>
          <div className="brm-footer-social">
            <a href={SOCIAL_LINKS.facebook} aria-label="Facebook" className="brm-footer-social-icon">
              <FaFacebook />
            </a>
            <a href={SOCIAL_LINKS.instagram} aria-label="Instagram" className="brm-footer-social-icon">
              <FaInstagram />
            </a>
          </div>
        </div>
      </div>

      <div className="container brm-footer-bottom">
        <p className="brm-footer-note">
          Protótipo de portfólio — parte do site{' '}
          <a href="http://www.codigoecafe.com">Código e Café</a>.
        </p>
      </div>
    </footer>
  );
}
