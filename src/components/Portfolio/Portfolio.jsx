// src/components/Portfolio/Portfolio.jsx
// Grelha com os 3 cases de automação via WhatsApp. Cada projeto tem:
//  - Gradient placeholder (cores diferentes)
//  - Nome, descrição, tag de resultado (não técnica)
//  - Botão "Ver site ao vivo"
// Hover: overlay escuro com zoom

import { Link } from 'react-router-dom';
import { HiArrowRight } from 'react-icons/hi';
import useScrollReveal from '../../hooks/useScrollReveal';
import './Portfolio.css';

function ProjectCard({ project, index }) {
  const ref = useScrollReveal();

  return (
    <div
      ref={ref}
      className={`project-card reveal reveal-delay-${(index % 3) + 1}`}
      style={{ '--card-gradient': project.gradient, '--card-image': `url(${project.image})` }}
    >
      <div className="project-image">
        <div className="project-overlay">
          {project.path && project.external ? (
            // Build estático à parte (fora do React Router, ex.: /fornecedor):
            // precisa de <a> normal para forçar um reload completo da página.
            // Um <Link> tentaria navegação client-side, não encontraria a rota
            // e cairia no catch-all de volta para a home.
            <a href={project.path} className="project-link">
              Ver site ao vivo <HiArrowRight />
            </a>
          ) : project.path ? (
            <Link to={project.path} className="project-link">
              Ver site ao vivo <HiArrowRight />
            </Link>
          ) : (
            <span className="project-link project-link-disabled">Em breve</span>
          )}
        </div>
      </div>
      <div className="project-body">
        <h3 className="project-name">{project.name}</h3>
        <p className="project-description">{project.description}</p>
        <div className="project-tags">
          <span className="project-tag">{project.tag}</span>
        </div>
      </div>
    </div>
  );
}

export default function Portfolio({ projects }) {
  const headerRef = useScrollReveal();

  return (
    <section id="portfolio" className="portfolio section">
      <div className="container">
        <div ref={headerRef} className="section-header reveal">
          <span className="section-label">Portfólio</span>
          <h2 className="section-title">
            Não fazemos só sites. Fazemos sites que <span className="gradient-text">atendem por você</span>.
          </h2>
          <p className="section-description">
            3 sites com automação de WhatsApp que economizam horas de atendimento toda semana.
          </p>
        </div>

        <div className="portfolio-grid">
          {projects.map((project, index) => (
            <ProjectCard key={index} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
