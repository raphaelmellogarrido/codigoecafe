// src/pages/projects/Achadinhos/AchadinhosFooter.jsx
import { FaWhatsapp } from "react-icons/fa";
import { WHATSAPP_URL } from "./constants";

export default function AchadinhosFooter() {
  return (
    <footer className="ach-footer-pro">
      <div className="ach-footer-cta">
        <h2>Não encontrou o que procurava?</h2>
        <p>Me chama no WhatsApp que eu te ajudo a encontrar o achadinho certo.</p>
        <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="ach-btn-whatsapp">
          <FaWhatsapp /> Fale comigo agora
        </a>
      </div>
      <p className="ach-footer-note">
        Catálogo de demonstração — parte do portfólio <a href="http://www.codigoecafe.com">Código e Café</a>.
      </p>
    </footer>
  );
}
