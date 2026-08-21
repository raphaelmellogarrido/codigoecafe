// src/pages/projects/JulimarDental/JulimarDental.jsx
// Página principal: provider do carrinho + composição de todas as secções.
// (Passos, categorias, grid e carrinho chegam nas próximas tasks.)

import { useState } from 'react';
import { CartProvider } from './CartContext.jsx';
import JulimarDentalNavbar from './JulimarDentalNavbar.jsx';
import HeroBanners from './HeroBanners.jsx';
import StepsSection from './StepsSection.jsx';
import './JulimarDental.css';

function JulimarDentalContent() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="jd-page">
      <JulimarDentalNavbar searchTerm={searchTerm} onSearchChange={setSearchTerm} onCartClick={() => {}} />
      <HeroBanners />
      <StepsSection />
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
