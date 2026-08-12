// src/pages/projects/Pizzaria/Pizzaria.jsx
// Página principal da Pizzaria Mello's: hero, grid de sabores, e orquestra
// carrinho / modal de bebida. (Hero e grid completos chegam nas próximas tasks.)

import { useState } from 'react';
import { CartProvider, useCart } from './CartContext.jsx';
import PizzariaNavbar from './PizzariaNavbar.jsx';
import PizzaCard from './PizzaCard.jsx';
import DrinkModal from './DrinkModal.jsx';
import { PIZZAS } from './menuData.js';

function PizzariaContent() {
  const { items } = useCart();
  const [showDrinkModal, setShowDrinkModal] = useState(false);
  const [drinkPromptShown, setDrinkPromptShown] = useState(false);

  function handleCartClick() {
    const hasPizza = items.some((item) => item.type === 'pizza');
    if (!drinkPromptShown && hasPizza) {
      setShowDrinkModal(true);
    } else {
      // Task 7 replaces this branch with "open the cart drawer".
    }
  }

  function handleDrinkModalClose() {
    setShowDrinkModal(false);
    setDrinkPromptShown(true);
    // Task 7 replaces this with "open the cart drawer".
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
