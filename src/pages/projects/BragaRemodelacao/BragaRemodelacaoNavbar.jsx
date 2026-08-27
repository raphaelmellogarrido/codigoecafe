// src/pages/projects/BragaRemodelacao/BragaRemodelacaoNavbar.jsx
// Topbar fina (WhatsApp + redes sociais, só desktop) + navbar sticky com
// links âncora para as secções da página única, menu hambúrguer no mobile e
// um CTA que rola até o formulário de orçamento (não abre WhatsApp direto —
// o formulário é o caminho principal de conversão).

import { useState } from 'react';
import { FaBars, FaFacebook, FaInstagram, FaWhatsapp, FaXmark } from 'react-icons/fa6';
import { BUSINESS_NAME, SOCIAL_LINKS, WHATSAPP_NUMBER_DISPLAY } from './constants';
import { buildBookingMessage, buildWhatsappUrl } from './whatsapp';
import { scrollToSection } from './scrollToSection';

const NAV_LINKS = [
  { href: '#inicio', label: 'Início' },
  { href: '#sobre', label: 'Sobre' },
  { href: '#servicos', label: 'Serviços' },
  { href: '#projetos', label: 'Projetos' },
  { href: '#orcamento', label: 'Contato' },
];

export default function BragaRemodelacaoNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const whatsappHref = buildWhatsappUrl(buildBookingMessage());

  function closeMenu() {
    setMenuOpen(false);
  }

  function handleNavClick(event, id) {
    closeMenu();
    scrollToSection(event, id);
  }

  return (
    <header className="brm-navbar">
      <div className="brm-topbar">
        <div className="container brm-topbar-inner">
          <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="brm-topbar-phone">
            <FaWhatsapp aria-hidden="true" />
            {WHATSAPP_NUMBER_DISPLAY}
          </a>
          <div className="brm-topbar-social">
            <a href={SOCIAL_LINKS.facebook} aria-label="Facebook">
              <FaFacebook />
            </a>
            <a href={SOCIAL_LINKS.instagram} aria-label="Instagram">
              <FaInstagram />
            </a>
          </div>
        </div>
      </div>

      <div className="brm-navbar-row">
        <div className="container brm-navbar-row-inner">
          <a href="#inicio" className="brm-navbar-brand" onClick={(event) => handleNavClick(event, 'inicio')}>
            {BUSINESS_NAME}
          </a>

          <button
            type="button"
            className="brm-navbar-toggle"
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <FaXmark /> : <FaBars />}
          </button>

          <nav className={`brm-navbar-links${menuOpen ? ' brm-navbar-links-open' : ''}`}>
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="brm-navbar-link"
                onClick={(event) => handleNavClick(event, link.href.slice(1))}
              >
                {link.label}
              </a>
            ))}
            <a
              href="#orcamento"
              className="brm-btn brm-btn-primary brm-navbar-cta"
              onClick={(event) => handleNavClick(event, 'orcamento')}
            >
              Pedir Orçamento
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
