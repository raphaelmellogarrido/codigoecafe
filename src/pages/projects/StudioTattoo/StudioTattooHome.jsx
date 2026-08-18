// src/pages/projects/StudioTattoo/StudioTattooHome.jsx
// Página única do projeto: hero, galeria filtrável, equipa, depoimentos, FAQ
// e contacto/agendamento.

import { useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa6';
import TestimonialsCarousel from './TestimonialsCarousel';
import { TATTOO_STYLES } from './stylesData';
import { GALLERY_ITEMS } from './galleryData';
import { ARTISTS } from './artistsData';
import { FAQS } from './faqData';
import { buildArtistMessage, buildBookingMessage, buildWhatsappUrl } from './whatsapp';

export default function StudioTattooHome() {
  const [activeStyleId, setActiveStyleId] = useState('todos');

  const visibleItems =
    activeStyleId === 'todos'
      ? GALLERY_ITEMS
      : GALLERY_ITEMS.filter((item) => item.styleId === activeStyleId);

  const bookingHref = buildWhatsappUrl(buildBookingMessage());

  return (
    <>
      <section
        id="inicio"
        className="st-hero section"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(14,14,16,0.15) 0%, rgba(14,14,16,0.55) 55%, rgba(14,14,16,0.95) 85%), url('https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&w=1600&q=75')",
        }}
      >
        <div className="container st-hero-inner">
          <div className="st-hero-content">
            <span className="st-hero-label">Studio Tattoo</span>
            <h1 className="st-hero-title">
              Arte e técnica
              <br />
              em cada traço
            </h1>
            <p className="st-hero-subtitle">
              Old school, realismo, blackwork, fineline e muito mais — agende um horário com a
              nossa equipa e tire suas dúvidas diretamente pelo WhatsApp.
            </p>
            <div className="st-hero-actions">
              <a href={bookingHref} target="_blank" rel="noopener noreferrer" className="st-hero-cta">
                <FaWhatsapp aria-hidden="true" />
                Agendar horário
              </a>
              <a href="#galeria" className="st-hero-cta st-hero-cta-outline">
                Ver trabalhos
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="galeria" className="st-gallery section">
        <div className="container">
          <h2 className="st-section-title">Nossos trabalhos</h2>
          <p className="st-section-subtitle">Filtre por estilo para ver exemplos recentes.</p>

          <div className="st-style-filters" role="group" aria-label="Filtrar por estilo">
            <button
              type="button"
              className={`st-style-chip${activeStyleId === 'todos' ? ' st-style-chip-active' : ''}`}
              aria-pressed={activeStyleId === 'todos'}
              onClick={() => setActiveStyleId('todos')}
            >
              Todos
            </button>
            {TATTOO_STYLES.map((style) => (
              <button
                key={style.id}
                type="button"
                className={`st-style-chip${activeStyleId === style.id ? ' st-style-chip-active' : ''}`}
                aria-pressed={activeStyleId === style.id}
                onClick={() => setActiveStyleId(style.id)}
              >
                {style.name}
              </button>
            ))}
          </div>

          <div className="st-gallery-grid">
            {visibleItems.map((item) => (
              <figure key={item.id} className="st-gallery-item">
                <img src={item.image} alt={item.title} loading="lazy" />
                <figcaption className="st-gallery-caption">
                  <span>{item.title}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section id="equipa" className="st-artists section">
        <div className="container">
          <h2 className="st-section-title">Nossa equipa</h2>
          <p className="st-section-subtitle">
            Cada tatuador tem seu próprio estilo — escolha quem combina mais com a sua ideia.
          </p>

          <div className="st-artists-grid">
            {ARTISTS.map((artist) => {
              const artistHref = buildWhatsappUrl(buildArtistMessage(artist.name));
              return (
                <div key={artist.id} className="st-artist-card">
                  <img src={artist.photo} alt={artist.name} className="st-artist-photo" />
                  <h3 className="st-artist-name">{artist.name}</h3>
                  <span className="st-artist-specialty">{artist.specialty}</span>
                  <p className="st-artist-bio">{artist.bio}</p>
                  <a
                    href={artistHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="st-artist-cta"
                  >
                    <FaWhatsapp aria-hidden="true" />
                    Agendar com {artist.name.split(' ')[0]}
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="depoimentos" className="st-testimonials section">
        <div className="container">
          <h2 className="st-section-title">O que dizem os clientes</h2>
          <TestimonialsCarousel />
        </div>
      </section>

      <section id="faq" className="st-faq section">
        <div className="container">
          <h2 className="st-section-title">Perguntas frequentes</h2>

          <div className="st-faq-list">
            {FAQS.map((faq) => (
              <details key={faq.id} className="st-faq-item">
                <summary className="st-faq-question">{faq.question}</summary>
                <p className="st-faq-answer">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section id="contacto" className="st-contact section">
        <div className="container st-contact-inner">
          <h2 className="st-section-title">Vamos agendar sua tatuagem?</h2>
          <p className="st-contact-text">
            Estúdio aberto de terça a sábado, das 11h às 20h. Fale connosco pelo WhatsApp para
            marcar uma consulta ou tirar dúvidas sobre valores e disponibilidade.
          </p>
          <a href={bookingHref} target="_blank" rel="noopener noreferrer" className="st-hero-cta">
            <FaWhatsapp aria-hidden="true" />
            Agendar pelo WhatsApp
          </a>
        </div>
      </section>
    </>
  );
}
