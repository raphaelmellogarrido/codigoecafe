// src/pages/projects/EcommercePlatform/ShopPage.jsx
// Catálogo: busca os produtos reais da API (tabela SQLite) e permite adicionar ao carrinho.

import { useEffect, useState } from 'react';
import { API_BASE } from '../../../lib/apiBase';
import { useCart } from './context/CartContext';
import { formatPrice } from './format';

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addedId, setAddedId] = useState(null);
  const { addItem } = useCart();

  useEffect(() => {
    fetch(`${API_BASE}/api/products`)
      .then((r) => r.json())
      .then(setProducts)
      .catch(() =>
        setError('Não foi possível ligar à API. Corre "npm run server" (ou "npm run dev:full") num terminal.')
      )
      .finally(() => setLoading(false));
  }, []);

  function handleAdd(product) {
    addItem(product);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1200);
  }

  return (
    <div>
      <header className="ep-header">
        <h1>Equipamento para o teu setup</h1>
        <p>Catálogo servido por uma API Node.js/Express, com dados persistidos em SQLite.</p>
      </header>

      {loading && <p className="ep-status">A carregar produtos...</p>}
      {error && <p className="ep-status ep-error">{error}</p>}

      <div className="ep-grid">
        {products.map((product) => (
          <div key={product.id} className="ep-product-card">
            <div
              className="ep-product-thumb"
              style={{ backgroundImage: `${product.gradient}, url(${product.image})` }}
            />
            <div className="ep-product-body">
              <span className="ep-product-category">{product.category}</span>
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <div className="ep-product-footer">
                <span className="ep-product-price">{formatPrice(product.price_cents)}</span>
                <button
                  className="ep-add-button"
                  onClick={() => handleAdd(product)}
                  disabled={product.stock < 1}
                >
                  {product.stock < 1 ? 'Esgotado' : addedId === product.id ? 'Adicionado ✓' : 'Adicionar'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
