// src/pages/projects/JulimarDental/CartContext.jsx
// Estado global do carrinho de orçamento via Context API, persistido em
// localStorage. Qualquer componente acede via useCart().

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getCartSubtotal } from './whatsapp.js';

const CartContext = createContext(null);
const STORAGE_KEY = 'julimar-dental-cart';

function loadInitialItems() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadInitialItems);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  // Se o produto já está no carrinho, soma 1 à quantidade; senão cria um
  // item novo com quantidade 1.
  const addToCart = useCallback((product) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        return prev.map((item) =>
          item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prev,
        { productId: product.id, name: product.name, unitPrice: product.price, image: product.image, quantity: 1 },
      ];
    });
  }, []);

  const updateQuantity = useCallback((productId, quantity) => {
    setItems((prev) =>
      prev.map((item) => (item.productId === productId ? { ...item, quantity: Math.max(1, quantity) } : item))
    );
  }, []);

  const removeItem = useCallback((productId) => {
    setItems((prev) => prev.filter((item) => item.productId !== productId));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const itemCount = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);
  const cartTotal = useMemo(() => getCartSubtotal(items), [items]);

  const value = useMemo(
    () => ({ items, itemCount, cartTotal, addToCart, updateQuantity, removeItem, clearCart }),
    [items, itemCount, cartTotal, addToCart, updateQuantity, removeItem, clearCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart deve ser usado dentro de <CartProvider>');
  return ctx;
}
