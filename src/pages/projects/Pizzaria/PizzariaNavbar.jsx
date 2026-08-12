// src/pages/projects/Pizzaria/PizzariaNavbar.jsx
// Navbar fixa no topo: nome da pizzaria + ícone de carrinho com badge de
// quantidade de itens.

import { FaCartShopping } from 'react-icons/fa6';
import { useCart } from './CartContext.jsx';

export default function PizzariaNavbar({ onCartClick }) {
  const { itemCount } = useCart();

  return (
    <header className="pz-navbar">
      <span className="pz-navbar-brand">Pizzaria Mello's</span>
      <button type="button" className="pz-cart-button" onClick={onCartClick} aria-label="Abrir carrinho">
        <FaCartShopping />
        {itemCount > 0 && <span className="pz-cart-badge">{itemCount}</span>}
      </button>
    </header>
  );
}
