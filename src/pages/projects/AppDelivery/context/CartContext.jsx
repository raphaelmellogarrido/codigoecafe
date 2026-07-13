// src/pages/projects/AppDelivery/context/CartContext.jsx
// Carrinho simples de um único restaurante por vez (regra comum em apps de delivery):
// ao adicionar um item de outro restaurante, o carrinho anterior é substituído.

import { createContext, useContext, useMemo, useState } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [restaurantId, setRestaurantId] = useState(null);
  const [items, setItems] = useState([]);
  const [lastOrder, setLastOrder] = useState(null);

  function addItem(restaurant, item) {
    setItems((prev) => {
      const base = restaurantId === restaurant.id ? prev : [];
      const existing = base.find((i) => i.id === item.id);
      if (existing) {
        return base.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [...base, { ...item, quantity: 1 }];
    });
    setRestaurantId(restaurant.id);
  }

  function updateQuantity(itemId, quantity) {
    if (quantity < 1) return;
    setItems((prev) => prev.map((i) => (i.id === itemId ? { ...i, quantity } : i)));
  }

  function removeItem(itemId) {
    setItems((prev) => prev.filter((i) => i.id !== itemId));
  }

  function placeOrder(restaurant) {
    const order = {
      restaurant,
      items,
      totalCents: items.reduce((sum, i) => sum + i.price_cents * i.quantity, 0),
      placedAt: Date.now(),
    };
    setLastOrder(order);
    setItems([]);
    setRestaurantId(null);
    return order;
  }

  const totalCents = useMemo(
    () => items.reduce((sum, i) => sum + i.price_cents * i.quantity, 0),
    [items]
  );
  const itemCount = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items]);

  return (
    <CartContext.Provider
      value={{
        restaurantId,
        items,
        addItem,
        updateQuantity,
        removeItem,
        totalCents,
        itemCount,
        placeOrder,
        lastOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
