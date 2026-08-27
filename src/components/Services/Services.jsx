// src/components/Services/Services.jsx
// Card único de destaque: "Sites que Vendem".
// Reúne, como benefícios dentro do card, o que antes eram 4 cards separados
// (Web Sites, Automação, Apps Mobile, Loja Virtual) — foco em negócio local.
// Hover: card sobe e ganha brilho verde.
// Animação fadeInUp via useScrollReveal.

import { FaCode, FaCheck } from "react-icons/fa6";
import useScrollReveal from "../../hooks/useScrollReveal";
import "./Services.css";

const features = [
  "Botão de WhatsApp fixo que rastreia de onde veio o cliente",
  "Carrega em menos de 2s no celular e já vem otimizado para Google",
  "Já configurado para Google Meu Negócio",
  "Hospedagem, domínio e suporte inclusos por 1 ano",
];

export default function Services() {
  const headerRef = useScrollReveal();
  const cardRef = useScrollReveal();

  return (
    <section id="services" className="services section">
      <div className="container">
        <div ref={headerRef} className="section-header reveal">
          <span className="section-label">O que fazemos</span>
          <h2 className="section-title">
            Serviços que <span className="gradient-text">transformam ideias</span>
          </h2>
          <p className="section-description">Um único foco: site que traz cliente do Google direto pro seu WhatsApp.</p>
        </div>

        <div className="services-grid services-grid--single">
          <div ref={cardRef} className="service-card reveal reveal-delay-1">
            <div className="service-icon">
              <FaCode />
            </div>
            <h3 className="service-title">Sites que Vendem</h3>
            <p className="service-description">
              Não é só site bonito. É site feito para vender.
            </p>
            <ul className="service-features">
              {features.map((feature, i) => (
                <li key={i}>
                  <FaCheck className="feature-check" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
