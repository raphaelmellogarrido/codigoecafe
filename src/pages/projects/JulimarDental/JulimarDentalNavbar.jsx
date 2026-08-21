// src/pages/projects/JulimarDental/JulimarDentalNavbar.jsx
// Header fixo: logo, busca (controlada pelo componente pai), telefone e
// ícone de carrinho com badge de quantidade.

import { HiOutlineSearch, HiOutlinePhone } from 'react-icons/hi';
import { FaCartShopping } from 'react-icons/fa6';
import { WHATSAPP_NUMBER_DISPLAY } from './constants.js';
import { useCart } from './CartContext.jsx';

export default function JulimarDentalNavbar({ searchTerm, onSearchChange, onCartClick }) {
  const { itemCount } = useCart();

  return (
    <header className="jd-navbar">
      <div className="jd-navbar-inner">
        <span className="jd-logo">
          JULIMAR<span className="jd-logo-accent"> DENTAL</span>
        </span>

        <div className="jd-search">
          <HiOutlineSearch className="jd-search-icon" />
          <input
            type="search"
            className="jd-search-input"
            placeholder="Busque seu material aqui"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Buscar produto"
          />
        </div>

        <div className="jd-navbar-actions">
          <a href={`tel:${WHATSAPP_NUMBER_DISPLAY.replace(/\s/g, '')}`} className="jd-navbar-phone">
            <HiOutlinePhone />
            <span>{WHATSAPP_NUMBER_DISPLAY}</span>
          </a>
          <button type="button" className="jd-cart-button" onClick={onCartClick} aria-label="Abrir orçamento">
            <FaCartShopping />
            {itemCount > 0 && <span className="jd-cart-badge">{itemCount}</span>}
          </button>
        </div>
      </div>
    </header>
  );
}
