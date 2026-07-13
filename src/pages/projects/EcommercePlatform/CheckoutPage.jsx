// src/pages/projects/EcommercePlatform/CheckoutPage.jsx
// Confirma a encomenda: exige sessão iniciada, envia o carrinho para
// POST /api/orders/checkout, onde o servidor recalcula o total e grava tudo no SQLite.

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { API_BASE } from '../../../lib/apiBase';
import { useAuth } from './context/AuthContext';
import { useCart } from './context/CartContext';
import { formatPrice } from './format';

export default function CheckoutPage() {
  const { token, user } = useAuth();
  const { items, totalCents, clearCart } = useCart();
  const [status, setStatus] = useState('idle'); // idle | processing | success | error
  const [errorMsg, setErrorMsg] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  if (!user) {
    return (
      <div className="ep-empty">
        <p>Precisas de iniciar sessão para finalizar a compra.</p>
        <Link to="/projetos/ecommerce-platform/entrar" className="ep-primary-button">
          Entrar ou criar conta
        </Link>
      </div>
    );
  }

  if (status === 'success' && confirmedOrder) {
    return (
      <div className="ep-empty">
        <p className="ep-success-icon">✓</p>
        <h2>Pagamento simulado aprovado!</h2>
        <p>Encomenda #{confirmedOrder.id} — {formatPrice(confirmedOrder.totalCents)}</p>
        <Link to="/projetos/ecommerce-platform/pedidos" className="ep-primary-button">
          Ver os meus pedidos
        </Link>
      </div>
    );
  }

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

  async function handleConfirm() {
    setStatus('processing');
    setErrorMsg('');
    try {
      const res = await fetch(`${API_BASE}/api/orders/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Não foi possível concluir a compra.');

      setConfirmedOrder(data.order);
      setStatus('success');
      clearCart();
    } catch (err) {
      setErrorMsg(err.message);
      setStatus('error');
    }
  }

  return (
    <div>
      <header className="ep-header">
        <h1>Confirmar encomenda</h1>
        <p>Sessão iniciada como {user.name} ({user.email})</p>
      </header>

      <div className="ep-cart-summary ep-checkout-summary">
        {items.map((item) => (
          <div key={item.productId} className="ep-checkout-row">
            <span>{item.quantity}x {item.name}</span>
            <span>{formatPrice(item.price_cents * item.quantity)}</span>
          </div>
        ))}
        <div className="ep-checkout-row ep-checkout-total">
          <span>Total</span>
          <strong>{formatPrice(totalCents)}</strong>
        </div>
      </div>

      {errorMsg && <p className="ep-status ep-error">{errorMsg}</p>}

      <button className="ep-primary-button" onClick={handleConfirm} disabled={status === 'processing'}>
        {status === 'processing' ? 'A processar pagamento simulado...' : 'Confirmar pagamento (simulado)'}
      </button>
      <p className="ep-disclaimer">
        Pagamento simulado apenas para fins de demonstração — nenhuma cobrança real é feita.
      </p>
    </div>
  );
}
