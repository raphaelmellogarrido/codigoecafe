// src/components/Hero/Hero.jsx
// Secção principal em ecrã inteiro (100vh).
// Inclui:
//  - Headline com gradient-text
//  - 2 botões (primário + outline)
//  - Cards flutuantes decorativos com ícones de tech
//  - Mesh gradient animado no fundo (via CSS)

import { FaReact, FaNodeJs, FaJs, FaCode, FaHtml5, FaCss3Alt } from "react-icons/fa";
import { HiArrowRight, HiPlay, HiCheck } from "react-icons/hi";
import useScrollReveal from "../../hooks/useScrollReveal";
import "./Hero.css";

const BENEFITS = ["Botão de WhatsApp", "Otimizado para aparecer no Google", "Design profissional que passa confiança", "30 dias de ajustes grátis"];

export default function Hero() {
  // Um ref por elemento — sem isto, a classe "reveal" nunca recebe o
  // "visible" que o CSS precisa para tirar o opacity:0 (ver useScrollReveal.js).
  const titleRef = useScrollReveal();
  const subtitleRef = useScrollReveal();
  const buttonsRef = useScrollReveal();
  const benefitsRef = useScrollReveal();

  const scrollToPortfolio = (e) => {
    e.preventDefault();
    document.getElementById("portfolio")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="home" className="hero">
      <div className="hero-bg" aria-hidden="true">
        <div className="hero-blob hero-blob-1" />
        <div className="hero-blob hero-blob-2" />
        <div className="hero-blob hero-blob-3" />
      </div>

      <div className="container hero-content">
        <h1 ref={titleRef} className="hero-title reveal reveal-delay-1">
          <span className="gradient-text">Mais clientes</span> pelo WhatsApp<span className="gradient-text"> em 7 dias.</span>
        </h1>

        <h2 ref={subtitleRef} className="hero-subtitle reveal reveal-delay-2">
          Sites profissionais feitos pra transformar visita em conversa - sem mensalidade e sem dor de cabeça.
        </h2>

        <div ref={buttonsRef} className="hero-buttons reveal reveal-delay-3">
          <a href="https://wa.me/+351913247176" className="btn-primary" target="blank">
            <span>Quero um Orçamento em 24h</span>
            <HiArrowRight />
          </a>
          <a href="#portfolio" className="btn-outline" onClick={scrollToPortfolio}>
            <HiPlay /> Ver Sites Ao Vivo
          </a>
        </div>

        <ul ref={benefitsRef} className="hero-benefits reveal reveal-delay-4">
          {BENEFITS.map((benefit) => (
            <li key={benefit}>
              <HiCheck />
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Cards decorativos flutuantes com ícones de tech */}
      {/* <div className="hero-floating" aria-hidden="true">
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
      </div> */}
    </section>
  );
}
