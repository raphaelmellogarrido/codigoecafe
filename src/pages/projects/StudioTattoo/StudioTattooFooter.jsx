// src/pages/projects/StudioTattoo/StudioTattooFooter.jsx
// Footer em 4 colunas (Contato, Estilos, FAQ rápido, Fotos).

import { FaFacebook, FaInstagram, FaWhatsapp } from 'react-icons/fa6';
import { BUSINESS_NAME, SOCIAL_LINKS, WHATSAPP_NUMBER_DISPLAY } from './constants';
import { TATTOO_STYLES } from './stylesData';
import { buildBookingMessage, buildWhatsappUrl } from './whatsapp';

const FOOTER_PHOTOS = [
  {
    src: 'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?auto=format&fit=crop&w=500&q=75',
    alt: 'Tatuagem nas costas em blackwork',
  },
  {
    src: 'https://images.unsplash.com/photo-1586243287039-23f4c8e2e7ab?auto=format&fit=crop&w=500&q=75',
    alt: 'Detalhe de tatuagem',
  },
];

export default function StudioTattooFooter() {
  const whatsappHref = buildWhatsappUrl(buildBookingMessage());

  return (
    <footer className="st-footer">
      <div className="container st-footer-grid">
        <div className="st-footer-col">
          <h3 className="st-footer-heading">Contato</h3>
          <span className="st-footer-brand">{BUSINESS_NAME}</span>
          <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="st-footer-link">
            <FaWhatsapp aria-hidden="true" />
            {WHATSAPP_NUMBER_DISPLAY}
          </a>
          <p className="st-footer-text">Terça a sábado, das 11h às 20h.</p>
        </div>

        <div className="st-footer-col">
          <h3 className="st-footer-heading">Estilos</h3>
          <ul className="st-footer-list">
            {TATTOO_STYLES.map((style) => (
              <li key={style.id}>{style.name}</li>
            ))}
          </ul>
        </div>

        <div className="st-footer-col">
          <h3 className="st-footer-heading">Dúvidas rápidas</h3>
          <ul className="st-footer-list">
            <li>Higiene e material esterilizado</li>
            <li>Atendimento a partir dos 18 anos</li>
            <li>Sinal necessário para agendar</li>
          </ul>
        </div>

        <div className="st-footer-col st-footer-photos">
          {FOOTER_PHOTOS.map((photo) => (
            <img key={photo.src} src={photo.src} alt={photo.alt} className="st-footer-photo" />
          ))}
        </div>
      </div>

      <div className="container st-footer-bottom">
        <div className="st-footer-social">
          <span>Se conecte conosco em:</span>
          <a href={SOCIAL_LINKS.facebook} className="st-footer-social-icon" aria-label="Facebook">
            <FaFacebook />
          </a>
          <a href={SOCIAL_LINKS.instagram} className="st-footer-social-icon" aria-label="Instagram">
            <FaInstagram />
          </a>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="st-footer-social-icon"
            aria-label="WhatsApp"
          >
            <FaWhatsapp />
          </a>
        </div>

        <p className="st-footer-note">
          Protótipo de portfólio — parte do site{' '}
          <a href="http://www.codigoecafe.com">Código e Café</a>.
        </p>
      </div>
    </footer>
  );
}
