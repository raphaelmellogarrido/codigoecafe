// src/components/Footer/Footer.jsx
// Footer com:
//  - Logo + descrição
//  - Links sociais
//  - Copyright
//  - Linha "Feito com ☕ e React"

import { FaGithub, FaLinkedin, FaInstagram, FaTwitter, FaFacebookF, FaWhatsapp, FaTiktok } from "react-icons/fa";
import { FaCoffee } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./Footer.css";

const socials = [
  { icon: FaGithub, href: "https://github.com/raphaelmellogarrido", label: "GitHub" },
  { icon: FaLinkedin, href: "https://www.linkedin.com/in/raphaelmgs/", label: "LinkedIn" },
  { icon: FaInstagram, href: "https://www.instagram.com/codigoecafe.dev/", label: "Instagram" },
  { icon: FaFacebookF, href: "https://www.facebook.com/codigoecafe.dev", label: "Facebook" },
  { icon: FaWhatsapp, href: "https://wa.me/+351913247176", label: "WhatsApp" },
  { icon: FaTiktok, href: "https://www.tiktok.com/@codigoecafe.dev", label: "TikTok" },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-content">
        <div className="footer-brand">
          <a href="#home" className="footer-logo">
            <FaCoffee /> Código e <span className="gradient-text">Café</span>
          </a>
          <p className="footer-description">Desenvolvimento Full Stack com Paixão. Transformamos ideias em produtos digitais de excelência.</p>
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
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon />
              </a>
            );
          })}
        </div>

        <div className="footer-divider" />

        <div className="footer-bottom">
          <p>© 2026 Código e Café. Todos os direitos reservados.</p>
          <Link to="/politica-de-privacidade" className="footer-privacy-link">
            Política de Privacidade
          </Link>
          <p className="footer-credit">
            Feito com <FaCoffee className="coffee-icon" /> e React.
          </p>
        </div>
      </div>
    </footer>
  );
}
