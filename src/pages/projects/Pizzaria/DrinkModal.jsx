// src/pages/projects/Pizzaria/DrinkModal.jsx
// Modal "Quer uma bebida?" exibido uma vez, quando o cliente abre o carrinho
// para finalizar o pedido. Permite adicionar uma ou mais bebidas, ou pular.

import { useState } from 'react';
import { DRINKS } from './menuData.js';
import { useCart } from './CartContext.jsx';

function DrinkRow({ drink }) {
  const { addDrinkToCart } = useCart();
  const [sizeKey, setSizeKey] = useState(drink.sizes[0].key);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const selectedSize = drink.sizes.find((s) => s.key === sizeKey);

  function handleAdd() {
    addDrinkToCart({
      drinkId: drink.id,
      name: drink.name,
      sizeKey: selectedSize.key,
      sizeLabel: selectedSize.label,
      unitPrice: selectedSize.price,
      quantity,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div className="pz-drink-row">
      <img src={drink.image} alt={drink.name} loading="lazy" />
      <div className="pz-drink-info">
        <span className="pz-drink-name">{drink.name}</span>
        {drink.sizes.length > 1 ? (
          <select value={sizeKey} onChange={(e) => setSizeKey(e.target.value)}>
            {drink.sizes.map((s) => (
              <option key={s.key} value={s.key}>{s.label}</option>
            ))}
          </select>
        ) : (
          <span className="pz-drink-size">{selectedSize.label}</span>
        )}
      </div>
      <div className="pz-quantity">
        <button type="button" onClick={() => setQuantity((q) => Math.max(1, q - 1))} aria-label="Diminuir quantidade">-</button>
        <span>{quantity}</span>
        <button type="button" onClick={() => setQuantity((q) => q + 1)} aria-label="Aumentar quantidade">+</button>
      </div>
      <button type="button" className="pz-button pz-button-secondary" onClick={handleAdd}>
        {added ? 'Adicionada!' : 'Adicionar'}
      </button>
    </div>
  );
}

export default function DrinkModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="pz-modal-overlay" role="dialog" aria-modal="true">
      <div className="pz-modal">
        <h2>Quer uma bebida com o seu pedido?</h2>
        <div className="pz-drink-list">
          {DRINKS.map((drink) => (
            <DrinkRow key={drink.id} drink={drink} />
          ))}
        </div>
        <button type="button" className="pz-button pz-button-primary" onClick={onClose}>
          Continuar
        </button>
      </div>
    </div>
  );
}
