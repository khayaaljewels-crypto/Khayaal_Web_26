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
    <div className="rounded-2xl border border-border bg-white">
      <button onClick={() => setOpen((o) => !o)} className="flex w-full flex-wrap items-center justify-between gap-x-4 gap-y-2 p-5 text-left">
        <div>
          <p className="font-heading text-brown">{order.orderNumber}</p>
          <p className="text-xs text-text/50">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2.5 sm:gap-4">
          <OrderStatusBadge status={order.status} />
          <p className="font-medium text-brown">{formatPrice(order.grandTotal)}</p>
          <motion.span animate={{ rotate: open ? 180 : 0 }}><HiOutlineChevronDown className="text-text/40" /></motion.span>
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
            <div className="space-y-3 p-5">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <ImageWithFallback src={item.image} alt={item.name} className="h-12 w-12 rounded-lg object-cover" />
                  <div className="flex-1">
                    <p className="text-sm text-brown">{item.name}</p>
                    <p className="text-xs text-text/50">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-medium text-brown">{formatPrice(item.lineTotal)}</p>
                </div>
              ))}
              {order.notes && <p className="text-xs text-text/50">Notes: {order.notes}</p>}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={handleReorder}
                  disabled={reordering}
                  className="flex items-center gap-1.5 rounded-full bg-brown px-5 py-2 text-xs font-medium text-white hover:bg-gold disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <HiOutlineArrowPath /> {reordering ? 'Adding…' : 'Order Again'}
                </button>
                {notice && <span className="text-xs text-red-500">{notice}</span>}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function OrderHistory() {
  const { orders, loading, error } = useMyOrders();

  return (
    <div>
      <Reveal>
        <p className="font-heading text-lg text-brown">Order History</p>
      </Reveal>
      <div className="mt-6 space-y-4">
        {loading && <p className="text-sm text-text/50">Loading your orders...</p>}
        {error && <p className="text-sm text-red-500">{error}</p>}
        {!loading && orders.length === 0 && (
          <p className="rounded-2xl border border-border bg-white p-8 text-center text-sm text-text/50">
            You haven't placed any orders yet.
          </p>
        )}
        {orders.map((o) => <OrderRow key={o.id} order={o} />)}
      </div>
    </div>
  );
}
