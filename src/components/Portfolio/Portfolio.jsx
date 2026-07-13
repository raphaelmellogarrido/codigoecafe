// src/components/Portfolio/Portfolio.jsx
// Grelha de 6 projetos fictícios. Cada projeto tem:
//  - Gradient placeholder (cores diferentes)
//  - Nome, descrição, tags de tech
//  - Botão "Ver Projeto"
// Hover: overlay escuro com zoom

import { HiArrowRight } from 'react-icons/hi';
import useScrollReveal from '../../hooks/useScrollReveal';
import './Portfolio.css';

function ProjectCard({ project, index }) {
  const ref = useScrollReveal();

  return (
    <div
      ref={ref}
      className={`project-card reveal reveal-delay-${(index % 3) + 1}`}
      style={{ '--card-gradient': project.gradient }}
    >
      <div className="project-image">
        <div className="project-overlay">
          <a href="#" className="project-link">
            Ver Projeto <HiArrowRight />
          </a>
        </div>
      </div>
      <div className="project-body">
        <h3 className="project-name">{project.name}</h3>
        <p className="project-description">{project.description}</p>
        <div className="project-tags">
          {project.tags.map((tag, i) => (
            <span key={i} className="project-tag">
              {tag}
            </span>
          ))}
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
            Projetos em <span className="gradient-text">destaque</span>
          </h2>
          <p className="section-description">
            Uma seleção do nosso trabalho recente — cada projeto conta uma história única.
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
