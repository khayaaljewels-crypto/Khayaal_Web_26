import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineChevronDown, HiOutlineArrowPath } from 'react-icons/hi2';
import { motion, AnimatePresence } from 'framer-motion';
import { useMyOrders } from '@/hooks/useMyOrders';
import { fetchProductsByIds } from '@/services/productsApi';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/utils/format';
import OrderStatusBadge from '@/components/account/OrderStatusBadge';
import Reveal from '@/components/animations/Reveal';
import ImageWithFallback from '@/components/ui/ImageWithFallback';

function OrderRow({ order }) {
  const [open, setOpen] = useState(false);
  const [notice, setNotice] = useState('');
  const [reordering, setReordering] = useState(false);
  const { addItem } = useCart();
  const navigate = useNavigate();

  const handleReorder = async () => {
    setReordering(true);
    try {
      const products = await fetchProductsByIds(order.items.map((item) => item.productId));
      const byId = new Map(products.map((p) => [p.id, p]));

      if (order.items.length === 1) {
        const product = byId.get(order.items[0].productId);
        if (product) {
          navigate(`/product/${product.slug}?qty=${order.items[0].quantity}`);
          return;
        }
      }

      let addedCount = 0;
      order.items.forEach((item) => {
        const product = byId.get(item.productId);
        if (product) {
          addItem(product, { quantity: item.quantity });
          addedCount += 1;
        }
      });

      if (addedCount === 0) {
        setNotice('These products are no longer available.');
        setTimeout(() => setNotice(''), 3000);
        return;
      }
      navigate('/cart');
    } catch {
      setNotice('Could not reorder right now — please try again.');
      setTimeout(() => setNotice(''), 3000);
    } finally {
      setReordering(false);
    }
  };

  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-white transition-shadow duration-300 hover:shadow-card">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full flex-col gap-4 p-5 text-left sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:p-6"
      >
        <div className="min-w-0">
          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-text/40">Order</p>
          <p className="mt-1 truncate font-heading text-lg text-brown sm:text-xl">{order.orderNumber}</p>
          <p className="text-xs text-text/50">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
        </div>
        <div className="flex w-full items-center justify-between gap-3 sm:w-auto sm:justify-end">
          <OrderStatusBadge status={order.status} />
          <div className="min-w-0 text-right">
            <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-text/40">Total</p>
            <p className="mt-0.5 whitespace-nowrap font-heading text-base text-brown sm:text-lg">{formatPrice(order.grandTotal)}</p>
          </div>
          <motion.span animate={{ rotate: open ? 180 : 0 }} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border text-text/50">
            <HiOutlineChevronDown />
          </motion.span>
        </div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-border"
          >
            <div className="space-y-3 p-5 sm:p-6">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center gap-3 rounded-xl bg-bg p-3 sm:gap-4">
                  <ImageWithFallback src={item.image} alt={item.name} loading="lazy" className="h-14 w-14 shrink-0 rounded-lg object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-brown">{item.name}</p>
                    <p className="text-xs text-text/50">Qty: {item.quantity}</p>
                  </div>
                  <p className="shrink-0 text-sm font-medium text-brown">{formatPrice(item.lineTotal)}</p>
                </div>
              ))}
              {order.notes && <p className="rounded-xl border border-border bg-beige/50 px-3 py-2.5 text-xs leading-relaxed text-text/60"><span className="font-medium text-brown">Notes: </span>{order.notes}</p>}
              <div className="flex flex-col items-start gap-2 pt-2 sm:flex-row sm:items-center sm:gap-3">
                <button
                  onClick={handleReorder}
                  disabled={reordering}
                  className="flex min-h-11 items-center gap-1.5 rounded-full bg-brown px-5 py-2 text-xs font-medium text-white transition-colors hover:bg-gold disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <HiOutlineArrowPath /> {reordering ? 'Adding…' : 'Order Again'}
                </button>
                {notice && <span className="max-w-full text-xs leading-relaxed text-red-500">{notice}</span>}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
}

export default function OrderHistory() {
  const { orders, loading, error } = useMyOrders();

  return (
    <section aria-labelledby="order-history-heading">
      <Reveal>
        <div className="border-b border-border pb-4">
          <p className="eyebrow">Your Purchases</p>
          <h1 id="order-history-heading" className="mt-2 font-heading text-2xl text-brown">Order History</h1>
        </div>
      </Reveal>
      <div className="mt-6 space-y-4">
        {loading && <p className="rounded-xl border border-border bg-white px-4 py-3 text-sm text-text/50">Loading your orders...</p>}
        {error && <p className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-500">{error}</p>}
        {!loading && orders.length === 0 && (
          <p className="rounded-2xl border border-border bg-white px-6 py-12 text-center text-sm leading-relaxed text-text/50 sm:py-14">
            You haven't placed any orders yet.
          </p>
        )}
        {orders.map((o) => <OrderRow key={o.id} order={o} />)}
      </div>
    </section>
  );
}
