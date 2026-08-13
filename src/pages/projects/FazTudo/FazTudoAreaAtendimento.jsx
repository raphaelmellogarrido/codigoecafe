// src/pages/projects/FazTudo/FazTudoAreaAtendimento.jsx

import ServiceAreaMap from './ServiceAreaMap';
import { SERVICE_AREA_CENTER, SERVICE_AREA_LABEL, SERVICE_AREA_RADIUS_KM } from './constants';

export default function FazTudoAreaAtendimento() {
  return (
    <section className="ft-area section">
      <div className="container">
        <h1 className="ft-section-title">Área de atendimento</h1>
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
  );
}
