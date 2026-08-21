// src/pages/projects/JulimarDental/JulimarDental.jsx
// Página principal: provider do carrinho + composição de todas as secções.
// (Carrinho lateral chega na próxima task.)

import { useMemo, useState } from 'react';
import { CartProvider, useCart } from './CartContext.jsx';
import { CATEGORIES } from './categoriesData.js';
import { PRODUCTS } from './productsData.js';
import JulimarDentalNavbar from './JulimarDentalNavbar.jsx';
import HeroBanners from './HeroBanners.jsx';
import StepsSection from './StepsSection.jsx';
import CategoryCarousel from './CategoryCarousel.jsx';
import ProductGrid from './ProductGrid.jsx';
import './JulimarDental.css';

function JulimarDentalContent() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { addToCart } = useCart();

  const filteredProducts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return PRODUCTS.filter((product) => {
      const matchesCategory = !selectedCategory || product.categoryKey === selectedCategory;
      const matchesSearch = !term || product.name.toLowerCase().includes(term);
      return matchesCategory && matchesSearch;
    });
  }, [searchTerm, selectedCategory]);

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
      <section id="produtos" className="jd-products-section">
        <ProductGrid products={filteredProducts} onAddToCart={addToCart} />
      </section>
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
