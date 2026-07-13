// src/pages/projects/EcommercePlatform/OrdersPage.jsx
// Histórico de encomendas do utilizador autenticado, vindo do SQLite via GET /api/orders.

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { API_BASE } from '../../../lib/apiBase';
import { useAuth } from './context/AuthContext';
import { formatPrice } from './format';

export default function OrdersPage() {
  const { token, user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    fetch(`${API_BASE}/api/orders`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then(setOrders)
      .finally(() => setLoading(false));
  }, [token]);

  if (!user) {
    return (
      <div className="ep-empty">
        <p>Precisas de iniciar sessão para ver os teus pedidos.</p>
        <Link to="/projetos/ecommerce-platform/entrar" className="ep-primary-button">
          Entrar ou criar conta
        </Link>
      </div>
    );
  }

  return (
    <div>
      <header className="ep-header">
        <h1>Os meus pedidos</h1>
      </header>

      {loading && <p className="ep-status">A carregar...</p>}

      {!loading && orders.length === 0 && <p className="ep-status">Ainda não tens nenhuma encomenda.</p>}

      <div className="ep-orders-list">
        {orders.map((order) => (
          <div key={order.id} className="ep-order-card">
            <div className="ep-order-header">
              <span>Encomenda #{order.id}</span>
              <span>{new Date(order.created_at).toLocaleString('pt-PT')}</span>
            </div>
            <ul>
              {order.items.map((item, i) => (
                <li key={i}>
                  {item.quantity}x {item.name} — {formatPrice(item.unit_price_cents * item.quantity)}
                </li>
              ))}
            </ul>
            <div className="ep-order-footer">
              <span className="ep-order-status">{order.status}</span>
              <strong>{formatPrice(order.total_cents)}</strong>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
