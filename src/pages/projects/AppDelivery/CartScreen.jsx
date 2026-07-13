// src/pages/projects/AppDelivery/CartScreen.jsx

import { Link, useNavigate } from 'react-router-dom';
import { HiMinus, HiPlus, HiTrash } from 'react-icons/hi';
import { findRestaurant } from './data';
import { useCart } from './context/CartContext';
import { formatPrice } from './format';

export default function CartScreen() {
  const { restaurantId, items, updateQuantity, removeItem, totalCents, placeOrder } = useCart();
  const navigate = useNavigate();
  const restaurant = restaurantId ? findRestaurant(restaurantId) : null;

  if (items.length === 0) {
    return (
      <div className="dl-empty">
        <p>O teu carrinho está vazio.</p>
        <Link to="/projetos/app-delivery" className="dl-primary-button">Ver restaurantes</Link>
      </div>
    );
  }

  function handleConfirm() {
    placeOrder(restaurant);
    navigate('/projetos/app-delivery/pedido');
  }

  return (
    <div>
      <header className="dl-screen-header">
        <h1>O teu pedido</h1>
        <p>{restaurant?.name}</p>
      </header>

      <div className="dl-cart-list">
        {items.map((item) => (
          <div key={item.id} className="dl-cart-row">
            <div className="dl-cart-info">
              <h3>{item.name}</h3>
              <span>{formatPrice(item.price_cents)}</span>
            </div>
            <div className="dl-qty-control">
              <button onClick={() => updateQuantity(item.id, item.quantity - 1)} aria-label="Diminuir">
                <HiMinus />
              </button>
              <span>{item.quantity}</span>
              <button onClick={() => updateQuantity(item.id, item.quantity + 1)} aria-label="Aumentar">
                <HiPlus />
              </button>
            </div>
            <button className="dl-remove-button" onClick={() => removeItem(item.id)} aria-label="Remover">
              <HiTrash />
            </button>
          </div>
        ))}
      </div>

      <div className="dl-cart-summary">
        <span>Total</span>
        <strong>{formatPrice(totalCents)}</strong>
      </div>

      <button className="dl-primary-button" onClick={handleConfirm}>
        Confirmar pedido
      </button>
    </div>
  );
}
