// src/pages/projects/AppDelivery/TrackingScreen.jsx
// Acompanhamento do pedido "em tempo real": simulado localmente com um timer
// (sem Firebase/websocket), avançando o estado e a posição do estafeta no mapa.

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { DESTINATION } from './data';
import { useCart } from './context/CartContext';
import { formatPrice } from './format';
import DeliveryMap from './DeliveryMap';

const PREP_END = 8; // segundos
const TRAVEL_END = 32; // segundos
const STEPS = ['Pedido recebido', 'A preparar', 'A caminho', 'Entregue'];

export default function TrackingScreen() {
  const { lastOrder } = useCart();
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  if (!lastOrder) {
    return (
      <div className="dl-empty">
        <p>Ainda não fizeste nenhum pedido.</p>
        <Link to="/projetos/app-delivery" className="dl-primary-button">Ver restaurantes</Link>
      </div>
    );
  }

  const { restaurant, items, totalCents } = lastOrder;

  let stepIndex = 0;
  let progress = 0;
  if (elapsed >= TRAVEL_END) {
    stepIndex = 3;
    progress = 1;
  } else if (elapsed >= PREP_END) {
    stepIndex = 2;
    progress = (elapsed - PREP_END) / (TRAVEL_END - PREP_END);
  } else if (elapsed >= 2) {
    stepIndex = 1;
  }

  const remaining = Math.max(0, TRAVEL_END - elapsed);

  return (
    <div>
      <header className="dl-screen-header">
        <h1>{stepIndex === 3 ? 'Pedido entregue!' : 'A acompanhar o teu pedido'}</h1>
        <p>{restaurant.name}</p>
      </header>

      <DeliveryMap origin={restaurant.location} destination={DESTINATION} progress={progress} />

      <div className="dl-eta">
        {stepIndex === 3 ? 'Bom apetite! 🎉' : `Chegada estimada em ${remaining}s`}
      </div>

      <div className="dl-steps">
        {STEPS.map((label, i) => (
          <div key={label} className={`dl-step ${i <= stepIndex ? 'done' : ''}`}>
            <span className="dl-step-dot" />
            <span>{label}</span>
          </div>
        ))}
      </div>

      <div className="dl-order-summary">
        <h3>Resumo</h3>
        {items.map((item) => (
          <div key={item.id} className="dl-summary-row">
            <span>{item.quantity}x {item.name}</span>
            <span>{formatPrice(item.price_cents * item.quantity)}</span>
          </div>
        ))}
        <div className="dl-summary-row dl-summary-total">
          <span>Total</span>
          <strong>{formatPrice(totalCents)}</strong>
        </div>
      </div>
    </div>
  );
}
