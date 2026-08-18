// src/pages/projects/StudioTattoo/StudioTattooNavbar.jsx
// Navbar de duas camadas: barra de anúncios rotativa (marquee) no topo — como
// no tema de referência —, e o menu principal com logo, links âncora para as
// seções da página única, menu hambúrguer no mobile e um botão "Agendar" que
// abre o WhatsApp diretamente.

import { useState } from 'react';
import { FaBars, FaFeatherPointed, FaWhatsapp, FaXmark } from 'react-icons/fa6';
import { BUSINESS_NAME, BUSINESS_TAGLINE } from './constants';
import { ANNOUNCEMENTS } from './announcementsData';
import { buildBookingMessage, buildWhatsappUrl } from './whatsapp';

const NAV_LINKS = [
  { href: '#inicio', label: 'Início' },
  { href: '#galeria', label: 'Galeria' },
  { href: '#equipa', label: 'Equipa' },
  { href: '#orcamento', label: 'Orçamento' },
  { href: '#depoimentos', label: 'Depoimentos' },
  { href: '#faq', label: 'FAQ' },
];

// A lista de avisos é curta — repetida algumas vezes dentro de cada metade do
// marquee pra garantir que a largura do conteúdo nunca fique menor que a da
// tela (senão sobra um vão vazio antes do loop reiniciar, em telas largas).
const MARQUEE_ITEMS = Array.from({ length: 4 }, () => ANNOUNCEMENTS).flat();

export default function StudioTattooNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const whatsappHref = buildWhatsappUrl(buildBookingMessage());

  return (
    <header className="st-navbar">
      <div className="st-marquee" aria-label="Avisos">
        {/* Conteúdo duplicado 2x para o loop de rolagem ficar contínuo, sem
            salto — mesma técnica do tema de referência (marquee CSS puro).
            Cada metade repete os avisos (MARQUEE_ITEMS) o bastante pra cobrir
            telas largas sem deixar vão vazio no meio do ciclo. */}
        <div className="st-marquee-track">
          <div className="st-marquee-content">
            {MARQUEE_ITEMS.map((text, index) => (
              <span key={`${text}-${index}`} className="st-marquee-item">
                {text}
              </span>
            ))}
          </div>
          <div className="st-marquee-content" aria-hidden="true">
            {MARQUEE_ITEMS.map((text, index) => (
              <span key={`${text}-${index}`} className="st-marquee-item">
                {text}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="st-navbar-sticky">
        <div className="st-navbar-row">
          <div className="container st-navbar-row-inner">
            <a href="#inicio" className="st-navbar-brand" onClick={() => setMenuOpen(false)}>
              <FaFeatherPointed className="st-navbar-brand-icon" aria-hidden="true" />
              <span className="st-navbar-brand-text">
                <span className="st-navbar-brand-name">{BUSINESS_NAME}</span>
                <span className="st-navbar-brand-tagline">{BUSINESS_TAGLINE}</span>
              </span>
            </a>

            <button
              type="button"
              className="st-navbar-toggle"
              aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? <FaXmark /> : <FaBars />}
            </button>

            <nav className={`st-navbar-links${menuOpen ? ' st-navbar-links-open' : ''}`}>
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="st-navbar-link"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="st-navbar-cta"
                onClick={() => setMenuOpen(false)}
              >
                <FaWhatsapp aria-hidden="true" />
                Agendar
              </a>
            </nav>
          </div>
        </div>

        <div className="st-navbar-accent" aria-hidden="true" />
      </div>
    </header>
  );
}
