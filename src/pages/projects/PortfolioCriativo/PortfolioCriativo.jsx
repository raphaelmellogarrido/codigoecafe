// src/pages/projects/PortfolioCriativo/PortfolioCriativo.jsx
// Projeto de portfólio: site criativo com fundo 3D interativo.
// Stack demonstrado: React + Three.js (cena 3D no hero) + GSAP (reveal + ScrollTrigger).

import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HiArrowLeft } from 'react-icons/hi';
import ThreeBackground from './ThreeBackground';
import './PortfolioCriativo.css';

gsap.registerPlugin(ScrollTrigger);

const works = [
  { title: 'Nébula', category: 'Identidade visual' },
  { title: 'Aurora', category: 'Web design' },
  { title: 'Prisma', category: 'Motion design' },
  { title: 'Vórtice', category: 'Experiência 3D' },
];

export default function PortfolioCriativo() {
  const heroRef = useRef(null);
  const workRefs = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Reveal do texto do hero, em stagger, ao montar a página
      gsap.from(heroRef.current.querySelectorAll('.reveal-line'), {
        y: 60,
        opacity: 0,
        duration: 0.9,
        stagger: 0.15,
        ease: 'power3.out',
      });

      // Cada card de trabalho aparece ao entrar na viewport
      workRefs.current.forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          y: 40,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
          },
        });
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="pc-page">
      <nav className="pc-nav">
        <Link to="/" className="pc-back">
          <HiArrowLeft /> Voltar ao portfólio
        </Link>
        <span className="pc-logo">Studio.</span>
      </nav>

      <section className="pc-hero" ref={heroRef}>
        <ThreeBackground />
        <div className="pc-hero-content">
          <p className="reveal-line pc-eyebrow">Design &amp; Experiências Interativas</p>
          <h1 className="pc-title">
            <span className="reveal-line">Criamos mundos</span>
            <span className="reveal-line">digitais memoráveis.</span>
          </h1>
          <p className="reveal-line pc-subtitle">
            Um portfólio interativo construído com Three.js para os visuais 3D e GSAP
            para as animações — tudo dentro de React.
          </p>
        </div>
      </section>

      <section className="pc-work">
        <h2 className="pc-section-title">Trabalho selecionado</h2>
        <div className="pc-work-grid">
          {works.map((w, i) => (
            <div key={w.title} className="pc-work-card" ref={(el) => (workRefs.current[i] = el)}>
              <div className="pc-work-thumb" />
              <h3>{w.title}</h3>
              <span>{w.category}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="pc-cta">
        <h2>Vamos criar algo memorável?</h2>
        <button className="pc-cta-button">Iniciar projeto</button>
      </section>

      <footer className="pc-footer">
        Projeto de demonstração — Studio © 2026. Parte do portfólio Código e Café.
      </footer>
    </div>
  );
}
