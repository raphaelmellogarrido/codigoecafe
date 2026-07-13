// src/pages/projects/AppDelivery/MenuScreen.jsx

import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { HiArrowLeft } from 'react-icons/hi';
import { findRestaurant } from './data';
import { useCart } from './context/CartContext';
import { formatPrice } from './format';

export default function MenuScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const restaurant = findRestaurant(id);
  const { addItem, restaurantId } = useCart();
  const [addedId, setAddedId] = useState(null);

  if (!restaurant) {
    return (
      <div className="dl-empty">
        <p>Restaurante não encontrado.</p>
        <Link to="/projetos/app-delivery" className="dl-primary-button">Voltar</Link>
      </div>
    );
  }

  function handleAdd(item) {
    addItem(restaurant, item);
    setAddedId(item.id);
    setTimeout(() => setAddedId(null), 1000);
  }

  return (
    <div>
      <button className="dl-back-inline" onClick={() => navigate(-1)}>
        <HiArrowLeft /> Voltar
      </button>

      <div
        className="dl-restaurant-banner"
        style={{ backgroundImage: `${restaurant.gradient}, url(${restaurant.image})` }}
      />
      <h1 className="dl-menu-title">{restaurant.name}</h1>
      <p className="dl-menu-subtitle">{restaurant.category} · {restaurant.eta}</p>

      {restaurantId && restaurantId !== restaurant.id && (
        <p className="dl-status-warning">
          O teu carrinho tem itens de outro restaurante — ao adicionar algo aqui, ele será substituído.
        </p>
      )}

      <div className="dl-menu-list">
        {restaurant.menu.map((item) => (
          <div key={item.id} className="dl-menu-row">
            <div>
              <h3>{item.name}</h3>
              <span>{formatPrice(item.price_cents)}</span>
            </div>
            <button className="dl-add-button" onClick={() => handleAdd(item)}>
              {addedId === item.id ? 'Adicionado ✓' : 'Adicionar'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
