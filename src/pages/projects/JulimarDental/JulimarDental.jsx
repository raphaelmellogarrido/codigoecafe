// src/pages/projects/JulimarDental/JulimarDental.jsx
// Página principal: provider do carrinho + composição de todas as secções.
// (Grid de produtos e carrinho chegam nas próximas tasks.)

import { useState } from 'react';
import { CartProvider } from './CartContext.jsx';
import { CATEGORIES } from './categoriesData.js';
import JulimarDentalNavbar from './JulimarDentalNavbar.jsx';
import HeroBanners from './HeroBanners.jsx';
import StepsSection from './StepsSection.jsx';
import CategoryCarousel from './CategoryCarousel.jsx';
import './JulimarDental.css';

function JulimarDentalContent() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);

  return (
    <div className="jd-page">
      <JulimarDentalNavbar searchTerm={searchTerm} onSearchChange={setSearchTerm} onCartClick={() => {}} />
      <HeroBanners />
      <StepsSection />
      <CategoryCarousel
        categories={CATEGORIES}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
      <p style={{ padding: '2rem' }}>Catálogo chegando...</p>
    </div>
  );
}

export default function JulimarDental() {
  return (
    <CartProvider>
      <JulimarDentalContent />
    </CartProvider>
  );
}
