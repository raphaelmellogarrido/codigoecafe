// src/pages/projects/Achadinhos/AchadinhosNavbar.jsx
import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { HiMenuAlt3, HiOutlineShoppingBag, HiX } from 'react-icons/hi';
import { FaWhatsapp } from 'react-icons/fa';
import { WHATSAPP_URL } from './constants';

export default function AchadinhosNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <header className={`ach-nav ${scrolled ? 'ach-nav-scrolled' : ''}`}>
      <div className="ach-nav-inner">
        <NavLink to="/projetos/achadinhos" className="ach-nav-logo" onClick={() => setMenuOpen(false)}>
          <HiOutlineShoppingBag /> Achadinhos
        </NavLink>

        <nav className={`ach-nav-links ${menuOpen ? 'open' : ''}`}>
          <NavLink to="/projetos/achadinhos" end onClick={() => setMenuOpen(false)}>
            Home
          </NavLink>
          <NavLink to="/projetos/achadinhos/produtos" onClick={() => setMenuOpen(false)}>
            Produtos
          </NavLink>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="ach-nav-whatsapp">
            <FaWhatsapp /> Fale comigo
          </a>
        </nav>

        <button className="ach-nav-toggle" onClick={() => setMenuOpen((v) => !v)} aria-label="Abrir menu">
          {menuOpen ? <HiX /> : <HiMenuAlt3 />}
        </button>
      </div>
    </header>
  );
}
