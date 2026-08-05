// src/pages/projects/Veterinaria/Veterinaria.jsx
// Projeto de portfólio: landing page elegante para clínica veterinária,
// pensada para ser enviada a clientes reais (veterinários / clínicas de animais).
// Stack: React + CSS puro + IntersectionObserver (useScrollReveal, já usado no site principal).
// Acessível diretamente em /veterinaria (fora do prefixo /projetos, a pedido).

import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  HiArrowLeft,
  HiMenuAlt3,
  HiX,
  HiOutlineLocationMarker,
  HiOutlinePhone,
  HiOutlineClock,
  HiOutlineMail,
  HiCheckCircle,
} from "react-icons/hi";
import {
  FaPaw,
  FaStethoscope,
  FaSyringe,
  FaXRay,
  FaScissors,
  FaTruckMedical,
  FaHandHoldingHeart,
  FaShieldHeart,
  FaStar,
  FaFacebookF,
  FaInstagram,
  FaWhatsapp,
} from "react-icons/fa6";
import useScrollReveal from "../../../hooks/useScrollReveal";
import "./Veterinaria.css";

const navLinks = [
  { href: "#inicio", label: "Início" },
  { href: "#sobre", label: "Sobre" },
  { href: "#servicos", label: "Serviços" },
  { href: "#equipa", label: "Equipa" },
  { href: "#galeria", label: "Galeria" },
  { href: "#depoimentos", label: "Depoimentos" },
  { href: "#contacto", label: "Contacto" },
];

// Número de demonstração — mesmo formato/placeholder usado nos outros
// projetos do portfólio (não é um número real).
const WHATSAPP_URL = "https://wa.me/+351913247176";

const stats = [
  { value: "12+", label: "Anos de experiência" },
  { value: "6 mil+", label: "Animais tratados" },
  { value: "4.9", label: "Avaliação média" },
  { value: "24h", label: "Emergência disponível" },
];

const values = [
  {
    icon: <FaHandHoldingHeart />,
    title: "Cuidado como em casa",
    description: "Ambiente calmo e equipa paciente, para o teu animal se sentir seguro em cada visita.",
  },
  {
    icon: <FaXRay />,
    title: "Diagnóstico de precisão",
    description: "Raio-X, ecografia e análises no local — resultados rápidos, sem esperas desnecessárias.",
  },
  {
    icon: <FaTruckMedical />,
    title: "Emergência 24 horas",
    description: "Urgências não têm hora marcada. A nossa equipa está disponível de dia e de noite.",
  },
];

const services = [
  {
    icon: <FaStethoscope />,
    title: "Consultas & Check-ups",
    description: "Avaliação completa da saúde do teu animal, com atenção a cada detalhe.",
  },
  {
    icon: <FaSyringe />,
    title: "Vacinação & Prevenção",
    description: "Planos de vacinação e desparasitação adaptados à idade e ao estilo de vida.",
  },
  {
    icon: <FaShieldHeart />,
    title: "Cirurgia & Ortopedia",
    description: "Procedimentos cirúrgicos com equipamento moderno e acompanhamento pós-operatório.",
  },
  {
    icon: <FaXRay />,
    title: "Exames de Imagem",
    description: "Raio-X e ecografia no local, para diagnósticos rápidos e precisos.",
  },
  {
    icon: <FaScissors />,
    title: "Banho & Tosa",
    description: "Higiene e bem-estar num ambiente calmo, pensado para reduzir o stress do animal.",
  },
  {
    icon: <FaTruckMedical />,
    title: "Emergência 24h",
    description: "Equipa disponível a qualquer hora para as urgências que não podem esperar.",
  },
];

const team = [
  {
    name: "Dra. Inês Cardoso",
    role: "Clínica Geral & Cirurgia",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=500&q=75",
  },
  {
    name: "Dr. Tiago Rocha",
    role: "Diagnóstico & Ortopedia",
    image: "https://images.unsplash.com/photo-1521305916504-4a1121188589?auto=format&fit=crop&w=500&q=75",
  },
  {
    name: "Dr. Bruno Matias",
    role: "Medicina Felina & Emergência",
    image: "https://images.unsplash.com/photo-1622902046580-2b47f47f5471?auto=format&fit=crop&w=500&q=75",
  },
];

const gallery = [
  "https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=600&q=75",
  "https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?auto=format&fit=crop&w=600&q=75",
  "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=600&q=75",
  "https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=600&q=75",
  "https://images.unsplash.com/photo-1594149929911-78975a43d4f5?auto=format&fit=crop&w=600&q=75",
  "https://images.unsplash.com/photo-1583512603805-3cc6b41f3edb?auto=format&fit=crop&w=600&q=75",
];

const testimonials = [
  {
    text: "O Rex tinha pavor de veterinário e a equipa da Vetta conseguiu o impossível — hoje ele entra a abanar a cauda.",
    name: "Carla Ribeiro",
    detail: "dona do Rex",
    initials: "CR",
  },
  {
    text: "Levámos a nossa gata para uma cirurgia de urgência a meio da noite e fomos atendidos com uma calma incrível. Salvaram a vida dela.",
    name: "Nuno Pereira",
    detail: "dono da Mia",
    initials: "NP",
  },
  {
    text: "Consultas de rotina impecáveis e sempre com explicações claras sobre cada tratamento. Recomendo de olhos fechados.",
    name: "Filipa Antunes",
    detail: "dona do Toby",
    initials: "FA",
  },
];

function TeamCard({ member, index }) {
  const ref = useScrollReveal();
  return (
    <div ref={ref} className={`vt-team-card reveal reveal-delay-${index + 1}`}>
      <div className="vt-team-photo">
        <img src={member.image} alt={member.name} />
      </div>
      <h3>{member.name}</h3>
      <span>{member.role}</span>
    </div>
  );
}

function ServiceCard({ service, index }) {
  const ref = useScrollReveal();
  return (
    <div ref={ref} className={`vt-service-card reveal reveal-delay-${(index % 3) + 1}`}>
      <div className="vt-service-icon">{service.icon}</div>
      <h3>{service.title}</h3>
      <p>{service.description}</p>
    </div>
  );
}

function TestimonialCard({ testimonial, index }) {
  const ref = useScrollReveal();
  return (
    <div ref={ref} className={`vt-testimonial-card reveal reveal-delay-${index + 1}`}>
      <p>&ldquo;{testimonial.text}&rdquo;</p>
      <div className="vt-testimonial-author">
        <span className="vt-testimonial-avatar">{testimonial.initials}</span>
        <span>
          {testimonial.name} <em>· {testimonial.detail}</em>
        </span>
      </div>
    </div>
  );
}

function GalleryItem({ src, index }) {
  const ref = useScrollReveal();
  return (
    <div ref={ref} className={`vt-gallery-item reveal reveal-delay-${(index % 3) + 1}`}>
      <img src={src} alt="Paciente da Vetta" loading="lazy" />
    </div>
  );
}

export default function Veterinaria() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [formSent, setFormSent] = useState(false);
  const heroRef = useScrollReveal();
  const heroImageRef = useScrollReveal();
  const statsRef = useScrollReveal();
  const aboutRef = useScrollReveal();
  const servicesHeaderRef = useScrollReveal();
  const teamHeaderRef = useScrollReveal();
  const galleryHeaderRef = useScrollReveal();
  const testimonialsHeaderRef = useScrollReveal();
  const contactRef = useScrollReveal();
  const formRef = useRef(null);

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

  function handleFormSubmit(e) {
    e.preventDefault();
    setFormSent(true);
    formRef.current?.reset();
    setTimeout(() => setFormSent(false), 5000);
  }

  return (
    <div className="vt-page">
      {/* Nav */}
      <nav className={`vt-nav ${scrolled ? "vt-nav-scrolled" : ""}`}>
        <div className="vt-nav-container">
          <Link to="/" className="vt-back-link">
            <HiArrowLeft /> <span>Portfólio</span>
          </Link>

          <a href="#inicio" className="vt-logo" onClick={(e) => handleNavClick(e, "#inicio")}>
            <FaPaw className="vt-logo-icon" />
            Vet<span className="vt-logo-accent">ta</span>
          </a>

          <ul className={`vt-nav-links ${menuOpen ? "vt-nav-links-open" : ""}`}>
            {navLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href} onClick={(e) => handleNavClick(e, link.href)}>
                  {link.label}
                </a>
              </li>
            ))}
            <li className="vt-nav-cta-mobile">
              <a href={WHATSAPP_URL} className="vt-cta-button" target="_blank" rel="noopener noreferrer">
                <FaWhatsapp /> Falar no WhatsApp
              </a>
            </li>
          </ul>

          <a href={WHATSAPP_URL} className="vt-cta-button vt-cta-desktop" target="_blank" rel="noopener noreferrer">
            <FaWhatsapp /> Falar no WhatsApp
          </a>

          <button className="vt-nav-toggle" onClick={() => setMenuOpen((v) => !v)} aria-label="Abrir menu">
            {menuOpen ? <HiX /> : <HiMenuAlt3 />}
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section id="inicio" className="vt-hero">
        <div className="vt-hero-content reveal" ref={heroRef}>
          <span className="vt-eyebrow">Clínica veterinária em Aveiro</span>
          <h1>
            Cuidado especializado para quem faz parte da tua <span className="vt-highlight">família</span>
          </h1>
          <p>Consultas, cirurgias, vacinação e emergências 24h — tudo com uma equipa que trata o teu animal com o mesmo carinho que tu.</p>
          <div className="vt-hero-actions">
            <a href={WHATSAPP_URL} className="vt-cta-button" target="_blank" rel="noopener noreferrer">
              <FaWhatsapp /> Agendar Consulta
            </a>
            <a href="#servicos" className="vt-secondary-button" onClick={(e) => handleNavClick(e, "#servicos")}>
              Ver Serviços
            </a>
          </div>
        </div>
        <div className="vt-hero-image reveal reveal-delay-2" ref={heroImageRef}>
          <img
            src="https://images.unsplash.com/photo-1544568100-847a948585b9?auto=format&fit=crop&w=900&q=80"
            alt="Cão feliz ao ar livre, paciente da Vetta"
          />
          <div className="vt-hero-badge">
            <FaTruckMedical />
            <div>
              <strong>Emergência 24h</strong>
              <span>Sempre disponíveis</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="vt-stats reveal" ref={statsRef}>
        {stats.map((stat) => (
          <div key={stat.label} className="vt-stat">
            <span className="vt-stat-value">{stat.value}</span>
            <span className="vt-stat-label">{stat.label}</span>
          </div>
        ))}
      </section>

      {/* Sobre */}
      <section id="sobre" className="vt-section vt-about">
        <div className="vt-about-image reveal" ref={aboutRef}>
          <img
            src="https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=800&q=80"
            alt="Cão a ser cuidado com carinho na Vetta"
          />
        </div>
        <div className="vt-about-content">
          <span className="vt-section-label">Sobre nós</span>
          <h2>Mais de uma década a cuidar de quatro patas em Aveiro</h2>
          <p>A Vetta nasceu com um objetivo simples: tirar o stress da ida ao veterinário — para o animal e para ti. Combinamos equipamento de diagnóstico moderno com uma equipa que trata cada paciente como se fosse seu.</p>
          <div className="vt-values">
            {values.map((value) => (
              <div key={value.title} className="vt-value">
                <div className="vt-value-icon">{value.icon}</div>
                <div>
                  <h3>{value.title}</h3>
                  <p>{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Serviços */}
      <section id="servicos" className="vt-section vt-services-section">
        <div className="vt-section-header reveal" ref={servicesHeaderRef}>
          <span className="vt-section-label">Serviços</span>
          <h2>Tudo o que o teu animal precisa, num só lugar</h2>
          <p>Da prevenção à emergência, cuidamos de cada etapa com a mesma atenção.</p>
        </div>
        <div className="vt-services-grid">
          {services.map((service, i) => (
            <ServiceCard key={service.title} service={service} index={i} />
          ))}
        </div>
      </section>

      {/* Equipa */}
      <section id="equipa" className="vt-section">
        <div className="vt-section-header reveal" ref={teamHeaderRef}>
          <span className="vt-section-label">A nossa equipa</span>
          <h2>Veterinários em quem podes confiar</h2>
          <p>Especialistas dedicados a cada área da saúde do teu animal.</p>
        </div>
        <div className="vt-team-grid">
          {team.map((member, i) => (
            <TeamCard key={member.name} member={member} index={i} />
          ))}
        </div>
      </section>

      {/* Galeria */}
      <section id="galeria" className="vt-section vt-gallery-section">
        <div className="vt-section-header reveal" ref={galleryHeaderRef}>
          <span className="vt-section-label">Galeria</span>
          <h2>Os nossos pacientes</h2>
          <p>Alguns dos focinhos que passam pela Vetta todas as semanas.</p>
        </div>
        <div className="vt-gallery-grid">
          {gallery.map((src, i) => (
            <GalleryItem key={src} src={src} index={i} />
          ))}
        </div>
      </section>

      {/* Depoimentos */}
      <section id="depoimentos" className="vt-section vt-testimonials-section">
        <div className="vt-section-header reveal" ref={testimonialsHeaderRef}>
          <span className="vt-section-label">Depoimentos</span>
          <h2>Quem já confiou os seus animais a nós</h2>
        </div>
        <div className="vt-testimonials-grid">
          {testimonials.map((t, i) => (
            <TestimonialCard key={t.name} testimonial={t} index={i} />
          ))}
        </div>
      </section>

      {/* Contacto */}
      <section id="contacto" className="vt-section vt-contact-section reveal" ref={contactRef}>
        <div className="vt-contact-grid">
          <div className="vt-contact-form-wrap">
            <span className="vt-section-label">Contacto</span>
            <h2>Marca a consulta do teu animal</h2>
            <p>Preenche o formulário e entraremos em contacto em menos de 24 horas. Para urgências, usa o WhatsApp.</p>

            <form ref={formRef} className="vt-contact-form" onSubmit={handleFormSubmit}>
              <div className="vt-form-row">
                <label>
                  Nome
                  <input type="text" name="nome" placeholder="O teu nome" required />
                </label>
                <label>
                  Nome do animal
                  <input type="text" name="animal" placeholder="Ex: Rex" required />
                </label>
              </div>
              <div className="vt-form-row">
                <label>
                  Email
                  <input type="email" name="email" placeholder="email@exemplo.com" required />
                </label>
                <label>
                  Telefone
                  <input type="tel" name="telefone" placeholder="+351 900 000 000" required />
                </label>
              </div>
              <label>
                Mensagem
                <textarea name="mensagem" rows={4} placeholder="Conta-nos o que precisas..." required />
              </label>

              <button type="submit" className="vt-cta-button vt-form-submit">
                {formSent ? (
                  <>
                    <HiCheckCircle /> Mensagem enviada!
                  </>
                ) : (
                  "Enviar mensagem"
                )}
              </button>
              <p className="vt-form-disclaimer">Formulário de demonstração — não envia dados reais.</p>
            </form>
          </div>

          <div className="vt-contact-info">
            <div className="vt-info-card">
              <div className="vt-info-icon">
                <HiOutlineLocationMarker />
              </div>
              <div>
                <h3>Morada</h3>
                <p>Rua das Amoreiras 48, Aveiro, Portugal</p>
              </div>
            </div>
            <div className="vt-info-card">
              <div className="vt-info-icon">
                <HiOutlinePhone />
              </div>
              <div>
                <h3>Telefone</h3>
                <p>+351 234 110 220</p>
              </div>
            </div>
            <div className="vt-info-card">
              <div className="vt-info-icon">
                <HiOutlineMail />
              </div>
              <div>
                <h3>Email</h3>
                <p>ola@vetta.pt</p>
              </div>
            </div>
            <div className="vt-info-card">
              <div className="vt-info-icon">
                <HiOutlineClock />
              </div>
              <div>
                <h3>Horário</h3>
                <p>Seg-Sex: 9h-20h · Sáb: 9h-13h</p>
                <p className="vt-info-alert">Emergências: 24 horas por dia</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="vt-footer">
        <div className="vt-footer-content">
          <div className="vt-footer-brand">
            <a href="#inicio" className="vt-logo" onClick={(e) => handleNavClick(e, "#inicio")}>
              <FaPaw className="vt-logo-icon" />
              Vet<span className="vt-logo-accent">ta</span>
            </a>
            <p>Cuidado veterinário moderno, humano e sempre por perto.</p>
          </div>
          <div className="vt-footer-links">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} onClick={(e) => handleNavClick(e, link.href)}>
                {link.label}
              </a>
            ))}
          </div>
          <div className="vt-footer-socials">
            <a href="#" aria-label="Facebook">
              <FaFacebookF />
            </a>
            <a href="#" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
              <FaWhatsapp />
            </a>
          </div>
        </div>
        <div className="vt-footer-bottom">
          <p>© 2026 Vetta. Todos os direitos reservados.</p>
          <p className="vt-footer-note">Protótipo de portfólio — parte do site Código e Café.</p>
        </div>
      </footer>

      {/* Botão flutuante de WhatsApp — presente em qualquer ponto do scroll,
          além do CTA no menu (padrão comum em sites de clínicas/serviços). */}
      <a
        href={WHATSAPP_URL}
        className="vt-whatsapp-float"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Falar connosco no WhatsApp"
      >
        <FaWhatsapp />
      </a>
    </div>
  );
}
