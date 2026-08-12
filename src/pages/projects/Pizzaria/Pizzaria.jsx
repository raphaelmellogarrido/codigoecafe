// src/pages/projects/Pizzaria/Pizzaria.jsx
// Página principal da Pizzaria Mello's: hero, grid de sabores, e orquestra
// carrinho / modal de bebida. (Hero e grid completos chegam nas próximas tasks.)

import { CartProvider } from './CartContext.jsx';
import PizzariaNavbar from './PizzariaNavbar.jsx';

function PizzariaContent() {
  return (
    <div className="pz-page">
      <PizzariaNavbar onCartClick={() => {}} />
      <p style={{ padding: '2rem' }}>Cardápio chegando...</p>
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
