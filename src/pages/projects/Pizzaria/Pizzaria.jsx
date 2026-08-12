// src/pages/projects/Pizzaria/Pizzaria.jsx
// Página principal da Pizzaria Mello's: hero, grid de sabores, e orquestra
// carrinho / modal de bebida. (Hero e grid completos chegam nas próximas tasks.)

import { useState } from 'react';
import { CartProvider, useCart } from './CartContext.jsx';
import PizzariaNavbar from './PizzariaNavbar.jsx';
import PizzaCard from './PizzaCard.jsx';
import DrinkModal from './DrinkModal.jsx';
import CartDrawer from './CartDrawer.jsx';
import { PIZZAS } from './menuData.js';

function PizzariaContent() {
  const { items } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showDrinkModal, setShowDrinkModal] = useState(false);
  const [drinkPromptShown, setDrinkPromptShown] = useState(false);

  function handleCartClick() {
    const hasPizza = items.some((item) => item.type === 'pizza');
    if (!drinkPromptShown && hasPizza) {
      setShowDrinkModal(true);
    } else {
      setIsCartOpen(true);
    }
  }

  function handleDrinkModalClose() {
    setShowDrinkModal(false);
    setDrinkPromptShown(true);
    setIsCartOpen(true);
  }

  return (
    <div className="pz-page">
      <PizzariaNavbar onCartClick={handleCartClick} />
      <section id="pz-menu" className="pz-menu">
        <h2>Nosso cardápio</h2>
        <div className="pz-menu-grid">
          {PIZZAS.map((pizza) => (
            <PizzaCard key={pizza.id} pizza={pizza} />
          ))}
        </div>
      </section>
      <DrinkModal isOpen={showDrinkModal} onClose={handleDrinkModalClose} />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
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
