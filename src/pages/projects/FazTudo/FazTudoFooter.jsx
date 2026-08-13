// src/pages/projects/FazTudo/FazTudoFooter.jsx
// Footer em 4 colunas (Contato, Serviços, Atendemos em, Fotos), inspirado no
// site de referência.

import { FaFacebook, FaInstagram, FaLocationDot, FaWhatsapp } from 'react-icons/fa6';
import {
  BUSINESS_NAME,
  SERVICE_AREA_NEIGHBORHOODS,
  SOCIAL_LINKS,
  WHATSAPP_NUMBER_DISPLAY,
} from './constants';
import { SERVICES } from './servicesData';
import { buildUrgentMessage, buildWhatsappUrl } from './whatsapp';

const FOOTER_PHOTOS = [
  {
    src: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=500&q=75',
    alt: 'Ferramentas de trabalho organizadas',
  },
  {
    src: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=500&q=75',
    alt: 'Profissional usando ferramenta elétrica',
  },
];

export default function FazTudoFooter() {
  const whatsappHref = buildWhatsappUrl(buildUrgentMessage());

  return (
    <footer className="ft-footer">
      <div className="container ft-footer-grid">
        <div className="ft-footer-col">
          <h3 className="ft-footer-heading">Contato</h3>
          <span className="ft-footer-brand">{BUSINESS_NAME}</span>
          <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="ft-footer-link">
            <FaWhatsapp aria-hidden="true" />
            {WHATSAPP_NUMBER_DISPLAY}
          </a>
        </div>

        <div className="ft-footer-col">
          <h3 className="ft-footer-heading">Nossos serviços</h3>
          <ul className="ft-footer-list">
            {SERVICES.map((service) => (
              <li key={service.id}>{service.name}</li>
            ))}
          </ul>
        </div>

        <div className="ft-footer-col">
          <h3 className="ft-footer-heading">Atendemos em</h3>
          <ul className="ft-footer-list ft-footer-list-pins">
            {SERVICE_AREA_NEIGHBORHOODS.map((neighborhood) => (
              <li key={neighborhood}>
                <FaLocationDot className="ft-footer-pin" aria-hidden="true" />
                {neighborhood}
              </li>
            ))}
            <li>
              <FaLocationDot className="ft-footer-pin" aria-hidden="true" />e locais próximos
            </li>
          </ul>
        </div>

        <div className="ft-footer-col ft-footer-photos">
          {FOOTER_PHOTOS.map((photo) => (
            <img key={photo.src} src={photo.src} alt={photo.alt} className="ft-footer-photo" />
          ))}
        </div>
      </div>

      <div className="container ft-footer-bottom">
        <div className="ft-footer-social">
          <span>Se conecte conosco em:</span>
          <a href={SOCIAL_LINKS.facebook} className="ft-footer-social-icon" aria-label="Facebook">
            <FaFacebook />
          </a>
          <a href={SOCIAL_LINKS.instagram} className="ft-footer-social-icon" aria-label="Instagram">
            <FaInstagram />
          </a>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="ft-footer-social-icon"
            aria-label="WhatsApp"
          >
            <FaWhatsapp />
          </a>
        </div>

        <p className="ft-footer-note">
          Protótipo de portfólio — parte do site{' '}
          <a href="http://www.codigoecafe.com">Código e Café</a>.
        </p>
      </div>
    </footer>
  );
}
