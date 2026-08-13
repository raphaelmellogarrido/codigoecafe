// src/pages/projects/FazTudo/FazTudoNavbar.jsx
// Navbar de duas camadas, inspirada no site de referência: barra fina no
// topo com contato rápido, e o menu principal com logo em duas linhas,
// links âncora para as seções da página única, menu hambúrguer no mobile e
// um botão de destaque que abre o WhatsApp diretamente.

import { useState } from 'react';
import { FaBars, FaScrewdriverWrench, FaWhatsapp, FaXmark } from 'react-icons/fa6';
import { BUSINESS_NAME, BUSINESS_TAGLINE, WHATSAPP_NUMBER_DISPLAY } from './constants';
import { buildUrgentMessage, buildWhatsappUrl } from './whatsapp';

const NAV_LINKS = [
  { href: '#inicio', label: 'Início' },
  { href: '#servicos', label: 'Serviços' },
  { href: '#atendimento', label: 'Área de atendimento' },
  { href: '#depoimentos', label: 'Depoimentos' },
];

export default function FazTudoNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const whatsappHref = buildWhatsappUrl(buildUrgentMessage());

  return (
    <header className="ft-navbar">
      <div className="ft-topbar">
        <div className="ft-topbar-row">
          <div className="container ft-topbar-row-inner">
            <span className="ft-topbar-text">Atendimento rápido, sem compromisso</span>
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="ft-topbar-phone">
              <FaWhatsapp aria-hidden="true" />
              {WHATSAPP_NUMBER_DISPLAY}
            </a>
          </div>
        </div>
      </div>

      <div className="ft-navbar-sticky">
        <div className="ft-navbar-row">
          <div className="container ft-navbar-row-inner">
            <a href="#inicio" className="ft-navbar-brand" onClick={() => setMenuOpen(false)}>
              <FaScrewdriverWrench className="ft-navbar-brand-icon" aria-hidden="true" />
              <span className="ft-navbar-brand-text">
                <span className="ft-navbar-brand-name">{BUSINESS_NAME}</span>
                <span className="ft-navbar-brand-tagline">{BUSINESS_TAGLINE}</span>
              </span>
            </a>

            <button
              type="button"
              className="ft-navbar-toggle"
              aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? <FaXmark /> : <FaBars />}
            </button>

            <nav className={`ft-navbar-links${menuOpen ? ' ft-navbar-links-open' : ''}`}>
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="ft-navbar-link"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="ft-navbar-cta"
                onClick={() => setMenuOpen(false)}
              >
                <FaWhatsapp aria-hidden="true" />
                WhatsApp
              </a>
            </nav>
          </div>
        </div>

        <div className="ft-navbar-accent" aria-hidden="true" />
      </div>
    </header>
  );
}
