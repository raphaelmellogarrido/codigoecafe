// src/pages/projects/BragaRemodelacao/BragaRemodelacaoHome.jsx
// Monta todas as secções da página única, em ordem: hero, números, sobre
// (Task 4), serviços (Task 6), projetos (Task 7), antes/depois (Task 8),
// porquê-escolher-nos + processo (Task 9), depoimentos + CTA (Task 10) e o
// formulário de orçamento (Task 5).

import { useState } from 'react';
import { FaCalendarCheck, FaFileInvoiceDollar, FaUserTie, FaUsersGear, FaRegStar, FaStar } from 'react-icons/fa6';
import { BUSINESS_NAME } from './constants';
import { STATS } from './statsData';
import { SERVICES } from './servicesData';
import { PROJECTS } from './projectsData';
import BeforeAfterSlider from './BeforeAfterSlider';
import { BEFORE_AFTER_SETS } from './beforeAfterData';
import { WHY_CHOOSE_US } from './whyChooseUsData';
import { PROCESS_STEPS } from './processData';
import { TESTIMONIALS } from './testimonialsData';
import QuoteForm from './QuoteForm';
import { scrollToSection } from './scrollToSection';

const WHY_ICON_MAP = {
  FaFileInvoiceDollar,
  FaUserTie,
  FaCalendarCheck,
  FaUsersGear,
};

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1600&q=75';
const ABOUT_MAIN_IMAGE =
  'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=900&q=75';
const ABOUT_INSET_IMAGE =
  'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?auto=format&fit=crop&w=500&q=75';
const CTA_IMAGE =
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=75';

export default function BragaRemodelacaoHome() {
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [selectionKey, setSelectionKey] = useState(0);

  function handleSelectService(serviceId) {
    setSelectedServiceId(serviceId);
    setSelectionKey((key) => key + 1);
    document.getElementById('orcamento')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <>
      <section
        id="inicio"
        className="brm-hero section"
        style={{
          backgroundImage:
            `linear-gradient(90deg, rgba(22,21,19,0.35) 0%, rgba(22,21,19,0.65) 55%, rgba(22,21,19,0.92) 100%), url('${HERO_IMAGE}')`,
        }}
      >
        <div className="container brm-hero-inner">
          <span className="brm-eyebrow">BragaRenova</span>
          <h1 className="brm-hero-title">
            A sua casa merece
            <br />
            uma nova história.
          </h1>
          <p className="brm-hero-subtitle">
            Transformamos casas e apartamentos em espaços modernos, funcionais e pensados para o
            seu dia a dia. Remodelações em Braga e arredores.
          </p>
          <div className="brm-hero-actions">
            <a
              href="#orcamento"
              className="brm-btn brm-btn-primary"
              onClick={(event) => scrollToSection(event, 'orcamento')}
            >
              Pedir Orçamento Gratuito
            </a>
            <a
              href="#projetos"
              className="brm-btn brm-btn-outline"
              onClick={(event) => scrollToSection(event, 'projetos')}
            >
              Ver Projetos
            </a>
          </div>
        </div>
      </section>

      <section id="numeros" className="brm-stats section">
        <div className="container brm-stats-grid">
          {STATS.map((stat) => (
            <div key={stat.id} className="brm-stat">
              <span className="brm-stat-value">{stat.value}</span>
              <span className="brm-stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section id="sobre" className="brm-about section">
        <div className="container brm-about-grid">
          <div className="brm-about-media">
            <img
              src={ABOUT_MAIN_IMAGE}
              alt="Interior de apartamento remodelado, luminoso e moderno"
              className="brm-about-image-main"
              loading="lazy"
            />
            <img
              src={ABOUT_INSET_IMAGE}
              alt="Mãos a desenhar uma planta de remodelação"
              className="brm-about-image-inset"
              loading="lazy"
            />
          </div>
          <div className="brm-about-content">
            <span className="brm-eyebrow">Sobre a {BUSINESS_NAME}</span>
            <h2 className="brm-section-title">Remodelamos espaços. Melhoramos a forma como vive.</h2>
            <p className="brm-about-text">
              Acompanhamos o seu projeto do planeamento à execução — um único ponto de contacto,
              do primeiro esboço à limpeza final da obra.
            </p>
            <ul className="brm-about-list">
              <li>Orçamento claro, sem custos escondidos</li>
              <li>Equipa própria, sem subcontratação às cegas</li>
            </ul>
            <a
              href="#servicos"
              className="brm-btn brm-btn-primary"
              onClick={(event) => scrollToSection(event, 'servicos')}
            >
              Conhecer os Serviços
            </a>
          </div>
        </div>
      </section>

      <section id="servicos" className="brm-services section">
        <div className="container">
          <span className="brm-eyebrow">O que fazemos</span>
          <h2 className="brm-section-title">Os nossos serviços de remodelação</h2>
          <p className="brm-section-subtitle">
            Da primeira ideia ao último acabamento — escolha o serviço que precisa e peça já o seu
            orçamento.
          </p>
          <div className="brm-services-grid">
            {SERVICES.map((service) => (
              <article key={service.id} className="brm-card brm-service-card">
                <img src={service.image} alt={service.title} className="brm-service-image" loading="lazy" />
                <div className="brm-service-body">
                  <h3 className="brm-service-title">{service.title}</h3>
                  <p className="brm-service-description">{service.description}</p>
                  <button
                    type="button"
                    className="brm-service-link"
                    aria-label={`Saber mais sobre ${service.title}`}
                    onClick={() => handleSelectService(service.id)}
                  >
                    Saber mais →
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="projetos" className="brm-projects section">
        <div className="container">
          <span className="brm-eyebrow">Portfólio</span>
          <h2 className="brm-section-title">Projetos recentes</h2>
          <p className="brm-section-subtitle">
            Alguns exemplos do tipo de trabalho que fazemos em Braga e arredores.
          </p>
          <div className="brm-projects-grid">
            {PROJECTS.map((project) => (
              <figure key={project.id} className="brm-project-card">
                <img src={project.image} alt={`${project.title} — ${project.location}`} loading="lazy" />
                <figcaption className="brm-project-overlay">
                  <span className="brm-project-type">{project.type}</span>
                  <span className="brm-project-title">{project.title}</span>
                  <span className="brm-project-location">{project.location}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section id="antes-depois" className="brm-before-after section">
        <div className="container">
          <span className="brm-eyebrow">Transformações</span>
          <h2 className="brm-section-title">Veja a transformação</h2>
          <p className="brm-section-subtitle">
            Cada espaço tem potencial. Veja como transformamos ambientes antigos em espaços
            modernos e funcionais.
          </p>
          <div className="brm-ba-grid">
            {BEFORE_AFTER_SETS.map((set) => (
              <div key={set.id}>
                <BeforeAfterSlider beforeImage={set.before} afterImage={set.after} />
                <p className="brm-ba-title">{set.title}</p>
              </div>
            ))}
          </div>
          <p className="brm-ba-disclaimer">Imagens ilustrativas.</p>
        </div>
      </section>

      <section id="porque-escolher" className="brm-why section">
        <div className="container">
          <span className="brm-eyebrow">Porquê escolher-nos</span>
          <h2 className="brm-section-title">O que nos diferencia</h2>
          <div className="brm-why-grid">
            {WHY_CHOOSE_US.map((item) => {
              const Icon = WHY_ICON_MAP[item.icon] ?? FaFileInvoiceDollar;
              return (
                <div key={item.id} className="brm-card brm-why-card">
                  <Icon className="brm-why-icon" aria-hidden="true" />
                  <h3 className="brm-why-title">{item.title}</h3>
                  <p className="brm-why-description">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="processo" className="brm-process section">
        <div className="container">
          <span className="brm-eyebrow">Como trabalhamos</span>
          <h2 className="brm-section-title">O nosso processo</h2>
          <div className="brm-process-grid">
            {PROCESS_STEPS.map((step) => (
              <div key={step.number} className="brm-process-step">
                <span className="brm-process-number">{step.number}</span>
                <h3 className="brm-process-title">{step.title}</h3>
                <p className="brm-process-description">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="depoimentos" className="brm-testimonials section">
        <div className="container">
          <span className="brm-eyebrow">Depoimentos</span>
          <h2 className="brm-section-title">O que dizem os nossos clientes</h2>
          <div className="brm-testimonials-grid">
            {TESTIMONIALS.map((testimonial) => (
              <div key={testimonial.id} className="brm-card brm-testimonial-card">
                <div className="brm-testimonial-rating" aria-label={`Avaliação: ${testimonial.rating} de 5`}>
                  {[1, 2, 3, 4, 5].map((value) =>
                    value <= testimonial.rating ? <FaStar key={value} /> : <FaRegStar key={value} />
                  )}
                </div>
                <p className="brm-testimonial-text">&ldquo;{testimonial.text}&rdquo;</p>
                <p className="brm-testimonial-name">{testimonial.name}</p>
                <span className="brm-testimonial-project">{testimonial.projectType}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        className="brm-cta section"
        style={{
          backgroundImage:
            `linear-gradient(180deg, rgba(22,21,19,0.55) 0%, rgba(22,21,19,0.88) 100%), url('${CTA_IMAGE}')`,
        }}
      >
        <div className="container brm-cta-inner">
          <h2 className="brm-cta-title">Está a pensar remodelar a sua casa?</h2>
          <p className="brm-cta-subtitle">Conte-nos o seu projeto e receba um orçamento sem compromisso.</p>
          <a
            href="#orcamento"
            className="brm-btn brm-btn-primary"
            onClick={(event) => scrollToSection(event, 'orcamento')}
          >
            Pedir Orçamento
          </a>
        </div>
      </section>

      <QuoteForm preselectedType={selectedServiceId} selectionKey={selectionKey} />
    </>
  );
}
