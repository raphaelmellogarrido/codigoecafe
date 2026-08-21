// src/pages/projects/JulimarDental/JulimarDental.jsx
// Página principal: provider do carrinho + composição de todas as secções.
// (Footer, botão flutuante e CSS completo chegam na próxima task.)

import { useMemo, useState } from 'react';
import { CartProvider, useCart } from './CartContext.jsx';
import { CATEGORIES } from './categoriesData.js';
import { PRODUCTS } from './productsData.js';
import JulimarDentalNavbar from './JulimarDentalNavbar.jsx';
import HeroBanners from './HeroBanners.jsx';
import StepsSection from './StepsSection.jsx';
import CategoryCarousel from './CategoryCarousel.jsx';
import ProductGrid from './ProductGrid.jsx';
import CartDrawer from './CartDrawer.jsx';
import './JulimarDental.css';

function JulimarDentalContent() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
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
      <JulimarDentalNavbar searchTerm={searchTerm} onSearchChange={setSearchTerm} onCartClick={() => setCartOpen(true)} />
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
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
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
