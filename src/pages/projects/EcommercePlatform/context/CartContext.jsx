// src/pages/projects/EcommercePlatform/context/CartContext.jsx
// Carrinho guardado em localStorage (funciona mesmo sem sessão iniciada).
// Só ao finalizar a compra é que o conteúdo é enviado ao servidor.

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext(null);
const STORAGE_KEY = 'ecommerce-demo-cart';

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  function addItem(product) {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === product.id);
      if (existing) {
        return prev.map((i) =>
          i.productId === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          price_cents: product.price_cents,
          gradient: product.gradient,
          quantity: 1,
        },
      ];
    });
  }

  function updateQuantity(productId, quantity) {
    if (quantity < 1) return;
    setItems((prev) => prev.map((i) => (i.productId === productId ? { ...i, quantity } : i)));
  }

  function removeItem(productId) {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }

  function clearCart() {
    setItems([]);
  }

  const totalCents = useMemo(
    () => items.reduce((sum, i) => sum + i.price_cents * i.quantity, 0),
    [items]
  );
  const itemCount = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items]);

  return (
    <CartContext.Provider
      value={{ items, addItem, updateQuantity, removeItem, clearCart, totalCents, itemCount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
