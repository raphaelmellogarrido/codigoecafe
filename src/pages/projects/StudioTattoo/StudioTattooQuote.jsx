// src/pages/projects/StudioTattoo/StudioTattooQuote.jsx
// Seção "Orçamento": 3 dropdowns (zona do corpo, tamanho aproximado, estilo)
// + botão que monta a mensagem e abre o WhatsApp já preenchido.

import { useMemo, useState } from 'react';
import { FaLocationDot, FaPalette, FaRulerCombined, FaWhatsapp } from 'react-icons/fa6';
import { BODY_ZONES } from './bodyZonesData';
import { SIZE_OPTIONS } from './sizesData';
import { QUOTE_STYLES } from './quoteStylesData';
import { buildQuoteMessage, buildWhatsappUrl } from './whatsapp';

export default function StudioTattooQuote() {
  const [zoneId, setZoneId] = useState('');
  const [sizeId, setSizeId] = useState('');
  const [customCm, setCustomCm] = useState('');
  const [styleId, setStyleId] = useState('');

  const selectedZone = BODY_ZONES.find((zone) => zone.id === zoneId);
  const selectedSize = SIZE_OPTIONS.find((size) => size.id === sizeId);
  const selectedStyle = QUOTE_STYLES.find((style) => style.id === styleId);

  const sizeLabel = selectedSize?.specific ? (customCm ? `${customCm}cm` : '') : selectedSize?.label;

  const isReady = Boolean(selectedZone && sizeLabel && selectedStyle);

  const whatsappHref = useMemo(() => {
    if (!isReady) return undefined;
    const message = buildQuoteMessage(selectedZone, sizeLabel, selectedStyle.name);
    return buildWhatsappUrl(message);
  }, [isReady, selectedZone, sizeLabel, selectedStyle]);

  function handleCustomCmChange(event) {
    const digitsOnly = event.target.value.replace(/\D/g, '');
    if (digitsOnly === '') {
      setCustomCm('');
      return;
    }
    const clamped = Math.min(99, Math.max(1, Number(digitsOnly)));
    setCustomCm(String(clamped));
  }

  return (
    <section id="orcamento" className="st-quote section">
      <div className="container">
        <h2 className="st-section-title">Orçamento aproximado</h2>
        <p className="st-section-subtitle">
          Escolha a zona, o tamanho e o estilo para receber uma estimativa rápida pelo WhatsApp.
        </p>

        <div className="st-quote-panel">
          <div className="st-quote-fields">
            <label className="st-quote-field">
              <span className="st-quote-label">
                <FaLocationDot aria-hidden="true" />
                Zona do corpo
              </span>
              <select
                className="st-quote-select"
                value={zoneId}
                onChange={(event) => setZoneId(event.target.value)}
              >
                <option value="">Selecionar</option>
                {BODY_ZONES.map((zone) => (
                  <option key={zone.id} value={zone.id}>
                    {zone.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="st-quote-field">
              <span className="st-quote-label">
                <FaRulerCombined aria-hidden="true" />
                Tamanho aproximado
              </span>
              <select
                className="st-quote-select"
                value={sizeId}
                onChange={(event) => {
                  setSizeId(event.target.value);
                  setCustomCm('');
                }}
              >
                <option value="">Selecionar</option>
                {SIZE_OPTIONS.map((size) => (
                  <option key={size.id} value={size.id}>
                    {size.label}
                  </option>
                ))}
              </select>
              {selectedSize?.specific && (
                <div className="st-quote-custom-cm">
                  <input
                    type="text"
                    inputMode="numeric"
                    className="st-quote-cm-input"
                    placeholder="Ex: 12"
                    aria-label="Tamanho em centímetros, de 1 a 99"
                    value={customCm}
                    onChange={handleCustomCmChange}
                  />
                  <span className="st-quote-cm-suffix">cm</span>
                </div>
              )}
            </label>

            <label className="st-quote-field">
              <span className="st-quote-label">
                <FaPalette aria-hidden="true" />
                Estilo
              </span>
              <select
                className="st-quote-select"
                value={styleId}
                onChange={(event) => setStyleId(event.target.value)}
              >
                <option value="">Selecionar</option>
                {QUOTE_STYLES.map((style) => (
                  <option key={style.id} value={style.id}>
                    {style.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className={`st-quote-submit${isReady ? '' : ' st-quote-submit-disabled'}`}
            aria-disabled={!isReady}
            onClick={(event) => {
              if (!isReady) event.preventDefault();
            }}
          >
            <FaWhatsapp aria-hidden="true" />
            Pedir orçamento
          </a>
        </div>
      </div>
    </section>
  );
}
