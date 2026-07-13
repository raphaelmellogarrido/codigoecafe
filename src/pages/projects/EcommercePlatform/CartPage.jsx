// src/pages/projects/EcommercePlatform/CartPage.jsx

import { Link } from 'react-router-dom';
import { HiMinus, HiPlus, HiTrash } from 'react-icons/hi';
import { useCart } from './context/CartContext';
import { formatPrice } from './format';

export default function CartPage() {
  const { items, updateQuantity, removeItem, totalCents } = useCart();

  if (items.length === 0) {
    return (
      <div className="ep-empty">
        <p>O teu carrinho está vazio.</p>
        <Link to="/projetos/ecommerce-platform" className="ep-primary-button">
          Ver produtos
        </Link>
      </div>
    );
  }

  return (
    <div>
      <header className="ep-header">
        <h1>O teu carrinho</h1>
      </header>

      <div className="ep-cart-list">
        {items.map((item) => (
          <div key={item.productId} className="ep-cart-row">
            <div
              className="ep-cart-thumb"
              style={{ backgroundImage: `${item.gradient}, url(${item.image})` }}
            />
            <div className="ep-cart-info">
              <h3>{item.name}</h3>
              <span>{formatPrice(item.price_cents)}</span>
            </div>
            <div className="ep-qty-control">
              <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} aria-label="Diminuir">
                <HiMinus />
              </button>
              <span>{item.quantity}</span>
              <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} aria-label="Aumentar">
                <HiPlus />
              </button>
            </div>
            <span className="ep-cart-subtotal">{formatPrice(item.price_cents * item.quantity)}</span>
            <button
              className="ep-remove-button"
              onClick={() => removeItem(item.productId)}
              aria-label="Remover"
            >
              <HiTrash />
            </button>
          </div>
        ))}
      </div>

      <div className="ep-cart-summary">
        <span>Total</span>
        <strong>{formatPrice(totalCents)}</strong>
      </div>

      <Link to="/projetos/ecommerce-platform/finalizar" className="ep-primary-button">
        Finalizar compra
      </Link>
    </div>
  );
}
