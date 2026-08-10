// src/pages/projects/ApexKinetic/ApexKinetic.jsx
// Projeto de portfólio: landing page de alta conversão para um "fitness
// sanctuary" moderno — metodologia de design "Kinetic Contrast" (fundo
// escuro profundo, tipografia de impacto, acentos elétricos lima/laranja,
// grelha bento). Pensada para ser enviada a clientes reais (ginásios/boxes).
// Stack: React + CSS puro + IntersectionObserver (useScrollReveal, já usado no site principal).
// Acessível diretamente em /gym (fora do prefixo /projetos, a pedido).

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HiArrowLeft, HiMenuAlt3, HiX, HiOutlineLocationMarker, HiOutlinePhone, HiOutlineClock, HiOutlineMail, HiArrowRight } from "react-icons/hi";
import {
  FaDumbbell,
  FaFire,
  FaChalkboardUser,
  FaSpa,
  FaShower,
  FaSquareParking,
  FaBagShopping,
  FaSnowflake,
  FaWifi,
  FaChild,
  FaCheck,
  FaStar,
  FaFacebookF,
  FaInstagram,
  FaWhatsapp,
  FaTiktok,
  FaBolt,
} from "react-icons/fa6";
import useScrollReveal from "../../../hooks/useScrollReveal";
import "./ApexKinetic.css";

const navLinks = [
  { href: "#inicio", label: "Início" },
  { href: "#modalidades", label: "Modalidades" },
  { href: "#planos", label: "Planos" },
  { href: "#horarios", label: "Horários" },
  { href: "#contacto", label: "Contacto" },
];

// Mesmo número de demonstração usado nos outros projetos do portfólio —
// aqui com texto pré-preenchido por contexto (aula experimental vs. plano
// específico), o que aproxima o CTA do que um clube real usaria.
const WHATSAPP_NUMBER = "351913247176";
function waLink(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
const WHATSAPP_URL = waLink("Olá! Quero agendar uma aula experimental na Apex Kinetic Club.");

const ADDRESS = "Rua do Progresso 88, Aveiro, Portugal";
const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ADDRESS + " Apex Kinetic Club")}`;

const stats = [
  { value: "1200+", label: "Membros ativos" },
  { value: "900m²", label: "De área de treino" },
  { value: "18", label: "Coaches certificados" },
  { value: "4.9", label: "Avaliação média" },
];

const modalidades = [
  {
    className: "ak-bento-musc",
    icon: <FaDumbbell />,
    title: "Musculação",
    tag: "Área de 900m² · aberta 24h",
    description: "Mais de 80 estações de treino livre e guiado, pesos até 60kg e zona funcional sem hora marcada — para quem já sabe o que quer e para quem está a começar agora.",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1000&q=75",
  },
  {
    className: "ak-bento-cross",
    icon: <FaFire />,
    title: "CrossFit",
    tag: "Turmas às 7h · 13h · 19h",
    description: "WODs diários numa box totalmente equipada, com coaches certificados a corrigir cada movimento em tempo real.",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1000&q=75",
  },
  {
    className: "ak-bento-pt",
    icon: <FaChalkboardUser />,
    title: "Personal Training",
    tag: "1-a-1 com coach dedicado",
    description: "Plano 100% individual — objetivo, avaliação e progressão construídos à tua volta, sessão após sessão.",
  },
  {
    className: "ak-bento-well",
    icon: <FaSpa />,
    title: "Wellness",
    tag: "Sauna + Ice Bath",
    description: "Sauna, banho de gelo e zona de recovery para o corpo aguentar a intensidade do treino seguinte.",
  },
];

const tickerWords = ["TRANSFORMA-TE", "SEM LIMITES", "PERFORMANCE", "ENERGIA", "DISCIPLINA", "RESULTADOS"];

const plans = [
  {
    name: "Mensal",
    price: "54,90",
    billing: "Sem fidelização — cancela quando quiseres.",
    features: ["Acesso ilimitado à Musculação", "4 aulas de grupo por mês", "App de treino incluída", "Avaliação física inicial"],
  },
  {
    name: "Trimestral",
    price: "44,90",
    billing: "Cobrado a cada 3 meses (134,70 €).",
    features: [
      "Tudo do plano Mensal",
      "Acesso ilimitado a CrossFit e Wellness",
      "Aulas de grupo ilimitadas",
      "1 sessão de Personal Training/mês",
      "Avaliação física mensal",
    ],
    highlight: true,
    badge: "Mais Popular",
  },
  {
    name: "Anual",
    price: "37,90",
    billing: "Cobrado anualmente (454,80 €).",
    features: [
      "Tudo do plano Trimestral",
      "2 sessões de Personal Training/mês",
      "Congelamento de plano até 30 dias",
      "Kit de boas-vindas Apex",
      "Prioridade em eventos e workshops",
    ],
  },
];

// Padrão comum em boxes/ginásios reais: dias alternados com a mesma grelha
// de horários (Seg/Qua/Sex vs. Ter/Qui), Sábado só de manhã.
const mwf = [
  { time: "07:00", name: "CrossFit", coach: "Coach Nuno" },
  { time: "08:30", name: "Musculação Guiada", coach: "Coach Bea" },
  { time: "13:00", name: "CrossFit", coach: "Coach Nuno" },
  { time: "18:00", name: "Funcional", coach: "Coach Diogo" },
  { time: "19:00", name: "CrossFit", coach: "Coach Sara" },
  { time: "20:00", name: "Wellness · Yoga", coach: "Coach Sara" },
];
const tt = [
  { time: "07:30", name: "Funcional", coach: "Coach Diogo" },
  { time: "09:00", name: "Wellness · Mobilidade", coach: "Coach Sara" },
  { time: "12:30", name: "CrossFit", coach: "Coach Nuno" },
  { time: "17:30", name: "Musculação Guiada", coach: "Coach Bea" },
  { time: "19:00", name: "CrossFit", coach: "Coach Nuno" },
  { time: "20:00", name: "Funcional", coach: "Coach Diogo" },
];
const sat = [
  { time: "09:00", name: "CrossFit", coach: "Coach Diogo" },
  { time: "10:30", name: "Funcional em Equipa", coach: "Coach Sara" },
];
const scheduleDays = [
  { label: "Segunda", classes: mwf },
  { label: "Terça", classes: tt },
  { label: "Quarta", classes: mwf },
  { label: "Quinta", classes: tt },
  { label: "Sexta", classes: mwf },
  { label: "Sábado", classes: sat },
];

function classChipClass(name) {
  if (name.includes("CrossFit")) return "ak-chip-crossfit";
  if (name.includes("Musculação")) return "ak-chip-musc";
  if (name.includes("Wellness")) return "ak-chip-well";
  return "ak-chip-func";
}

const facilities = [
  { icon: <FaShower />, title: "Balneários Premium", description: "Chuveiros individuais, toalhas incluídas e produtos de higiene à disposição." },
  { icon: <FaSquareParking />, title: "Estacionamento Gratuito", description: "Lugares reservados para membros, mesmo nas horas de maior movimento." },
  { icon: <FaBagShopping />, title: "Loja & Suplementos", description: "Suplementação, snacks e equipamento de treino, sem sair do clube." },
  { icon: <FaSnowflake />, title: "Zona de Recovery", description: "Banhos de gelo e compressão para acelerar a recuperação muscular." },
  { icon: <FaWifi />, title: "Wifi de Alta Velocidade", description: "Rede dedicada para trabalhares ou fazeres stream do teu treino." },
  { icon: <FaChild />, title: "Área Kids", description: "Espaço vigiado para os mais pequenos enquanto treinas sem preocupações." },
];

const testimonials = [
  {
    text: "Entrei há 6 meses sem nunca ter pisado uma box e hoje treino CrossFit 4x por semana. A equipa da Apex não deixa ninguém para trás.",
    name: "Rui Tavares",
    initials: "RT",
  },
  {
    text: "O acompanhamento do Personal Training mudou a minha postura e os resultados apareceram em semanas, não meses.",
    name: "Marta Coelho",
    initials: "MC",
  },
  {
    text: "A zona de Wellness depois de um treino pesado é o que me faz voltar todos os dias. Instalações impecáveis, sem exagero.",
    name: "Duarte Neves",
    initials: "DN",
  },
];

function BentoCard({ item, index }) {
  const ref = useScrollReveal();
  return (
    <div
      ref={ref}
      className={`ak-bento-card ${item.className} reveal reveal-delay-${(index % 3) + 1}`}
      style={item.image ? { "--ak-bento-image": `url(${item.image})` } : undefined}
    >
      <div className="ak-bento-top">
        <span className="ak-bento-icon">{item.icon}</span>
        <span className="ak-bento-tag">{item.tag}</span>
      </div>
      <div className="ak-bento-body">
        <h3>{item.title}</h3>
        <p>{item.description}</p>
      </div>
    </div>
  );
}

function PricingCard({ plan }) {
  const ref = useScrollReveal();
  return (
    <div ref={ref} className={`ak-plan-card reveal ${plan.highlight ? "ak-plan-highlight" : ""}`}>
      {plan.badge && <span className="ak-plan-badge">{plan.badge}</span>}
      <h3>{plan.name}</h3>
      <div className="ak-plan-price">
        <span className="ak-plan-currency">€</span>
        <span className="ak-plan-value">{plan.price}</span>
        <span className="ak-plan-period">/mês</span>
      </div>
      <p className="ak-plan-billing">{plan.billing}</p>
      <ul className="ak-plan-features">
        {plan.features.map((f) => (
          <li key={f}>
            <FaCheck /> {f}
          </li>
        ))}
      </ul>
      <a
        href={waLink(`Olá! Quero saber mais sobre o plano ${plan.name} da Apex Kinetic Club.`)}
        className={`ak-plan-cta ${plan.highlight ? "ak-cta-button" : "ak-cta-outline"}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        Quero Começar
      </a>
    </div>
  );
}

function FacilityCard({ facility, index }) {
  const ref = useScrollReveal();
  return (
    <div ref={ref} className={`ak-facility-card reveal reveal-delay-${(index % 3) + 1}`}>
      <div className="ak-facility-icon">{facility.icon}</div>
      <div>
        <h3>{facility.title}</h3>
        <p>{facility.description}</p>
      </div>
    </div>
  );
}

function TestimonialCard({ testimonial, index }) {
  const ref = useScrollReveal();
  return (
    <div ref={ref} className={`ak-testimonial-card reveal reveal-delay-${index + 1}`}>
      <FaStar className="ak-testimonial-quote" />
      <p>&ldquo;{testimonial.text}&rdquo;</p>
      <div className="ak-testimonial-author">
        <span className="ak-testimonial-avatar">{testimonial.initials}</span>
        <span>{testimonial.name}</span>
      </div>
    </div>
  );
}

export default function ApexKinetic() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeDay, setActiveDay] = useState(0);
  const heroRef = useScrollReveal();
  const heroImageRef = useScrollReveal();
  const statsRef = useScrollReveal();
  const bentoHeaderRef = useScrollReveal();
  const pricingHeaderRef = useScrollReveal();
  const scheduleHeaderRef = useScrollReveal();
  const facilitiesHeaderRef = useScrollReveal();
  const testimonialsHeaderRef = useScrollReveal();
  const contactRef = useScrollReveal();

  useEffect(() => {
    // rAF evita ler window.scrollY em todos os disparos do evento "scroll"
    // (que pode ser dezenas de vezes por segundo), reduzindo o risco de
    // forçar um reflow síncrono.
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 40);
        ticking = false;
      });
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function handleNavClick(e, href) {
    e.preventDefault();
    document.getElementById(href.slice(1))?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  }

  return (
    <div className="ak-page">
      {/* Nav */}
      <nav className={`ak-nav ${scrolled ? "ak-nav-scrolled" : ""}`}>
        <div className="ak-nav-container">
          <Link to="/" className="ak-back-link">
            <HiArrowLeft /> <span>Portfólio</span>
          </Link>

          <a href="#inicio" className="ak-logo" onClick={(e) => handleNavClick(e, "#inicio")}>
            <FaBolt className="ak-logo-icon" />
            APEX <span className="ak-logo-accent">KINETIC</span>
          </a>

          <ul className={`ak-nav-links ${menuOpen ? "ak-nav-links-open" : ""}`}>
            {navLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href} onClick={(e) => handleNavClick(e, link.href)}>
                  {link.label}
                </a>
              </li>
            ))}
            <li className="ak-nav-cta-mobile">
              <a href={WHATSAPP_URL} className="ak-cta-button" target="_blank" rel="noopener noreferrer">
                Agendar Aula Experimental
              </a>
            </li>
          </ul>

          <a href={WHATSAPP_URL} className="ak-cta-button ak-cta-desktop" target="_blank" rel="noopener noreferrer">
            Agendar Aula Experimental
          </a>

          <button className="ak-nav-toggle" onClick={() => setMenuOpen((v) => !v)} aria-label="Abrir menu">
            {menuOpen ? <HiX /> : <HiMenuAlt3 />}
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section id="inicio" className="ak-hero">
        <div className="ak-hero-glow" aria-hidden="true" />
        <div className="ak-hero-content reveal" ref={heroRef}>
          <span className="ak-eyebrow">Fitness Sanctuary · Aveiro</span>
          <h1>
            O TEU LIMITE É SÓ<br />O <span className="ak-highlight">PONTO DE PARTIDA</span>
          </h1>
          <p>
            Musculação, CrossFit, Personal Training e Wellness debaixo do mesmo teto — equipamento de ponta, coaches obcecados por resultados
            e uma comunidade que te puxa para cima em cada treino.
          </p>
          <div className="ak-hero-actions">
            <a href={WHATSAPP_URL} className="ak-cta-button" target="_blank" rel="noopener noreferrer">
              Agendar Aula Experimental <HiArrowRight />
            </a>
            <a href="#modalidades" className="ak-secondary-button" onClick={(e) => handleNavClick(e, "#modalidades")}>
              Ver Modalidades
            </a>
          </div>
        </div>
        <div className="ak-hero-image reveal reveal-delay-2" ref={heroImageRef}>
          <img
            src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=900&q=80"
            alt="Zona de musculação da Apex Kinetic Club"
          />
          <div className="ak-hero-badge">
            <FaFire />
            <div>
              <strong>WODs todos os dias</strong>
              <span>7h · 13h · 19h</span>
            </div>
          </div>
        </div>
      </section>

      {/* Ticker cinético */}
      <div className="ak-ticker" aria-hidden="true">
        <div className="ak-ticker-track">
          {[...tickerWords, ...tickerWords].map((word, i) => (
            <span key={i} className="ak-ticker-item">
              {word} <span className="ak-ticker-dot">●</span>
            </span>
          ))}
        </div>
      </div>

      {/* Stats */}
      <section className="ak-stats reveal" ref={statsRef}>
        {stats.map((stat) => (
          <div key={stat.label} className="ak-stat">
            <span className="ak-stat-value">{stat.value}</span>
            <span className="ak-stat-label">{stat.label}</span>
          </div>
        ))}
      </section>

      {/* Modalidades — Bento Grid */}
      <section id="modalidades" className="ak-section">
        <div className="ak-section-header reveal" ref={bentoHeaderRef}>
          <span className="ak-section-label">Modalidades</span>
          <h2>Quatro formas de treinar, uma só obsessão</h2>
          <p>Escolhe o teu caminho — ou combina todos, é para isso que o clube existe.</p>
        </div>
        <div className="ak-bento-grid">
          {modalidades.map((item, i) => (
            <BentoCard key={item.title} item={item} index={i} />
          ))}
        </div>
      </section>

      {/* Planos */}
      <section id="planos" className="ak-section ak-plans-section">
        <div className="ak-section-header reveal" ref={pricingHeaderRef}>
          <span className="ak-section-label">Planos</span>
          <h2>Investe em ti — sem letras pequenas</h2>
          <p>Três formas de entrar. Quanto mais tempo de compromisso, menor o valor mensal.</p>
        </div>
        <div className="ak-plans-grid">
          {plans.map((plan) => (
            <PricingCard key={plan.name} plan={plan} />
          ))}
        </div>
      </section>

      {/* Horários */}
      <section id="horarios" className="ak-section">
        <div className="ak-section-header reveal" ref={scheduleHeaderRef}>
          <span className="ak-section-label">Horários</span>
          <h2>Encontra o teu treino em qualquer dia</h2>
          <p>Musculação livre está sempre aberta. As turmas seguem esta grelha semanal.</p>
        </div>

        <div className="ak-schedule">
          <div className="ak-schedule-tabs" role="tablist">
            {scheduleDays.map((day, i) => (
              <button
                key={day.label}
                role="tab"
                aria-selected={activeDay === i}
                className={`ak-schedule-tab ${activeDay === i ? "ak-schedule-tab-active" : ""}`}
                onClick={() => setActiveDay(i)}
              >
                {day.label}
              </button>
            ))}
          </div>

          <div className="ak-schedule-list">
            {scheduleDays[activeDay].classes.map((c, i) => (
              <div key={`${c.time}-${c.name}`} className="ak-schedule-row">
                <span className="ak-schedule-time">{c.time}</span>
                <span className={`ak-schedule-chip ${classChipClass(c.name)}`}>{c.name}</span>
                <span className="ak-schedule-coach">{c.coach}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Instalações */}
        <div className="ak-section-header ak-facilities-header reveal" ref={facilitiesHeaderRef}>
          <span className="ak-section-label">Instalações</span>
          <h2>Tudo o que rodeia o treino</h2>
        </div>
        <div className="ak-facilities-grid">
          {facilities.map((f, i) => (
            <FacilityCard key={f.title} facility={f} index={i} />
          ))}
        </div>
      </section>

      {/* Depoimentos */}
      <section className="ak-section ak-testimonials-section">
        <div className="ak-section-header reveal" ref={testimonialsHeaderRef}>
          <span className="ak-section-label">Depoimentos</span>
          <h2>Quem já sentiu a diferença</h2>
        </div>
        <div className="ak-testimonials-grid">
          {testimonials.map((t, i) => (
            <TestimonialCard key={t.name} testimonial={t} index={i} />
          ))}
        </div>
      </section>

      {/* Contacto / Localização */}
      <section id="contacto" className="ak-section ak-contact-section reveal" ref={contactRef}>
        <div className="ak-contact-grid">
          <div className="ak-contact-main">
            <span className="ak-section-label">Contacto</span>
            <h2>A tua primeira aula é por nossa conta</h2>
            <p>Manda-nos uma mensagem no WhatsApp e marcamos a tua aula experimental para esta semana — sem compromisso.</p>
            <a href={WHATSAPP_URL} className="ak-cta-button ak-contact-whatsapp" target="_blank" rel="noopener noreferrer">
              <FaWhatsapp /> Falar no WhatsApp
            </a>
          </div>

          <div className="ak-contact-info">
            <div className="ak-info-card">
              <div className="ak-info-icon">
                <HiOutlineLocationMarker />
              </div>
              <div>
                <h3>Morada</h3>
                <p>{ADDRESS}</p>
                <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="ak-info-link">
                  Ver no Google Maps <HiArrowRight />
                </a>
              </div>
            </div>
            <div className="ak-info-card">
              <div className="ak-info-icon">
                <HiOutlinePhone />
              </div>
              <div>
                <h3>Telefone</h3>
                <p>+351 913 247 176</p>
              </div>
            </div>
            <div className="ak-info-card">
              <div className="ak-info-icon">
                <HiOutlineMail />
              </div>
              <div>
                <h3>Email</h3>
                <p>treina@apexkinetic.pt</p>
              </div>
            </div>
            <div className="ak-info-card">
              <div className="ak-info-icon">
                <HiOutlineClock />
              </div>
              <div>
                <h3>Horário</h3>
                <p>Seg-Sex: 6h-23h · Sáb: 8h-18h</p>
                <p className="ak-info-alert">Dom: 9h-13h (só Wellness)</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="ak-footer">
        <div className="ak-footer-content">
          <div className="ak-footer-brand">
            <a href="#inicio" className="ak-logo" onClick={(e) => handleNavClick(e, "#inicio")}>
              <FaBolt className="ak-logo-icon" />
              APEX <span className="ak-logo-accent">KINETIC</span>
            </a>
            <p>Treino sério, comunidade real. O teu clube de performance em Aveiro.</p>
          </div>
          <div className="ak-footer-links">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} onClick={(e) => handleNavClick(e, link.href)}>
                {link.label}
              </a>
            ))}
          </div>
          <div className="ak-footer-socials">
            <a href="#" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href="#" aria-label="TikTok">
              <FaTiktok />
            </a>
            <a href="#" aria-label="Facebook">
              <FaFacebookF />
            </a>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
              <FaWhatsapp />
            </a>
          </div>
        </div>
        <div className="ak-footer-bottom">
          <p>© 2026 Apex Kinetic Club. Todos os direitos reservados.</p>
          <p className="ak-footer-note">Protótipo de portfólio — parte do site Código e Café.</p>
        </div>
      </footer>

      {/* Botão flutuante de WhatsApp — presente em qualquer ponto do scroll,
          além do CTA no menu (padrão comum em sites de clubes/serviços). */}
      <a href={WHATSAPP_URL} className="ak-whatsapp-float" target="_blank" rel="noopener noreferrer" aria-label="Falar connosco no WhatsApp">
        <FaWhatsapp />
      </a>
    </div>
  );
}
