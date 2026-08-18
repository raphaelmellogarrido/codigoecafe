// src/pages/projects/StudioTattoo/TestimonialsCarousel.jsx
// Carrossel de depoimentos: cards deslizam horizontalmente (scroll-snap) com
// bolinhas de navegação embaixo. Sem biblioteca externa.

import { useRef, useState } from 'react';
import { FaStar, FaRegStar } from 'react-icons/fa6';
import { TESTIMONIALS } from './testimonialsData';

function RatingStars({ rating }) {
  return (
    <div className="st-rating" aria-label={`Avaliação: ${rating} de 5 estrelas`}>
      {[1, 2, 3, 4, 5].map((value) =>
        value <= rating ? <FaStar key={value} /> : <FaRegStar key={value} />
      )}
    </div>
  );
}

export default function TestimonialsCarousel() {
  const trackRef = useRef(null);
  const cardRefs = useRef([]);
  const [activeIndex, setActiveIndex] = useState(0);

  function scrollToIndex(index) {
    const card = cardRefs.current[index];
    if (!card) return;
    card.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
    setActiveIndex(index);
  }

  function handleScroll() {
    const track = trackRef.current;
    if (!track) return;
    const trackLeft = track.getBoundingClientRect().left;
    let closestIndex = 0;
    let closestDistance = Infinity;
    cardRefs.current.forEach((card, index) => {
      if (!card) return;
      const distance = Math.abs(card.getBoundingClientRect().left - trackLeft);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });
    setActiveIndex(closestIndex);
  }

  return (
    <div className="st-carousel">
      <div className="st-carousel-track" ref={trackRef} onScroll={handleScroll}>
        {TESTIMONIALS.map((testimonial, index) => (
          <div
            key={testimonial.id}
            className="st-testimonial-card"
            ref={(el) => {
              cardRefs.current[index] = el;
            }}
          >
            <img src={testimonial.photo} alt={testimonial.name} className="st-testimonial-photo" />
            <div>
              <p className="st-testimonial-name">{testimonial.name}</p>
              <RatingStars rating={testimonial.rating} />
              <p className="st-testimonial-text">{testimonial.text}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="st-carousel-dots" role="tablist" aria-label="Navegar depoimentos">
        {TESTIMONIALS.map((testimonial, index) => (
          <button
            key={testimonial.id}
            type="button"
            role="tab"
            aria-selected={index === activeIndex}
            aria-label={`Ver depoimento de ${testimonial.name}`}
            className={`st-carousel-dot${index === activeIndex ? ' st-carousel-dot-active' : ''}`}
            onClick={() => scrollToIndex(index)}
          />
        ))}
      </div>
    </div>
  );
}
