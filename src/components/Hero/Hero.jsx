// src/components/Hero/Hero.jsx
// Secção principal em ecrã inteiro (100vh).
// Inclui:
//  - Headline com gradient-text
//  - 2 botões (primário + outline)
//  - Cards flutuantes decorativos com ícones de tech
//  - Mesh gradient animado no fundo (via CSS)

import { FaReact, FaNodeJs, FaJs, FaCode, FaHtml5, FaCss3Alt } from 'react-icons/fa';
import { HiArrowRight, HiPlay } from 'react-icons/hi';
import './Hero.css';

export default function Hero() {
  // Scroll suave para a secção de contacto
  const scrollToContact = (e) => {
    e.preventDefault();
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToPortfolio = (e) => {
    e.preventDefault();
    document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="hero">
      <div className="hero-bg" aria-hidden="true">
        <div className="hero-blob hero-blob-1" />
        <div className="hero-blob hero-blob-2" />
        <div className="hero-blob hero-blob-3" />
      </div>

      <div className="container hero-content">
        <span className="section-label reveal">⚡ Full Stack Studio</span>

        <h1 className="hero-title reveal reveal-delay-1">
          Somos <span className="gradient-text">Código e Café</span>.
        </h1>

        <h2 className="hero-subtitle reveal reveal-delay-2">
          Desenvolvimento Full Stack focado em criar experiências digitais incríveis.
        </h2>

        <p className="hero-description reveal reveal-delay-3">
          Transformamos ideias e designs em aplicações web modernas, rápidas e totalmente
          responsivas. Cada linha de código é uma linha de café — feita com paixão e precisão.
        </p>

        <div className="hero-buttons reveal reveal-delay-4">
          <a href="#contact" className="btn-primary" onClick={scrollToContact}>
            <span>Vamos Conversar?</span>
            <HiArrowRight />
          </a>
          <a href="#portfolio" className="btn-outline" onClick={scrollToPortfolio}>
            <HiPlay /> Ver Projetos
          </a>
        </div>
      </div>

      {/* Cards decorativos flutuantes com ícones de tech */}
      <div className="hero-floating" aria-hidden="true">
        <div className="floating-card floating-card-1">
          <FaReact />
        </div>
        <div className="floating-card floating-card-2">
          <FaJs />
        </div>
        <div className="floating-card floating-card-3">
          <FaNodeJs />
        </div>
        <div className="floating-card floating-card-4">
          <FaCode />
        </div>
        <div className="floating-card floating-card-5">
          <FaHtml5 />
        </div>
        <div className="floating-card floating-card-6">
          <FaCss3Alt />
        </div>
      </div>
    </section>
  );
}
