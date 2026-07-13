// src/components/Stats/Stats.jsx
// 4 estatísticas com contador animado (count-up).
// O número começa em 0 e anima até ao valor final quando entra no viewport.
// Usa useRef + useEffect + requestAnimationFrame + IntersectionObserver.

import { useEffect, useRef, useState } from 'react';
import './Stats.css';

const stats = [
  { value: 50, suffix: '+', label: 'Projetos Entregues' },
  { value: 30, suffix: '+', label: 'Clientes Satisfeitos' },
  { value: 5, suffix: '+', label: 'Anos de Experiência' },
  { value: 100, suffix: '%', label: 'Satisfação' },
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
      { threshold: 0.5 }
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
  return (
    <section id="stats" className="stats section">
      <div className="container">
        <div className="stats-grid">
          {stats.map((stat, i) => (
            <div key={i} className="stat-item">
              <div className="stat-number gradient-text">
                <Counter end={stat.value} suffix={stat.suffix} />
              </div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
