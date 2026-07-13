// src/components/Navbar/Navbar.jsx
// Navbar sticky com:
//  - Detecção de scroll para adicionar fundo blur (.scrolled)
//  - Menu hamburger em mobile (useState para abrir/fechar)
//  - Scroll suave para as secções ao clicar nos links
//  - Destaque do link da secção ativa via IntersectionObserver

import { useEffect, useState } from 'react';
import { HiMenuAlt3, HiX } from 'react-icons/hi';
import { FaCoffee } from 'react-icons/fa';
import './Navbar.css';

const links = [
  { href: '#home', label: 'Início' },
  { href: '#services', label: 'Serviços' },
  { href: '#portfolio', label: 'Portfólio' },
  { href: '#stats', label: 'Sobre' },
  { href: '#contact', label: 'Contacto' },
];

export default function Navbar() {
  // useState: guarda se a navbar já sofreu scroll (para o estilo .scrolled)
  const [scrolled, setScrolled] = useState(false);
  // useState: controla se o menu mobile está aberto
  const [menuOpen, setMenuOpen] = useState(false);
  // useState: qual o link ativo (para destacar no menu)
  const [activeSection, setActiveSection] = useState('home');

  // useEffect:监听ar o scroll para atualizar `scrolled`
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // estado inicial
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // useEffect: usar IntersectionObserver para detetar a secção visível
  useEffect(() => {
    const sectionIds = links.map((l) => l.href.slice(1));
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  // Fecha o menu mobile ao clicar num link
  const handleLinkClick = () => setMenuOpen(false);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container container">
        <a href="#home" className="navbar-logo" onClick={handleLinkClick}>
          <FaCoffee className="logo-icon" />
          <span>
            Código e <span className="gradient-text">Café</span>
          </span>
        </a>

        <ul className={`navbar-menu ${menuOpen ? 'open' : ''}`}>
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={handleLinkClick}
                className={activeSection === link.href.slice(1) ? 'active' : ''}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <button
          className="navbar-toggle"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Abrir menu"
        >
          {menuOpen ? <HiX /> : <HiMenuAlt3 />}
        </button>
      </div>
    </nav>
  );
}
