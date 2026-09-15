import { createContext, useContext, useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { restaurantInfo } from '../data/restaurantInfo';

const CartContext = createContext(null);
const STORAGE_KEY = 'zaytoun_cart';

function readStoredCart() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    // Corrupted storage shouldn't crash the app — start fresh instead.
    return [];
  }
}

// Two cart lines count as "the same line" only if the dish AND its
// customizations match — a spicy version of a dish is a distinct line
// from the mild version, each with its own quantity.
function sameLine(a, b) {
  return a.dishId === b.dishId && a.customizationKey === b.customizationKey;
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(readStoredCart);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [toast, setToast] = useState(null); // { message } | null
  const toastTimer = useRef(null);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const showToast = useCallback((message) => {
    setToast({ message, id: Date.now() });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2800);
  }, []);

  useEffect(() => () => toastTimer.current && clearTimeout(toastTimer.current), []);

  const addItem = useCallback(
    (dish, options = {}) => {
      const { quantity = 1, customizations = [], notes = '' } = options;
      const customizationKey = JSON.stringify({ customizations: customizations.slice().sort(), notes });
      const line = {
        lineId: `${dish.id}__${customizationKey}`,
        dishId: dish.id,
        name: dish.name,
        price: dish.price,
        image: dish.image,
        customizations,
        notes,
        customizationKey,
        quantity,
      };

      setItems((prev) => {
        const existingIndex = prev.findIndex((it) => sameLine(it, line));
        if (existingIndex === -1) return [...prev, line];
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity,
        };
        return next;
      });

      showToast(dish.name);
    },
    [showToast]
  );

  const removeItem = useCallback((lineId) => {
    setItems((prev) => prev.filter((it) => it.lineId !== lineId));
  }, []);

  const updateQuantity = useCallback((lineId, quantity) => {
    setItems((prev) => {
      if (quantity <= 0) return prev.filter((it) => it.lineId !== lineId);
      return prev.map((it) => (it.lineId === lineId ? { ...it, quantity } : it));
    });
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);
  const toggleCart = useCallback(() => setIsCartOpen((prev) => !prev), []);

  // Checkout is a separate modal from the cart drawer so the drawer's
  // "Proceed to Checkout" button can hand off to it directly.
  const openCheckout = useCallback(() => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  }, []);
  const closeCheckout = useCallback(() => setIsCheckoutOpen(false), []);

  const totals = useMemo(() => {
    const itemCount = items.reduce((sum, it) => sum + it.quantity, 0);
    const subtotal = items.reduce((sum, it) => sum + it.price * it.quantity, 0);
    const deliveryFee = itemCount > 0 ? restaurantInfo.deliveryFee : 0;
    const tax = subtotal * restaurantInfo.taxRate;
    const total = subtotal + deliveryFee + tax;
    return { itemCount, subtotal, deliveryFee, tax, total };
  }, [items]);

  const value = useMemo(
    () => ({
      items,
      ...totals,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      isCartOpen,
      openCart,
      closeCart,
      toggleCart,
      isCheckoutOpen,
      openCheckout,
      closeCheckout,
      toast,
    }),
    [
      items,
      totals,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      isCartOpen,
      openCart,
      closeCart,
      toggleCart,
      isCheckoutOpen,
      openCheckout,
      closeCheckout,
      toast,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
}
