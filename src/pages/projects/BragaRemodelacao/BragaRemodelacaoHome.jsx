// src/pages/projects/BragaRemodelacao/BragaRemodelacaoHome.jsx
// Monta todas as secções da página única, em ordem: hero, números, sobre
// (Task 4), serviços (Task 6), projetos (Task 7), antes/depois (Task 8),
// porquê-escolher-nos + processo (Task 9), depoimentos + CTA (Task 10) e o
// formulário de orçamento (Task 5).

import { STATS } from './statsData';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1600&q=75';

export default function BragaRemodelacaoHome() {
  return (
    <>
      <section
        id="inicio"
        className="brm-hero section"
        style={{
          backgroundImage:
            `linear-gradient(90deg, rgba(22,21,19,0.35) 0%, rgba(22,21,19,0.65) 55%, rgba(22,21,19,0.92) 100%), url('${HERO_IMAGE}')`,
        }}
      >
        <div className="container brm-hero-inner">
          <span className="brm-eyebrow">BragaRenova</span>
          <h1 className="brm-hero-title">
            A sua casa merece
            <br />
            uma nova história.
          </h1>
          <p className="brm-hero-subtitle">
            Transformamos casas e apartamentos em espaços modernos, funcionais e pensados para o
            seu dia a dia. Remodelações em Braga e arredores.
          </p>
          <div className="brm-hero-actions">
            <a href="#orcamento" className="brm-btn brm-btn-primary">
              Pedir Orçamento Gratuito
            </a>
            <a href="#projetos" className="brm-btn brm-btn-outline">
              Ver Projetos
            </a>
          </div>
        </div>
      </section>

      <section id="numeros" className="brm-stats section">
        <div className="container brm-stats-grid">
          {STATS.map((stat) => (
            <div key={stat.id} className="brm-stat">
              <span className="brm-stat-value">{stat.value}</span>
              <span className="brm-stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
