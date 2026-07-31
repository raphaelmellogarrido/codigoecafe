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
    // rAF evita ler window.scrollY em todos os disparos do evento "scroll",
    // reduzindo o risco de forçar um reflow síncrono.
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 12);
        ticking = false;
      });
    };
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

  // O <ScrollToTop> global só reage a mudança de rota — clicar num link
  // para a página em que já se está não muda a rota, por isso não rola.
  function handleNavClick() {
    setMenuOpen(false);
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }

  return (
    <header className={`ach-nav ${scrolled ? 'ach-nav-scrolled' : ''} ${menuOpen ? 'ach-nav-menu-open' : ''}`}>
      <div className="ach-nav-inner">
        <NavLink to="/projetos/achadinhos" className="ach-nav-logo" onClick={handleNavClick}>
          <HiOutlineShoppingBag /> Achadinhos
        </NavLink>

        <nav className={`ach-nav-links ${menuOpen ? 'open' : ''}`}>
          <NavLink to="/projetos/achadinhos" end onClick={handleNavClick}>
            Home
          </NavLink>
          <NavLink to="/projetos/achadinhos/produtos" onClick={handleNavClick}>
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
