// src/components/Navbar/Navbar.jsx
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { FaCoffee } from "react-icons/fa";
import ReactPixel from "react-facebook-pixel";
import "./Navbar.css";

const links = [
  { href: "#home", label: "Início" },
  { href: "#services", label: "Serviços" },
  { href: "#portfolio", label: "Portfólio" },
  { href: "#stats", label: "Sobre" },
  { href: "#contact", label: "Contacto" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    // Só lê window.scrollY dentro de requestAnimationFrame — sem isto, o
    // evento "scroll" dispara dezenas de vezes por segundo e cada leitura
    // corre o risco de forçar um reflow síncrono no meio do scroll.
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 50);
        ticking = false;
      });
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const sectionIds = links.map((l) => l.href.slice(1));
    const sections = sectionIds.map((id) => document.getElementById(id)).filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // Trava o scroll do body enquanto o menu mobile está aberto. Além de
    // ser o comportamento esperado (não dá pra rolar a página "por trás"
    // do menu), isto evita o bug de renderização em que o backdrop-filter
    // do menu fixed some/fica transparente quando a página rola com o
    // menu aberto.
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // FUNÇÃO ATUALIZADA: Scroll + Rastreamento do Meta Pixel
  const handleLinkClick = (e, href) => {
    e.preventDefault();
    document.getElementById(href.slice(1))?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);

    // 1. Rastreio específico para a seção de Serviços
    if (href === "#services") {
      ReactPixel.trackCustom("CliqueMenuServicos", {
        posicao: "Header Principal",
      });
    }

    // 2. (Opcional, mas útil) Rastreio genérico de navegação do menu
    ReactPixel.trackCustom("NavegacaoMenu", {
      secao: href.replace("#", ""),
    });
  };

  const menuLinks = (
    <>
      {links.map((link) => (
        <li key={link.href}>
          <a href={link.href} onClick={(e) => handleLinkClick(e, link.href)} className={activeSection === link.href.slice(1) ? "active" : ""}>
            {link.label}
          </a>
        </li>
      ))}
    </>
  );

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="navbar-container container">
        {/* <a href="#home" className="navbar-logo" onClick={(e) => handleLinkClick(e, "#home")}> */}
        <a href="#home" className="navbar-logo" onClick={(e) => handleLinkClick(e, "#home")}>
          {/* <FaCoffee className="logo-icon" /> */}

          <img src="./logo.png" alt="" className="logo-icon" />
          <span>
            Código e <span className="gradient-text">Café</span>
          </span>
        </a>

        {/* Menu do desktop: fica dentro do fluxo normal do navbar. Some via
            CSS (display:none) no mobile — nesse caso quem aparece é o
            overlay portado abaixo. */}
        <ul className="navbar-menu">{menuLinks}</ul>

        <button className="navbar-toggle" onClick={() => setMenuOpen((v) => !v)} aria-label="Abrir menu">
          {menuOpen ? <HiX /> : <HiMenuAlt3 />}
        </button>
      </div>

      {/* Menu mobile renderizado via portal direto no <body>, fora da
          .navbar (que já é position:fixed). Um elemento fixed dentro de
          outro fixed + backdrop-filter é um bug conhecido de renderização
          no Chromium: o filho pode não pintar o próprio fundo/blur ao ser
          reaberto com a página já rolada, ficando transparente. Tirando-o
          da árvore da .navbar esse problema deixa de existir. */}
      {createPortal(
        <ul className={`mobile-menu-overlay ${menuOpen ? "open" : ""}`}>{menuLinks}</ul>,
        document.body,
      )}
    </nav>
  );
}
