// src/components/Stats/Stats.jsx
// 4 estatísticas com contador animado (count-up).
// O número começa em 0 e anima até ao valor final quando entra no viewport.
// Usa useRef + useEffect + requestAnimationFrame + IntersectionObserver.

import { useEffect, useRef, useState } from "react";
import useScrollReveal from "../../hooks/useScrollReveal";
import "./Stats.css";

const stats = [
  { value: 7, suffix: " dias", label: "Entrega Rápida" },
  { value: 100, suffix: "%", label: "Foco no WhatsApp" },
  { value: 3, suffix: "x", label: "Mais Rápido que Agência" },
  { text: "Suporte", label: "30 Dias Incluso" },
];

function Counter({ end, suffix }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const animated = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !animated.current) {
            animated.current = true;
            const duration = 1800; // ms
            const startTime = performance.now();

            // requestAnimationFrame para suavidade
            const animate = (now) => {
              const progress = Math.min((now - startTime) / duration, 1);
              // easing: easeOutCubic
              const eased = 1 - Math.pow(1 - progress, 3);
              setCount(Math.floor(eased * end));
              if (progress < 1) requestAnimationFrame(animate);
              else setCount(end);
            };
            requestAnimationFrame(animate);
          }
        });
      },
      { threshold: 0.5 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [end]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

export default function Stats() {
  const headerRef = useScrollReveal();

  return (
    <section id="stats" className="stats section">
      <div className="container">
        <div ref={headerRef} className="section-header reveal">
          <h2 className="section-title">Por que trabalhar comigo agora?</h2>
        </div>

        <div className="stats-grid">
          {stats.map((stat, i) => (
            <div key={i} className="stat-item">
              <div className="stat-number gradient-text">
                {stat.text ? stat.text : <Counter end={stat.value} suffix={stat.suffix} />}
              </div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
