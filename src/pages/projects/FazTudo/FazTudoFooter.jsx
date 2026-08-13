// src/pages/projects/FazTudo/FazTudoFooter.jsx

import { BUSINESS_NAME, SERVICE_AREA_LABEL, SERVICE_AREA_RADIUS_KM } from './constants';

export default function FazTudoFooter() {
  return (
    <footer className="ft-footer">
      <div className="ft-footer-content">
        <span className="ft-footer-brand">{BUSINESS_NAME}</span>
        <p className="ft-footer-text">
          Atendemos num raio de {SERVICE_AREA_RADIUS_KM}km a partir de {SERVICE_AREA_LABEL}.
        </p>
        <p className="ft-footer-text">WhatsApp: +351 913 247 176</p>
      </div>
    </footer>
  );
}
