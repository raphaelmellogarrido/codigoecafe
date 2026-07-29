// src/pages/projects/ClinicaDentista/ClinicaDentista.jsx
// Projeto de portfólio: landing page moderna para clínica odontológica,
// pensada para ser enviada a clientes reais (dentistas locais).
// Stack: React + CSS puro + IntersectionObserver (useScrollReveal, já usado no site principal).

import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { HiArrowLeft, HiMenuAlt3, HiX, HiOutlineLocationMarker, HiOutlinePhone, HiOutlineClock, HiOutlineMail, HiCheckCircle } from "react-icons/hi";
import { FaTooth, FaTeethOpen, FaTeeth, FaShieldHalved, FaChild, FaStar, FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa6";
import useScrollReveal from "../../../hooks/useScrollReveal";
import "./ClinicaDentista.css";

const navLinks = [
  { href: "#inicio", label: "Início" },
  { href: "#sobre", label: "Sobre" },
  { href: "#equipe", label: "Equipe" },
  { href: "#servicos", label: "Serviços" },
  { href: "#contato", label: "Contato" },
];

const WHATSAPP_URL = "https://wa.me/+351913247176";

const stats = [
  { value: "15+", label: "Anos de experiência" },
  { value: "8 mil+", label: "Pacientes atendidos" },
  { value: "4.9", label: "Avaliação média" },
  { value: "100%", label: "Biossegurança certificada" },
];

const values = [
  {
    icon: <HiCheckCircle />,
    title: "Atendimento humanizado",
    description: "Cada paciente é ouvido com calma — sem pressa, sem julgamentos.",
  },
  {
    icon: <FaShieldHalved />,
    title: "Segurança em primeiro lugar",
    description: "Protocolos rígidos de esterilização e materiais certificados.",
  },
  {
    icon: <FaStar />,
    title: "Tecnologia de ponta",
    description: "Equipamentos modernos para diagnósticos precisos e tratamentos confortáveis.",
  },
];

const team = [
  {
    name: "Dra. Camila Duarte",
    role: "Clínica Geral & Estética Dental",
    image: "https://images.unsplash.com/photo-1659353888906-adb3e0041693?auto=format&fit=crop&w=500&q=75",
  },
  {
    name: "Dr. Ricardo Almeida",
    role: "Ortodontia & Implantes",
    image: "https://images.unsplash.com/photo-1645066928295-2506defde470?auto=format&fit=crop&w=500&q=75",
  },
  {
    name: "Dra. Beatriz Nogueira",
    role: "Odontopediatria",
    image: "https://images.unsplash.com/photo-1673865641073-4479f93a7776?auto=format&fit=crop&w=500&q=75",
  },
];

const services = [
  {
    icon: <FaTooth />,
    title: "Clareamento Dental",
    description: "Sorriso mais branco e uniforme, com técnicas seguras para o esmalte.",
  },
  {
    icon: <FaTeethOpen />,
    title: "Ortodontia",
    description: "Aparelhos tradicionais e alinhadores transparentes para todas as idades.",
  },
  {
    icon: <FaTeeth />,
    title: "Implantes Dentários",
    description: "Recupera a função e a estética com implantes de alta durabilidade.",
  },
  {
    icon: <FaShieldHalved />,
    title: "Limpeza e Prevenção",
    description: "Check-ups regulares para travar problemas antes que se agravem.",
  },
  {
    icon: <FaChild />,
    title: "Odontopediatria",
    description: "Consultas pensadas para deixar as crianças à vontade desde a primeira visita.",
  },
  {
    icon: <FaStar />,
    title: "Estética Dental",
    description: "Lentes de contato dental e facetas para o sorriso que sempre quiseste.",
  },
];

const testimonials = [
  {
    text: "Tinha muito medo de dentista e a equipa foi incrivelmente paciente comigo. Hoje nem lembro que tinha receio.",
    name: "Sofia Martins",
    initials: "SM",
  },
  {
    text: "Fiz o clareamento e o resultado superou o que esperava. Atendimento profissional do início ao fim.",
    name: "Miguel Costa",
    initials: "MC",
  },
  {
    text: "Levo os meus filhos há 2 anos e eles adoram vir à consulta — isso já diz tudo sobre a Dra. Beatriz.",
    name: "Inês Rodrigues",
    initials: "IR",
  },
];

function TeamCard({ member, index }) {
  const ref = useScrollReveal();
  return (
    <div ref={ref} className={`dc-team-card reveal reveal-delay-${index + 1}`}>
      <div className="dc-team-photo">
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
    <div ref={ref} className={`dc-service-card reveal reveal-delay-${(index % 3) + 1}`}>
      <div className="dc-service-icon">{service.icon}</div>
      <h3>{service.title}</h3>
      <p>{service.description}</p>
    </div>
  );
}

function TestimonialCard({ testimonial, index }) {
  const ref = useScrollReveal();
  return (
    <div ref={ref} className={`dc-testimonial-card reveal reveal-delay-${index + 1}`}>
      <p>&ldquo;{testimonial.text}&rdquo;</p>
      <div className="dc-testimonial-author">
        <span className="dc-testimonial-avatar">{testimonial.initials}</span>
        <span>{testimonial.name}</span>
      </div>
    </div>
  );
}

export default function ClinicaDentista() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [formSent, setFormSent] = useState(false);
  const heroRef = useScrollReveal();
  const heroImageRef = useScrollReveal();
  const statsRef = useScrollReveal();
  const aboutRef = useScrollReveal();
  const teamHeaderRef = useScrollReveal();
  const servicesHeaderRef = useScrollReveal();
  const testimonialsHeaderRef = useScrollReveal();
  const contactRef = useScrollReveal();
  const formRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
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
    <div className="dc-page">
      {/* Nav */}
      <nav className={`dc-nav ${scrolled ? "dc-nav-scrolled" : ""}`}>
        <div className="dc-nav-container">
          <Link to="/" className="dc-back-link">
            <HiArrowLeft /> <span>Portfólio</span>
          </Link>

          <a href="#inicio" className="dc-logo" onClick={(e) => handleNavClick(e, "#inicio")}>
            <FaTooth className="dc-logo-icon" />
            Dental<span className="dc-logo-accent">Care</span>
          </a>

          <ul className={`dc-nav-links ${menuOpen ? "dc-nav-links-open" : ""}`}>
            {navLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href} onClick={(e) => handleNavClick(e, link.href)}>
                  {link.label}
                </a>
              </li>
            ))}
            <li className="dc-nav-cta-mobile">
              <a href={WHATSAPP_URL} className="dc-cta-button" target="_blank" rel="noopener noreferrer">
                Marcar Consulta
              </a>
            </li>
          </ul>

          <a href={WHATSAPP_URL} className="dc-cta-button dc-cta-desktop" target="_blank" rel="noopener noreferrer">
            Marcar Consulta
          </a>

          <button className="dc-nav-toggle" onClick={() => setMenuOpen((v) => !v)} aria-label="Abrir menu">
            {menuOpen ? <HiX /> : <HiMenuAlt3 />}
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section id="inicio" className="dc-hero">
        <div className="dc-hero-content reveal" ref={heroRef}>
          <span className="dc-eyebrow">Odontologia moderna em Aveiro</span>
          <h1>
            O cuidado que o teu <span className="dc-highlight">sorriso</span> merece
          </h1>
          <p>Tratamentos completos com tecnologia de ponta, numa clínica pensada para o teu conforto do primeiro ao último minuto.</p>
          <div className="dc-hero-actions">
            <a href={WHATSAPP_URL} className="dc-cta-button" target="_blank" rel="noopener noreferrer">
              Marcar Consulta
            </a>
            <a href="#servicos" className="dc-secondary-button" onClick={(e) => handleNavClick(e, "#servicos")}>
              Ver Serviços
            </a>
          </div>
        </div>
        <div className="dc-hero-image reveal reveal-delay-2" ref={heroImageRef}>
          <img src="https://images.unsplash.com/photo-1662837625421-5fd8ed6131a0?auto=format&fit=crop&w=900&q=80" alt="Dentista a examinar um paciente sorridente" />
        </div>
      </section>

      {/* Stats */}
      <section className="dc-stats reveal" ref={statsRef}>
        {stats.map((stat) => (
          <div key={stat.label} className="dc-stat">
            <span className="dc-stat-value">{stat.value}</span>
            <span className="dc-stat-label">{stat.label}</span>
          </div>
        ))}
      </section>

      {/* Sobre */}
      <section id="sobre" className="dc-section dc-about">
        <div className="dc-about-image reveal" ref={aboutRef}>
          <img src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80" alt="Interior moderno da clínica DentalCare" />
        </div>
        <div className="dc-about-content">
          <span className="dc-section-label">Sobre nós</span>
          <h2>Mais de uma década a cuidar de sorrisos em Aveiro</h2>
          <p>A DentalCare nasceu com um objetivo simples: tirar o medo da cadeira do dentista. Combinamos equipamento de última geração com uma equipa que trata cada pessoa pelo nome — não pelo número da ficha.</p>
          <div className="dc-values">
            {values.map((value) => (
              <div key={value.title} className="dc-value">
                <div className="dc-value-icon">{value.icon}</div>
                <div>
                  <h3>{value.title}</h3>
                  <p>{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Equipe */}
      <section id="equipe" className="dc-section">
        <div className="dc-section-header reveal" ref={teamHeaderRef}>
          <span className="dc-section-label">A nossa equipe</span>
          <h2>Profissionais em quem podes confiar</h2>
          <p>Especialistas dedicados a cada área da tua saúde oral.</p>
        </div>
        <div className="dc-team-grid">
          {team.map((member, i) => (
            <TeamCard key={member.name} member={member} index={i} />
          ))}
        </div>
      </section>

      {/* Serviços */}
      <section id="servicos" className="dc-section dc-services-section">
        <div className="dc-section-header reveal" ref={servicesHeaderRef}>
          <span className="dc-section-label">Serviços</span>
          <h2>Tudo o que o teu sorriso precisa, num só lugar</h2>
          <p>Da prevenção à estética, cuidamos de cada etapa com a mesma atenção.</p>
        </div>
        <div className="dc-services-grid">
          {services.map((service, i) => (
            <ServiceCard key={service.title} service={service} index={i} />
          ))}
        </div>
      </section>

      {/* Testemunhos */}
      <section className="dc-section dc-testimonials-section">
        <div className="dc-section-header reveal" ref={testimonialsHeaderRef}>
          <span className="dc-section-label">Testemunhos</span>
          <h2>Quem já passou por aqui</h2>
        </div>
        <div className="dc-testimonials-grid">
          {testimonials.map((t, i) => (
            <TestimonialCard key={t.name} testimonial={t} index={i} />
          ))}
        </div>
      </section>

      {/* Contacto */}
      <section id="contato" className="dc-section dc-contact-section reveal" ref={contactRef}>
        <div className="dc-contact-grid">
          <div className="dc-contact-form-wrap">
            <span className="dc-section-label">Contacto</span>
            <h2>Marca a tua consulta</h2>
            <p>Preenche o formulário e entraremos em contacto em menos de 24 horas.</p>

            <form ref={formRef} className="dc-contact-form" onSubmit={handleFormSubmit}>
              <div className="dc-form-row">
                <label>
                  Nome
                  <input type="text" name="nome" placeholder="O teu nome" required />
                </label>
                <label>
                  Email
                  <input type="email" name="email" placeholder="email@exemplo.com" required />
                </label>
              </div>
              <div className="dc-form-row">
                <label>
                  Telefone
                  <input type="tel" name="telefone" placeholder="+351 900 000 000" required />
                </label>
              </div>
              <label>
                Mensagem
                <textarea name="mensagem" rows={4} placeholder="Conta-nos o que precisas..." required />
              </label>

              <button type="submit" className="dc-cta-button dc-form-submit">
                {formSent ? (
                  <>
                    <HiCheckCircle /> Mensagem enviada!
                  </>
                ) : (
                  "Enviar mensagem"
                )}
              </button>
              <p className="dc-form-disclaimer">Formulário de demonstração — não envia dados reais.</p>
            </form>
          </div>

          <div className="dc-contact-info">
            <div className="dc-info-card">
              <div className="dc-info-icon">
                <HiOutlineLocationMarker />
              </div>
              <div>
                <h3>Morada</h3>
                <p>Av. Central 123, Aveiro, Portugal</p>
              </div>
            </div>
            <div className="dc-info-card">
              <div className="dc-info-icon">
                <HiOutlinePhone />
              </div>
              <div>
                <h3>Telefone</h3>
                <p>+351 234 567 890</p>
              </div>
            </div>
            <div className="dc-info-card">
              <div className="dc-info-icon">
                <HiOutlineMail />
              </div>
              <div>
                <h3>Email</h3>
                <p>ola@dentalcare.pt</p>
              </div>
            </div>
            <div className="dc-info-card">
              <div className="dc-info-icon">
                <HiOutlineClock />
              </div>
              <div>
                <h3>Horário</h3>
                <p>Seg-Sex: 9h-19h · Sáb: 9h-13h</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="dc-footer">
        <div className="dc-footer-content">
          <div className="dc-footer-brand">
            <a href="#inicio" className="dc-logo" onClick={(e) => handleNavClick(e, "#inicio")}>
              <FaTooth className="dc-logo-icon" />
              Dental<span className="dc-logo-accent">Care</span>
            </a>
            <p>Cuidado odontológico moderno, humano e acessível.</p>
          </div>
          <div className="dc-footer-links">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} onClick={(e) => handleNavClick(e, link.href)}>
                {link.label}
              </a>
            ))}
          </div>
          <div className="dc-footer-socials">
            <a href="#" aria-label="Facebook">
              <FaFacebookF />
            </a>
            <a href="#" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href="#" aria-label="WhatsApp">
              <FaWhatsapp />
            </a>
          </div>
        </div>
        <div className="dc-footer-bottom">
          <p>© 2026 DentalCare. Todos os direitos reservados.</p>
          <p className="dc-footer-note">Protótipo de portfólio — parte do site Código e Café.</p>
        </div>
      </footer>
    </div>
  );
}
