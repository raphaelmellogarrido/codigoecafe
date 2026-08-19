// src/pages/projects/BragaRemodelacao/BragaRemodelacaoHome.jsx
// Monta todas as secções da página única, em ordem: hero, números, sobre
// (Task 4), serviços (Task 6), projetos (Task 7), antes/depois (Task 8),
// porquê-escolher-nos + processo (Task 9), depoimentos + CTA (Task 10) e o
// formulário de orçamento (Task 5).

import { useState } from 'react';
import { BUSINESS_NAME } from './constants';
import { STATS } from './statsData';
import { SERVICES } from './servicesData';
import { PROJECTS } from './projectsData';
import QuoteForm from './QuoteForm';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1600&q=75';
const ABOUT_MAIN_IMAGE =
  'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=900&q=75';
const ABOUT_INSET_IMAGE =
  'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?auto=format&fit=crop&w=500&q=75';

export default function BragaRemodelacaoHome() {
  const [selectedServiceId, setSelectedServiceId] = useState(null);

  function handleSelectService(serviceId) {
    setSelectedServiceId(serviceId);
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
            <a href="#orcamento" className="brm-btn brm-btn-primary">
              Pedir Orçamento Gratuito
            </a>
            <a href="#projetos" className="brm-btn brm-btn-outline">
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
            <a href="#servicos" className="brm-btn brm-btn-primary">
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

      <QuoteForm preselectedType={selectedServiceId} />
    </>
  );
}
