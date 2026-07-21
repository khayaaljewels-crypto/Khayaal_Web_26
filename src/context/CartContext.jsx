import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext(null);

const STORAGE_KEY = 'khayaal_cart';
const SAVED_KEY = 'khayaal_saved_for_later';
const COUPON_KEY = 'khayaal_coupon';

export const COUPONS = {
  KHAYAAL10: { type: 'percent', value: 10, label: '10% off your order' },
  WELCOME200: { type: 'flat', value: 200, label: '₹200 off your order' },
};

const FREE_SHIPPING_THRESHOLD = 2999;
const SHIPPING_FEE = 99;

function readStored(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function getItemPrice(item) {
  const variant = item.variant ? item.product.variants?.find((v) => v.id === item.variant) : null;
  return item.product.price + (variant?.priceDelta ?? 0);
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => readStored(STORAGE_KEY));
  const [savedItems, setSavedItems] = useState(() => readStored(SAVED_KEY));
  const [couponCode, setCouponCode] = useState(() => {
    try {
      return localStorage.getItem(COUPON_KEY) ?? null;
    } catch {
      return null;
    }
  });
  const [couponError, setCouponError] = useState('');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem(SAVED_KEY, JSON.stringify(savedItems));
  }, [savedItems]);

  const addItem = (product, options = {}) => {
    const { quantity = 1, variant } = options;
    setItems((prev) => {
      const key = `${product.id}-${variant ?? 'default'}`;
      const existing = prev.find((item) => item.key === key);
      if (existing) {
        return prev.map((item) =>
          item.key === key ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { key, product, variant, quantity }];
    });
  };

  const removeItem = (key) => setItems((prev) => prev.filter((item) => item.key !== key));

  const updateQuantity = (key, quantity) =>
    setItems((prev) =>
      prev.map((item) => (item.key === key ? { ...item, quantity: Math.max(1, quantity) } : item))
    );

  const clearCart = () => setItems([]);

  const saveForLater = (key) => {
    setItems((prev) => {
      const item = prev.find((i) => i.key === key);
      if (item) setSavedItems((saved) => [...saved.filter((s) => s.key !== key), item]);
      return prev.filter((i) => i.key !== key);
    });
  };

  const moveToCart = (key) => {
    setSavedItems((prev) => {
      const item = prev.find((i) => i.key === key);
      if (item) {
        setItems((cartItems) => {
          const existing = cartItems.find((i) => i.key === key);
          if (existing) {
            return cartItems.map((i) => (i.key === key ? { ...i, quantity: i.quantity + item.quantity } : i));
          }
          return [...cartItems, item];
        });
      }
      return prev.filter((i) => i.key !== key);
    });
  };

  const removeSaved = (key) => setSavedItems((prev) => prev.filter((item) => item.key !== key));

  const applyCoupon = (code) => {
    const normalized = code.trim().toUpperCase();
    if (!COUPONS[normalized]) {
      setCouponError('Invalid or expired coupon code.');
      return false;
    }
    setCouponCode(normalized);
    setCouponError('');
    localStorage.setItem(COUPON_KEY, normalized);
    return true;
  };

  const removeCoupon = () => {
    setCouponCode(null);
    setCouponError('');
    localStorage.removeItem(COUPON_KEY);
  };

  const count = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);
  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + getItemPrice(item) * item.quantity, 0),
    [items]
  );

  const coupon = couponCode ? COUPONS[couponCode] : null;
  const discount = useMemo(() => {
    if (!coupon || subtotal === 0) return 0;
    return coupon.type === 'percent' ? Math.round((subtotal * coupon.value) / 100) : Math.min(coupon.value, subtotal);
  }, [coupon, subtotal]);

  const shippingFee = subtotal === 0 || subtotal - discount >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const grandTotal = Math.max(0, subtotal - discount) + shippingFee;

  const value = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    count,
    subtotal,
    savedItems,
    saveForLater,
    moveToCart,
    removeSaved,
    couponCode,
    coupon,
    couponError,
    applyCoupon,
    removeCoupon,
    discount,
    shippingFee,
    freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
    grandTotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
}
