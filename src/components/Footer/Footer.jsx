// src/components/Footer/Footer.jsx
// Footer com:
//  - Logo + descrição
//  - Links sociais
//  - Copyright
//  - Linha "Feito com ☕ e React"

import { FaGithub, FaLinkedin, FaInstagram, FaTwitter } from 'react-icons/fa';
import { FaCoffee } from 'react-icons/fa';
import './Footer.css';

const socials = [
  { icon: FaGithub, href: '#', label: 'GitHub' },
  { icon: FaLinkedin, href: '#', label: 'LinkedIn' },
  { icon: FaInstagram, href: '#', label: 'Instagram' },
  { icon: FaTwitter, href: '#', label: 'Twitter / X' },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-content">
        <div className="footer-brand">
          <a href="#home" className="footer-logo">
            <FaCoffee /> Código e <span className="gradient-text">Café</span>
          </a>
          <p className="footer-description">
            Desenvolvimento Full Stack com Paixão. Transformamos ideias em produtos digitais
            de excelência.
          </p>
        </div>

        <div className="footer-socials">
          {socials.map((social, i) => {
            const Icon = social.icon;
            return (
              <a
                key={i}
                href={social.href}
                className="footer-social-link"
                aria-label={social.label}
              >
                <Icon />
              </a>
            );
          })}
        </div>

        <div className="footer-divider" />

        <div className="footer-bottom">
          <p>© 2026 Código e Café. Todos os direitos reservados.</p>
          <p className="footer-credit">
            Feito com <FaCoffee className="coffee-icon" /> e React.
          </p>
        </div>
      </div>
    </footer>
  );
}
