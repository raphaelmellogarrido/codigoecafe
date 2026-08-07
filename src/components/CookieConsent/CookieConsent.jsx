// src/components/CookieConsent/CookieConsent.jsx
// Aviso de cookies (informativo, não bloqueante): o site já usa o Meta
// Pixel para todos os visitantes; este banner só avisa sobre isso e linka
// para a Política de Privacidade, guardando no localStorage que o
// visitante já viu para não aparecer de novo.

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaCookieBite } from "react-icons/fa";
import "./CookieConsent.css";

const STORAGE_KEY = "cookieNoticeSeen";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setVisible(true);
    }
  }, []);

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, "1");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="cookie-consent" role="dialog" aria-label="Aviso de cookies">
      <div className="cookie-consent-content">
        <FaCookieBite className="cookie-consent-icon" aria-hidden="true" />
        <p>
          Usamos cookies e o Meta Pixel para melhorar a tua experiência e medir o desempenho das nossas campanhas.
          Ao continuar a navegar, aceitas isto. Consulta a nossa{" "}
          <Link to="/politica-de-privacidade" onClick={dismiss}>
            Política de Privacidade
          </Link>{" "}
          para saber mais.
        </p>
      </div>
      <button type="button" className="cookie-consent-btn" onClick={dismiss}>
        Entendi
      </button>
    </div>
  );
}
