// src/pages/projects/JulimarDental/JulimarDentalFooter.jsx
// Rodapé: marca, contacto e nota "em reforma" (texto genérico, sem mês
// fixo — decisão confirmada com o utilizador na spec).

import { WHATSAPP_NUMBER_DISPLAY } from './constants.js';

export default function JulimarDentalFooter() {
  return (
    <footer className="jd-footer">
      <div className="jd-footer-content">
        <span className="jd-footer-brand">JULIMAR DENTAL</span>
        <p>Catálogo de materiais odontológicos — orçamento direto pelo WhatsApp.</p>
        <p className="jd-footer-phone">{WHATSAPP_NUMBER_DISPLAY}</p>
      </div>
      <div className="jd-footer-bottom">
        <p>© 2026 Julimar Dental — Em reforma, reabertura em breve.</p>
      </div>
    </footer>
  );
}
