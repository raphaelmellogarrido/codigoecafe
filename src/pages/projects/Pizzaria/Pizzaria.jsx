// src/pages/projects/Pizzaria/Pizzaria.jsx
// Página principal da Pizzaria Mello's: hero, grid de sabores, e orquestra
// carrinho / modal de bebida. (Hero e grid completos chegam nas próximas tasks.)

import { CartProvider } from './CartContext.jsx';
import PizzariaNavbar from './PizzariaNavbar.jsx';
import PizzaCard from './PizzaCard.jsx';
import { PIZZAS } from './menuData.js';

function PizzariaContent() {
  return (
    <div className="pz-page">
      <PizzariaNavbar onCartClick={() => {}} />
      <section id="pz-menu" className="pz-menu">
        <h2>Nosso cardápio</h2>
        <div className="pz-menu-grid">
          {PIZZAS.map((pizza) => (
            <PizzaCard key={pizza.id} pizza={pizza} />
          ))}
        </div>
      </section>
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
