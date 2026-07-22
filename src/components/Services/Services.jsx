// src/components/Services/Services.jsx
// Grelha de 4 cards com os serviços oferecidos.
// Cada card tem: ícone gradient, título, descrição e 3 features.
// Hover: card sobe e ganha brilho verde.
// Animação fadeInUp via useScrollReveal (cada card individualmente).

import { FaCode, FaMobileScreen, FaGaugeHigh, FaBagShopping, FaCheck, FaBolt } from "react-icons/fa6";
import useScrollReveal from "../../hooks/useScrollReveal";
import "./Services.css";

// Mapa de nomes de ícones para componentes reais
const iconMap = {
  FaCode: FaCode,
  FaMobileScreen: FaMobileScreen,
  FaBolt: FaBolt,
  FaGaugeHigh: FaGaugeHigh,
  FaBagShopping: FaBagShopping,
};

function ServiceCard({ service, index }) {
  const ref = useScrollReveal();
  const IconComponent = iconMap[service.icon] || FaCode;

  return (
    <div ref={ref} className={`service-card reveal reveal-delay-${index + 1}`}>
      <div className="service-icon">
        <IconComponent />
      </div>
      <h3 className="service-title">{service.title}</h3>
      <p className="service-description">{service.description}</p>
      <ul className="service-features">
        {service.features.map((feature, i) => (
          <li key={i}>
            <FaCheck className="feature-check" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Services({ services }) {
  const headerRef = useScrollReveal();

  return (
    <section id="services" className="services section">
      <div className="container">
        <div ref={headerRef} className="section-header reveal">
          <span className="section-label">O que fazemos</span>
          <h2 className="section-title">
            Serviços que <span className="gradient-text">transformam ideias</span>
          </h2>
          <p className="section-description">Do conceito ao deploy — oferecemos soluções completas para o teu projeto digital.</p>
        </div>

        <div className="services-grid">
          {services.map((service, index) => (
            <ServiceCard key={index} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
