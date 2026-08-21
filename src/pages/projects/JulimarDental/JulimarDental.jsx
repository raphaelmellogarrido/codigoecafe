// src/pages/projects/JulimarDental/JulimarDental.jsx
// Página principal: provider do carrinho + composição de todas as secções.
// (Banners, passos, categorias, grid e carrinho chegam nas próximas tasks.)

import { useState } from 'react';
import { CartProvider } from './CartContext.jsx';
import JulimarDentalNavbar from './JulimarDentalNavbar.jsx';
import './JulimarDental.css';

function JulimarDentalContent() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="jd-page">
      <JulimarDentalNavbar searchTerm={searchTerm} onSearchChange={setSearchTerm} onCartClick={() => {}} />
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
