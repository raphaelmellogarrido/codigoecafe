// src/hooks/useScrollReveal.js
// Hook personalizado que adiciona a classe "visible" a um elemento
// quando ele entra na viewport do browser.
// Usa IntersectionObserver — API nativa do browser, sem libs externas.
//
// Como usar:
//   const ref = useScrollReveal();
//   <div ref={ref} className="reveal">...</div>

import { useEffect, useRef } from 'react';

export default function useScrollReveal(options = {}) {
  // useRef guarda uma referência ao elemento DOM real
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Cria o observer com opções por defeito personalizáveis
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Quando o elemento está visível, adiciona a classe .visible
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Se `once: true`, deixa de observar após a 1ª revelação
            if (options.once !== false) {
              observer.unobserve(entry.target);
            }
          } else if (options.once === false) {
            // Permite re-animar ao sair do viewport
            entry.target.classList.remove('visible');
          }
        });
      },
      {
        threshold: options.threshold || 0.15, // 15% do elemento visível
        rootMargin: options.rootMargin || '0px 0px -50px 0px',
      }
    );

    observer.observe(element);

    // Cleanup: remove o observer quando o componente desmonta
    return () => observer.disconnect();
  }, [options.threshold, options.rootMargin, options.once]);

  return ref;
}
