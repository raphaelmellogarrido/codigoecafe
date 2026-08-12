// src/pages/projects/Pizzaria/PizzaCard.jsx
// Card de um sabor de pizza: foto, tamanho, opção de metade/metade, quantidade
// e botão de enviar para o carrinho. Edição de ingredientes NÃO acontece aqui —
// só dentro do carrinho (CartDrawer).

import { useState } from 'react';
import { PIZZAS, SIZES, getPizzaById } from './menuData.js';
import { getPizzaItemUnitPrice, formatBRL } from './pricing.js';
import { useCart } from './CartContext.jsx';

export default function PizzaCard({ pizza }) {
  const { addPizzaToCart } = useCart();
  const [sizeKey, setSizeKey] = useState(SIZES[0].key);
  const [hasSecondHalf, setHasSecondHalf] = useState(false);
  const [secondPizzaId, setSecondPizzaId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  const otherPizzas = PIZZAS.filter((p) => p.id !== pizza.id && p.category === pizza.category);

  const previewItem = {
    type: 'pizza',
    sizeKey,
    half1: { pizzaId: pizza.id, added: [] },
    half2: hasSecondHalf && secondPizzaId ? { pizzaId: secondPizzaId, added: [] } : null,
  };
  const unitPrice = getPizzaItemUnitPrice(previewItem);

  function handleToggleSecondHalf() {
    setHasSecondHalf((prev) => {
      const next = !prev;
      if (!next) {
        setSecondPizzaId('');
      } else if (!secondPizzaId && otherPizzas.length > 0) {
        setSecondPizzaId(otherPizzas[0].id);
      }
      return next;
    });
  }

  function handleAddToCart() {
    addPizzaToCart({
      sizeKey,
      half1PizzaId: pizza.id,
      half2PizzaId: hasSecondHalf ? secondPizzaId : null,
      quantity,
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  }

  return (
    <article className="pz-card">
      {hasSecondHalf && secondPizzaId ? (
        <div className="pz-card-image pz-card-image-split">
          <div className="pz-card-image-half" style={{ backgroundImage: `url(${pizza.image})` }} />
          <div
            className="pz-card-image-half"
            style={{ backgroundImage: `url(${getPizzaById(secondPizzaId).image})` }}
          />
        </div>
      ) : (
        <img className="pz-card-image" src={pizza.image} alt={pizza.name} loading="lazy" />
      )}
      <div className="pz-card-body">
        <div className="pz-card-header">
          <h3 className="pz-card-name">{pizza.name}</h3>
          <span className="pz-card-price">{formatBRL(unitPrice)}</span>
        </div>
        <p className="pz-card-ingredients">{pizza.ingredients.join(', ')}</p>

        <label className="pz-field">
          <span>Tamanho</span>
          <select value={sizeKey} onChange={(e) => setSizeKey(e.target.value)}>
            {SIZES.map((s) => (
              <option key={s.key} value={s.key}>
                {s.label} - {s.cm} cm
              </option>
            ))}
          </select>
        </label>

        <label className="pz-checkbox">
          <input type="checkbox" checked={hasSecondHalf} onChange={handleToggleSecondHalf} />
          <span>Escolher a outra metade</span>
        </label>

        {hasSecondHalf && (
          <label className="pz-field">
            <span>Segunda metade</span>
            <select value={secondPizzaId} onChange={(e) => setSecondPizzaId(e.target.value)}>
              {otherPizzas.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </label>
        )}

        <div className="pz-quantity">
          <button type="button" onClick={() => setQuantity((q) => Math.max(1, q - 1))} aria-label="Diminuir quantidade">-</button>
          <span>{quantity}</span>
          <button type="button" onClick={() => setQuantity((q) => q + 1)} aria-label="Aumentar quantidade">+</button>
        </div>

        <button type="button" className="pz-button pz-button-primary" onClick={handleAddToCart}>
          {justAdded ? 'Adicionado!' : 'Enviar para o carrinho'}
        </button>
      </div>
    </article>
  );
}
