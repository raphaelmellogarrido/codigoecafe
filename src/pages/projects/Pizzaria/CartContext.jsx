// src/pages/projects/Pizzaria/CartContext.jsx
// Estado global do carrinho da Pizzaria Mello's via Context API, persistido em
// localStorage. Qualquer componente acessa via useCart().

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getPizzaById } from './menuData.js';
import { getCartTotal } from './pricing.js';

const CartContext = createContext(null);
const STORAGE_KEY = 'pizzaria-mellos-cart';

function buildHalf(pizzaId) {
  const pizza = getPizzaById(pizzaId);
  return {
    pizzaId,
    name: pizza.name,
    ingredients: [...pizza.ingredients],
    removed: [],
    added: [],
  };
}

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

  const addPizzaToCart = useCallback(({ sizeKey, half1PizzaId, half2PizzaId = null, quantity }) => {
    setItems((prev) => [
      ...prev,
      {
        cartItemId: crypto.randomUUID(),
        type: 'pizza',
        sizeKey,
        quantity,
        half1: buildHalf(half1PizzaId),
        half2: half2PizzaId ? buildHalf(half2PizzaId) : null,
      },
    ]);
  }, []);

  const addDrinkToCart = useCallback(({ drinkId, name, sizeKey, sizeLabel, unitPrice, quantity }) => {
    setItems((prev) => [
      ...prev,
      { cartItemId: crypto.randomUUID(), type: 'drink', drinkId, name, sizeKey, sizeLabel, unitPrice, quantity },
    ]);
  }, []);

  const removeItem = useCallback((cartItemId) => {
    setItems((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  }, []);

  const updateItemQuantity = useCallback((cartItemId, quantity) => {
    setItems((prev) =>
      prev.map((item) => (item.cartItemId === cartItemId ? { ...item, quantity: Math.max(1, quantity) } : item))
    );
  }, []);

  const toggleIngredientRemoved = useCallback((cartItemId, halfNumber, ingredientName) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.cartItemId !== cartItemId || item.type !== 'pizza') return item;
        const key = halfNumber === 1 ? 'half1' : 'half2';
        const half = item[key];
        if (!half) return item;
        const isRemoved = half.removed.includes(ingredientName);
        const removed = isRemoved
          ? half.removed.filter((name) => name !== ingredientName)
          : [...half.removed, ingredientName];
        return { ...item, [key]: { ...half, removed } };
      })
    );
  }, []);

  const addExtraIngredient = useCallback((cartItemId, halfNumber, ingredientName) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.cartItemId !== cartItemId || item.type !== 'pizza') return item;
        const key = halfNumber === 1 ? 'half1' : 'half2';
        const half = item[key];
        if (!half || half.added.includes(ingredientName)) return item;
        return { ...item, [key]: { ...half, added: [...half.added, ingredientName] } };
      })
    );
  }, []);

  const removeExtraIngredient = useCallback((cartItemId, halfNumber, ingredientName) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.cartItemId !== cartItemId || item.type !== 'pizza') return item;
        const key = halfNumber === 1 ? 'half1' : 'half2';
        const half = item[key];
        if (!half) return item;
        return { ...item, [key]: { ...half, added: half.added.filter((name) => name !== ingredientName) } };
      })
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const itemCount = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);
  const cartTotal = useMemo(() => getCartTotal(items), [items]);

  const value = useMemo(
    () => ({
      items,
      itemCount,
      cartTotal,
      addPizzaToCart,
      addDrinkToCart,
      removeItem,
      updateItemQuantity,
      toggleIngredientRemoved,
      addExtraIngredient,
      removeExtraIngredient,
      clearCart,
    }),
    [
      items, itemCount, cartTotal, addPizzaToCart, addDrinkToCart, removeItem,
      updateItemQuantity, toggleIngredientRemoved, addExtraIngredient, removeExtraIngredient, clearCart,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart deve ser usado dentro de <CartProvider>');
  return ctx;
}
