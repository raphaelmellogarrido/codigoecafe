// src/pages/projects/JulimarDental/CategoryCarousel.jsx
// Carrossel horizontal das 10 categorias. Clicar seleciona/filtra; clicar de
// novo na categoria já ativa limpa o filtro.

import { useRef } from 'react';
import { HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi';

export default function CategoryCarousel({ categories, selectedCategory, onSelectCategory }) {
  const trackRef = useRef(null);

  function scrollByAmount(amount) {
    trackRef.current?.scrollBy({ left: amount, behavior: 'smooth' });
  }

  return (
    <section className="jd-categories">
      <button
        type="button"
        className="jd-categories-arrow jd-categories-arrow-left"
        onClick={() => scrollByAmount(-240)}
        aria-label="Categorias anteriores"
      >
        <HiOutlineChevronLeft />
      </button>

      <div className="jd-categories-track" ref={trackRef}>
        {categories.map((category) => (
          <button
            key={category.key}
            type="button"
            className={`jd-category-item ${selectedCategory === category.key ? 'jd-category-item-active' : ''}`}
            onClick={() => onSelectCategory(selectedCategory === category.key ? null : category.key)}
          >
            <img src={category.image} alt="" className="jd-category-image" />
            <span>{category.label}</span>
          </button>
        ))}
      </div>

      <button
        type="button"
        className="jd-categories-arrow jd-categories-arrow-right"
        onClick={() => scrollByAmount(240)}
        aria-label="Próximas categorias"
      >
        <HiOutlineChevronRight />
      </button>
    </section>
  );
}
