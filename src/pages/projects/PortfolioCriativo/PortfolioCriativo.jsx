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
  {
    title: 'Nébula',
    category: 'Identidade visual',
    image: 'https://images.unsplash.com/photo-1763705857736-2b4f16a33758?auto=format&fit=crop&w=600&q=75',
  },
  {
    title: 'Aurora',
    category: 'Web design',
    image: 'https://images.unsplash.com/photo-1772272935464-2e90d8218987?auto=format&fit=crop&w=600&q=75',
  },
  {
    title: 'Prisma',
    category: 'Motion design',
    image: 'https://images.unsplash.com/photo-1699060463533-94ceb428c67f?auto=format&fit=crop&w=600&q=75',
  },
  {
    title: 'Vórtice',
    category: 'Experiência 3D',
    image: 'https://images.unsplash.com/photo-1643139863038-7355941e9e89?auto=format&fit=crop&w=600&q=75',
  },
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
              <div
                className="pc-work-thumb"
                style={{
                  backgroundImage: `linear-gradient(135deg, rgba(139, 92, 246, 0.55), rgba(34, 211, 238, 0.55)), url(${w.image})`,
                }}
              />
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
