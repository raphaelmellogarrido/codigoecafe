// src/pages/projects/FazTudo/FazTudoHome.jsx
// Home: hero com CTA para a calculadora, galeria antes/depois e depoimentos.

import { Link } from 'react-router-dom';
import { FaStar, FaRegStar } from 'react-icons/fa6';
import BeforeAfterSlider from './BeforeAfterSlider';
import { GALLERY_ITEMS } from './galleryData';
import { TESTIMONIALS } from './testimonialsData';

function RatingStars({ rating }) {
  return (
    <div className="ft-rating" aria-label={`Avaliação: ${rating} de 5 estrelas`}>
      {[1, 2, 3, 4, 5].map((value) =>
        value <= rating ? <FaStar key={value} /> : <FaRegStar key={value} />
      )}
    </div>
  );
}

export default function FazTudoHome() {
  return (
    <>
      <section
        className="ft-hero section"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(20,16,13,0.4) 0%, rgba(20,16,13,0.95) 100%), url('https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=1400&q=75')",
        }}
      >
        <div className="container">
          <span className="ft-hero-label">Faz Tudo</span>
          <h1 className="ft-hero-title">Reparos e manutenção residencial, sem complicação</h1>
          <p className="ft-hero-subtitle">
            Torneiras, pintura, móveis, elétrica e muito mais — escolha os serviços que precisa e
            receba um orçamento rápido pelo WhatsApp.
          </p>
          <Link to="/faz-tudo/orcamento" className="ft-hero-cta">
            Montar meu orçamento
          </Link>
        </div>
      </section>

      <section className="ft-gallery section">
        <div className="container">
          <h2 className="ft-section-title">Antes e depois</h2>
          <div className="ft-gallery-grid">
            {GALLERY_ITEMS.map((item) => (
              <div key={item.id}>
                <BeforeAfterSlider beforeImage={item.beforeImage} afterImage={item.afterImage} />
                <p className="ft-gallery-item-title">{item.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="ft-testimonials section">
        <div className="container">
          <h2 className="ft-section-title">O que dizem os clientes</h2>
          <div className="ft-testimonials-grid">
            {TESTIMONIALS.map((testimonial) => (
              <div key={testimonial.id} className="ft-testimonial-card">
                <img src={testimonial.photo} alt={testimonial.name} className="ft-testimonial-photo" />
                <div>
                  <p className="ft-testimonial-name">{testimonial.name}</p>
                  <RatingStars rating={testimonial.rating} />
                  <p className="ft-testimonial-text">{testimonial.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
