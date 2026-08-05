// src/pages/projects/Imobiliaria/ImobiliariaNavbar.jsx
import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { HiMenuAlt3, HiX } from 'react-icons/hi';
import { FaHouseChimney, FaWhatsapp } from 'react-icons/fa6';
import { WHATSAPP_URL } from './constants';

export default function ImobiliariaNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

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

  // "Sobre" e "Contacto" são secções só da Home. Se já estivermos lá, rola
  // suavemente até à secção; se estivermos noutra página (Imóveis, detalhe
  // de um imóvel), navega para a Home e passa o alvo via state — a Home lê
  // esse state e rola até lá assim que montar (mesmo padrão do "/projetos"
  // na Home principal do portfólio).
  function handleSectionClick(e, id) {
    setMenuOpen(false);
    if (location.pathname === '/imobiliaria') {
      e.preventDefault();
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  }

  return (
    <header className={`im-nav ${scrolled ? 'im-nav-scrolled' : ''} ${menuOpen ? 'im-nav-menu-open' : ''}`}>
      <div className="im-nav-inner">
        <NavLink to="/imobiliaria" className="im-nav-logo" onClick={handleNavClick}>
          <FaHouseChimney /> Dom<span className="im-logo-accent">us</span>
        </NavLink>

        <nav className={`im-nav-links ${menuOpen ? 'open' : ''}`}>
          <NavLink to="/imobiliaria" end onClick={handleNavClick}>
            Início
          </NavLink>
          <NavLink to="/imobiliaria/imoveis" onClick={handleNavClick}>
            Imóveis
          </NavLink>
          <Link to="/imobiliaria" state={{ scrollTo: 'sobre' }} onClick={(e) => handleSectionClick(e, 'sobre')}>
            Sobre
          </Link>
          <Link to="/imobiliaria" state={{ scrollTo: 'contacto' }} onClick={(e) => handleSectionClick(e, 'contacto')}>
            Contacto
          </Link>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="im-nav-whatsapp">
            <FaWhatsapp /> Contacte-nos
          </a>
        </nav>

        <button className="im-nav-toggle" onClick={() => setMenuOpen((v) => !v)} aria-label="Abrir menu">
          {menuOpen ? <HiX /> : <HiMenuAlt3 />}
        </button>
      </div>
    </header>
  );
}
