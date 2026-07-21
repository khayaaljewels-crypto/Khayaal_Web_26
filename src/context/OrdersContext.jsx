import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getItemPrice } from './CartContext';

const OrdersContext = createContext(null);
const ORDERS_KEY = 'khayaal_orders';
const SEQ_KEY = 'khayaal_order_seq';

function readStored() {
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function nextOrderId() {
  const current = Number(localStorage.getItem(SEQ_KEY) ?? '0') + 1;
  localStorage.setItem(SEQ_KEY, String(current));
  return `KH${String(current).padStart(4, '0')}`;
}

export function OrdersProvider({ children }) {
  const [orders, setOrders] = useState(readStored);

  useEffect(() => {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  }, [orders]);

  const createOrder = ({ customer, items, subtotal, discount, shippingFee, grandTotal, coupon, notes }) => {
    const order = {
      id: nextOrderId(),
      createdAt: new Date().toISOString(),
      status: 'New',
      customer,
      items: items.map((item) => {
        const variant = item.variant ? item.product.variants?.find((v) => v.id === item.variant) : null;
        const price = getItemPrice(item);
        return {
          productId: item.product.id,
          name: item.product.name,
          image: item.product.images[0],
          quantity: item.quantity,
          variantLabel: variant?.label ?? null,
          price,
          lineTotal: price * item.quantity,
        };
      }),
      subtotal,
      discount,
      shippingFee,
      grandTotal,
      coupon,
      notes,
      internalNotes: [],
    };

    setOrders((prev) => [order, ...prev]);
    return order;
  };

  const updateOrderStatus = (id, status) =>
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));

  const addInternalNote = (id, note) =>
    setOrders((prev) =>
      prev.map((o) =>
        o.id === id
          ? { ...o, internalNotes: [...(o.internalNotes ?? []), { text: note, at: new Date().toISOString() }] }
          : o
      )
    );

  const deleteOrder = (id) => setOrders((prev) => prev.filter((o) => o.id !== id));

  const getOrderById = (id) => orders.find((o) => o.id === id) ?? null;

  const customers = useMemo(() => {
    const map = new Map();
    orders.forEach((o) => {
      const key = o.customer.phone;
      if (!map.has(key)) {
        map.set(key, {
          phone: key,
          name: o.customer.name,
          email: o.customer.email,
          whatsapp: o.customer.whatsapp,
          city: o.customer.city,
          state: o.customer.state,
          orders: [],
          totalSpent: 0,
        });
      }
      const c = map.get(key);
      c.orders.push(o);
      c.totalSpent += o.grandTotal;
      if (new Date(o.createdAt) > new Date(c.lastOrderAt ?? 0)) {
        c.lastOrderAt = o.createdAt;
        c.name = o.customer.name;
      }
    });
    return [...map.values()].sort((a, b) => new Date(b.lastOrderAt) - new Date(a.lastOrderAt));
  }, [orders]);

  const getCustomerByPhone = (phone) => customers.find((c) => c.phone === phone) ?? null;

  const value = {
    orders,
    createOrder,
    updateOrderStatus,
    addInternalNote,
    deleteOrder,
    getOrderById,
    customers,
    getCustomerByPhone,
  };

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
}

export function useOrders() {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error('useOrders must be used within an OrdersProvider');
  return ctx;
}
