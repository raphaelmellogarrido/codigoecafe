// src/pages/projects/Pizzaria/Pizzaria.jsx
// Página principal da Pizzaria Mello's: hero, abas de cardápio (salgadas,
// doces, bebidas), carrinho (drawer) e botão flutuante de WhatsApp.

import { useState } from 'react';
import { CartProvider } from './CartContext.jsx';
import PizzariaNavbar from './PizzariaNavbar.jsx';
import PizzaCard from './PizzaCard.jsx';
import DrinksGrid from './DrinksGrid.jsx';
import CartDrawer from './CartDrawer.jsx';
import WhatsappFloatButton from './WhatsappFloatButton.jsx';
import PizzariaFooter from './PizzariaFooter.jsx';
import { PIZZAS, HERO_IMAGE } from './menuData.js';
import './Pizzaria.css';

const TABS = [
  { key: 'salgada', label: 'Pizzas salgadas' },
  { key: 'doce', label: 'Pizzas doces' },
  { key: 'bebida', label: 'Bebidas' },
];

function PizzariaContent() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('salgada');

  return (
    <div className="pz-page">
      <PizzariaNavbar onCartClick={() => setIsCartOpen(true)} />

      <section className="pz-hero" style={{ backgroundImage: `url(${HERO_IMAGE})` }}>
        <div className="pz-hero-overlay">
          <h1>Pizzaria Mello's</h1>
          <p>Pizza artesanal feita na hora, pedida em segundos pelo WhatsApp.</p>
          <a href="#pz-menu" className="pz-button pz-button-primary">Ver cardápio</a>
        </div>
      </section>

      <section id="pz-menu" className="pz-menu">
        <div className="pz-menu-tabs" role="tablist">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.key}
              className={`pz-menu-tab${activeTab === tab.key ? ' pz-menu-tab-active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'bebida' ? (
          <DrinksGrid />
        ) : (
          <div className="pz-menu-grid">
            {PIZZAS.filter((pizza) => pizza.category === activeTab).map((pizza) => (
              <PizzaCard key={pizza.id} pizza={pizza} />
            ))}
          </div>
        )}
      </section>

      <PizzariaFooter />

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <WhatsappFloatButton />
    </div>
  );
}

export default function Pizzaria() {
  return (
    <CartProvider>
      <PizzariaContent />
    </CartProvider>
  );
}
