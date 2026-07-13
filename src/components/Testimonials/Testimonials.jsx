// src/components/Testimonials/Testimonials.jsx
// 3 cards de testemunhos com:
//  - Aspas decorativas
//  - Texto do testemunho
//  - Avatar (círculo gradient com inicial)
//  - Nome, cargo, estrelas

import { FaStar, FaQuoteLeft } from 'react-icons/fa';
import useScrollReveal from '../../hooks/useScrollReveal';
import './Testimonials.css';

function TestimonialCard({ testimonial, index }) {
  const ref = useScrollReveal();

  return (
    <div ref={ref} className={`testimonial-card reveal reveal-delay-${index + 1}`}>
      <FaQuoteLeft className="quote-icon" />

      <p className="testimonial-text">"{testimonial.text}"</p>

      <div className="testimonial-stars">
        {[...Array(5)].map((_, i) => (
          <FaStar key={i} />
        ))}
      </div>

      <div className="testimonial-author">
        <div className="testimonial-avatar">{testimonial.initials}</div>
        <div>
          <div className="testimonial-name">{testimonial.name}</div>
          <div className="testimonial-role">{testimonial.role}</div>
        </div>
      </div>
    </div>
  );
}

export default function Testimonials({ testimonials }) {
  const headerRef = useScrollReveal();

  return (
    <section className="testimonials section">
      <div className="container">
        <div ref={headerRef} className="section-header reveal">
          <span className="section-label">Testemunhos</span>
          <h2 className="section-title">
            O que dizem os <span className="gradient-text">nossos clientes</span>
          </h2>
          <p className="section-description">
            Histórias reais de quem confiou no nosso trabalho.
          </p>
        </div>

        <div className="testimonials-grid">
          {testimonials.map((t, index) => (
            <TestimonialCard key={index} testimonial={t} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
