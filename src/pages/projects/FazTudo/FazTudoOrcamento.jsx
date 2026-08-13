// src/pages/projects/FazTudo/FazTudoOrcamento.jsx
// Calculadora de orçamento: seleção de serviços (sem preço, só a lista) que
// monta a mensagem e abre o WhatsApp. Estado local (Set de ids) — sem
// persistência, sem backend.

import { useState } from 'react';
import { SERVICES } from './servicesData';
import { buildQuoteMessage, buildWhatsappUrl } from './whatsapp';

export default function FazTudoOrcamento() {
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
    <section className="ft-orcamento section">
      <div className="container">
        <h1 className="ft-orcamento-title">Monte o seu orçamento</h1>
        <p className="ft-orcamento-subtitle">
          Selecione os serviços que precisa e receba um orçamento rápido pelo WhatsApp.
        </p>

        <div className="ft-services-grid" role="group" aria-label="Serviços disponíveis">
          {SERVICES.map((service) => {
            const isSelected = selectedIds.has(service.id);
            return (
              <button
                key={service.id}
                type="button"
                className={`ft-service-card${isSelected ? ' ft-service-card-selected' : ''}`}
                aria-pressed={isSelected}
                onClick={() => toggleService(service.id)}
              >
                {service.name}
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
          Pedir orçamento no WhatsApp{hasSelection ? ` (${selectedNames.length})` : ''}
        </a>
      </div>
    </section>
  );
}
