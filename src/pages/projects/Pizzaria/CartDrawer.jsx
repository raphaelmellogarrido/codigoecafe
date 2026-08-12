// src/pages/projects/Pizzaria/CartDrawer.jsx
// Painel lateral do carrinho: lista de itens, edição de ingredientes por
// metade, controles de quantidade/remoção, total e botão "Fazer pedido" que
// monta a mensagem e abre o WhatsApp.

import { useState } from 'react';
import { FaXmark } from 'react-icons/fa6';
import { EXTRA_INGREDIENTS, getSizeByKey } from './menuData.js';
import { getItemLineTotal, formatBRL } from './pricing.js';
import { buildWhatsappUrl } from './whatsapp.js';
import { useCart } from './CartContext.jsx';

function PizzaIngredientEditor({ item, halfNumber }) {
  const { toggleIngredientRemoved, addExtraIngredient, removeExtraIngredient } = useCart();
  const half = halfNumber === 1 ? item.half1 : item.half2;
  const [selectedExtra, setSelectedExtra] = useState(EXTRA_INGREDIENTS[0]);

  if (!half) return null;

  return (
    <div className="pz-ingredient-editor">
      <strong>{half.name}</strong>
      <ul className="pz-ingredient-list">
        {half.ingredients.map((ingredient) => {
          const isRemoved = half.removed.includes(ingredient);
          return (
            <li key={ingredient} className={isRemoved ? 'pz-ingredient-removed' : ''}>
              <button type="button" onClick={() => toggleIngredientRemoved(item.cartItemId, halfNumber, ingredient)}>
                {isRemoved ? '+ ' : '× '}{ingredient}
              </button>
            </li>
          );
        })}
        {half.added.map((ingredient) => (
          <li key={ingredient} className="pz-ingredient-added">
            <button type="button" onClick={() => removeExtraIngredient(item.cartItemId, halfNumber, ingredient)}>
              × + {ingredient}
            </button>
          </li>
        ))}
      </ul>
      <div className="pz-add-ingredient">
        <select value={selectedExtra} onChange={(e) => setSelectedExtra(e.target.value)}>
          {EXTRA_INGREDIENTS.map((ingredient) => (
            <option key={ingredient} value={ingredient}>{ingredient}</option>
          ))}
        </select>
        <button
          type="button"
          className="pz-button pz-button-secondary"
          onClick={() => addExtraIngredient(item.cartItemId, halfNumber, selectedExtra)}
        >
          + Adicionar (R$ 5,00)
        </button>
      </div>
    </div>
  );
}

function PizzaCartItem({ item }) {
  const { removeItem, updateItemQuantity } = useCart();
  const [isEditingIngredients, setIsEditingIngredients] = useState(false);
  const size = getSizeByKey(item.sizeKey);
  const flavorLabel = item.half2 ? `Metade ${item.half1.name} / Metade ${item.half2.name}` : item.half1.name;

  return (
    <div className="pz-cart-item">
      <div className="pz-cart-item-header">
        <div>
          <strong>{flavorLabel}</strong>
          <div className="pz-cart-item-size">{size.label} - {size.cm} cm</div>
        </div>
        <button type="button" className="pz-remove-button" onClick={() => removeItem(item.cartItemId)} aria-label="Remover item">
          <FaXmark />
        </button>
      </div>

      <div className="pz-quantity">
        <button type="button" onClick={() => updateItemQuantity(item.cartItemId, item.quantity - 1)} aria-label="Diminuir quantidade">-</button>
        <span>{item.quantity}</span>
        <button type="button" onClick={() => updateItemQuantity(item.cartItemId, item.quantity + 1)} aria-label="Aumentar quantidade">+</button>
      </div>

      <button type="button" className="pz-link-button" onClick={() => setIsEditingIngredients((v) => !v)}>
        {isEditingIngredients ? 'Fechar edição de ingredientes' : 'Editar ingredientes'}
      </button>

      {isEditingIngredients && (
        <div className="pz-ingredient-editors">
          <PizzaIngredientEditor item={item} halfNumber={1} />
          {item.half2 && <PizzaIngredientEditor item={item} halfNumber={2} />}
        </div>
      )}

      <div className="pz-cart-item-total">{formatBRL(getItemLineTotal(item))}</div>
    </div>
  );
}

function DrinkCartItem({ item }) {
  const { removeItem, updateItemQuantity } = useCart();

  return (
    <div className="pz-cart-item">
      <div className="pz-cart-item-header">
        <div>
          <strong>{item.name}</strong>
          <div className="pz-cart-item-size">{item.sizeLabel}</div>
        </div>
        <button type="button" className="pz-remove-button" onClick={() => removeItem(item.cartItemId)} aria-label="Remover item">
          <FaXmark />
        </button>
      </div>

      <div className="pz-quantity">
        <button type="button" onClick={() => updateItemQuantity(item.cartItemId, item.quantity - 1)} aria-label="Diminuir quantidade">-</button>
        <span>{item.quantity}</span>
        <button type="button" onClick={() => updateItemQuantity(item.cartItemId, item.quantity + 1)} aria-label="Aumentar quantidade">+</button>
      </div>

      <div className="pz-cart-item-total">{formatBRL(getItemLineTotal(item))}</div>
    </div>
  );
}

export default function CartDrawer({ isOpen, onClose }) {
  const { items, cartTotal } = useCart();

  if (!isOpen) return null;

  function handleCheckout() {
    const url = buildWhatsappUrl(items);
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  return (
    <div className="pz-drawer-overlay" onClick={onClose}>
      <aside className="pz-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="pz-drawer-header">
          <h2>Seu carrinho</h2>
          <button type="button" className="pz-remove-button" onClick={onClose} aria-label="Fechar carrinho">
            <FaXmark />
          </button>
        </div>

        {items.length === 0 ? (
          <p className="pz-cart-empty">Seu carrinho está vazio.</p>
        ) : (
          <div className="pz-cart-items">
            {items.map((item) =>
              item.type === 'pizza'
                ? <PizzaCartItem key={item.cartItemId} item={item} />
                : <DrinkCartItem key={item.cartItemId} item={item} />
            )}
          </div>
        )}

        <div className="pz-drawer-footer">
          <div className="pz-cart-total">Total: {formatBRL(cartTotal)}</div>
          <button
            type="button"
            className="pz-button pz-button-primary pz-button-block"
            onClick={handleCheckout}
            disabled={items.length === 0}
          >
            Fazer pedido
          </button>
        </div>
      </aside>
    </div>
  );
}
