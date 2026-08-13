// src/pages/projects/FazTudo/FazTudoHome.jsx
// Página única do projeto: hero, serviços (seleção + orçamento via
// WhatsApp), área de atendimento e depoimentos (carrossel).

import { useState } from 'react';
import ServiceAreaMap from './ServiceAreaMap';
import TestimonialsCarousel from './TestimonialsCarousel';
import { SERVICES } from './servicesData';
import { SERVICE_AREA_CENTER, SERVICE_AREA_LABEL, SERVICE_AREA_RADIUS_KM } from './constants';
import { buildQuoteMessage, buildWhatsappUrl } from './whatsapp';

export default function FazTudoHome() {
  const [selectedIds, setSelectedIds] = useState(() => new Set());

  function toggleService(id) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  const selectedNames = SERVICES.filter((service) => selectedIds.has(service.id)).map((service) =>
    service.name.toLowerCase()
  );
  const hasSelection = selectedNames.length > 0;
  const whatsappHref = hasSelection ? buildWhatsappUrl(buildQuoteMessage(selectedNames)) : undefined;

  return (
    <>
      <section
        id="inicio"
        className="ft-hero section"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(20,16,13,0.4) 0%, rgba(20,16,13,0.95) 100%), url('https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=1400&q=75')",
        }}
      >
        <div className="container">
          <span className="ft-hero-label">Faz Tudo</span>
          <h1 className="ft-hero-title">Reparos e manutenção residencial, sem complicação</h1>
          <p className="ft-hero-subtitle">
            Torneiras, pintura, móveis, elétrica e muito mais — escolha os serviços que precisa e
            receba um orçamento rápido pelo WhatsApp.
          </p>
          <div className="ft-hero-actions">
            <a href="#servicos" className="ft-hero-cta">
              Faça um orçamento
            </a>
            <a href="#servicos" className="ft-hero-cta ft-hero-cta-outline">
              Nossos serviços
            </a>
          </div>
        </div>
      </section>

      <section id="servicos" className="ft-services section">
        <div className="container">
          <h2 className="ft-section-title">Nossos serviços</h2>
          <p className="ft-section-subtitle">
            Selecione os serviços que precisa e receba um orçamento rápido pelo WhatsApp.
          </p>

          <div className="ft-services-grid" role="group" aria-label="Serviços disponíveis">
            {SERVICES.map((service) => {
              const isSelected = selectedIds.has(service.id);
              const Icon = service.icon;
              return (
                <button
                  key={service.id}
                  type="button"
                  className={`ft-service-card${isSelected ? ' ft-service-card-selected' : ''}`}
                  aria-pressed={isSelected}
                  onClick={() => toggleService(service.id)}
                >
                  <Icon className="ft-service-card-icon" aria-hidden="true" />
                  <span>{service.name}</span>
                </button>
              );
            })}
          </div>

          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className={`ft-orcamento-submit${hasSelection ? '' : ' ft-orcamento-submit-disabled'}`}
            aria-disabled={!hasSelection}
            onClick={(event) => {
              if (!hasSelection) event.preventDefault();
            }}
          >
            Pedir orçamento{hasSelection ? ` (${selectedNames.length})` : ''}
          </a>
        </div>
      </section>

      <section id="atendimento" className="ft-area section">
        <div className="container">
          <h2 className="ft-section-title">Área de atendimento</h2>
          <p className="ft-area-text">
            Atendemos num raio de {SERVICE_AREA_RADIUS_KM}km a partir de {SERVICE_AREA_LABEL}. Fora
            dessa área, fale connosco pelo WhatsApp para confirmar disponibilidade.
          </p>
          <ServiceAreaMap
            center={SERVICE_AREA_CENTER}
            radiusKm={SERVICE_AREA_RADIUS_KM}
            label={SERVICE_AREA_LABEL}
          />
        </div>
      </section>

      <section id="depoimentos" className="ft-testimonials section">
        <div className="container">
          <h2 className="ft-section-title">O que dizem os clientes</h2>
          <TestimonialsCarousel />
        </div>
      </section>
    </>
  );
}
