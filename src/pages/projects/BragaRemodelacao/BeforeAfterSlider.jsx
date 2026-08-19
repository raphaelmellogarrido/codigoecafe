// src/pages/projects/BragaRemodelacao/BeforeAfterSlider.jsx
// Slider de comparação antes/depois: a imagem "depois" fica por cima,
// recortada com clip-path até a posição X do handle. Arrastar o handle
// (pointer events) ou usar as setas do teclado (handle é focável,
// role=slider) move o recorte. Sem dependências externas.

import { useCallback, useRef, useState } from 'react';

export default function BeforeAfterSlider({ beforeImage, afterImage, beforeLabel = 'Antes', afterLabel = 'Depois' }) {
  const containerRef = useRef(null);
  const [position, setPosition] = useState(50); // % da largura, a partir da esquerda

  const updateFromClientX = useCallback((clientX) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const ratio = (clientX - rect.left) / rect.width;
    const clamped = Math.min(1, Math.max(0, ratio));
    setPosition(clamped * 100);
  }, []);

  function handlePointerDown(event) {
    event.currentTarget.setPointerCapture(event.pointerId);
    updateFromClientX(event.clientX);
  }

  function handlePointerMove(event) {
    if (event.buttons !== 1) return;
    updateFromClientX(event.clientX);
  }

  function handleKeyDown(event) {
    if (event.key === 'ArrowLeft') setPosition((prev) => Math.max(0, prev - 5));
    if (event.key === 'ArrowRight') setPosition((prev) => Math.min(100, prev + 5));
  }

  return (
    <div ref={containerRef} className="brm-ba-slider">
      <img src={beforeImage} alt={beforeLabel} className="brm-ba-image brm-ba-image-before" draggable={false} />
      <div className="brm-ba-image-after-wrap" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
        <img src={afterImage} alt={afterLabel} className="brm-ba-image brm-ba-image-after" draggable={false} />
      </div>
      <div
        className="brm-ba-handle"
        style={{ left: `${position}%` }}
        role="slider"
        tabIndex={0}
        aria-label="Arraste para comparar antes e depois"
        aria-valuenow={Math.round(position)}
        aria-valuemin={0}
        aria-valuemax={100}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onKeyDown={handleKeyDown}
      >
        <span className="brm-ba-handle-arrows">↔</span>
      </div>
      <span className="brm-ba-badge brm-ba-badge-before">{beforeLabel}</span>
      <span className="brm-ba-badge brm-ba-badge-after">{afterLabel}</span>
    </div>
  );
}
