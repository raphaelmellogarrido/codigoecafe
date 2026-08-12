// src/pages/projects/Pizzaria/DrinksGrid.jsx
// Seção "Bebidas" navegável pelas abas do cardápio — grid de cards, cada um
// com foto, seletor de tamanho, quantidade e botão de adicionar ao carrinho.
// Substitui o antigo DrinkModal (popup pré-checkout).

import { useState } from 'react';
import { DRINKS } from './menuData.js';
import { formatBRL } from './pricing.js';
import { useCart } from './CartContext.jsx';

function DrinkCard({ drink }) {
  const { addDrinkToCart } = useCart();
  const [sizeKey, setSizeKey] = useState(drink.sizes[0].key);
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

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
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  }

  return (
    <article className="pz-card">
      <img className="pz-card-image" src={drink.image} alt={drink.name} loading="lazy" />
      <div className="pz-card-body">
        <div className="pz-card-header">
          <h3 className="pz-card-name">{drink.name}</h3>
          <span className="pz-card-price">{formatBRL(selectedSize.price)}</span>
        </div>

        {drink.sizes.length > 1 ? (
          <label className="pz-field">
            <span>Tamanho</span>
            <select value={sizeKey} onChange={(e) => setSizeKey(e.target.value)}>
              {drink.sizes.map((s) => (
                <option key={s.key} value={s.key}>{s.label}</option>
              ))}
            </select>
          </label>
        ) : (
          <p className="pz-card-ingredients">{selectedSize.label}</p>
        )}

        <div className="pz-quantity">
          <button type="button" onClick={() => setQuantity((q) => Math.max(1, q - 1))} aria-label="Diminuir quantidade">-</button>
          <span>{quantity}</span>
          <button type="button" onClick={() => setQuantity((q) => q + 1)} aria-label="Aumentar quantidade">+</button>
        </div>

        <button type="button" className="pz-button pz-button-primary" onClick={handleAdd}>
          {justAdded ? 'Adicionada!' : 'Enviar para o carrinho'}
        </button>
      </div>
    </article>
  );
}

export default function DrinksGrid() {
  return (
    <div className="pz-menu-grid">
      {DRINKS.map((drink) => (
        <DrinkCard key={drink.id} drink={drink} />
      ))}
    </div>
  );
}
