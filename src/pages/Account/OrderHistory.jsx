import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HiOutlineChevronDown,
  HiOutlineArrowPath,
} from 'react-icons/hi2';
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

  const orderDate = new Date(order.createdAt).toLocaleDateString(
    'en-IN',
    {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }
  );

  const handleReorder = async () => {
    setReordering(true);

    try {
      const products = await fetchProductsByIds(
        order.items.map((item) => item.productId)
      );

      const byId = new Map(
        products.map((product) => [product.id, product])
      );

      // Single product order
      if (order.items.length === 1) {
        const product = byId.get(order.items[0].productId);

        if (product) {
          navigate(
            `/product/${product.slug}?qty=${order.items[0].quantity}`
          );
          return;
        }
      }

      // Multiple products
      let addedCount = 0;

      order.items.forEach((item) => {
        const product = byId.get(item.productId);

        if (product) {
          addItem(product, {
            quantity: item.quantity,
          });

          addedCount += 1;
        }
      });

      if (addedCount === 0) {
        setNotice('These products are no longer available.');

        setTimeout(() => {
          setNotice('');
        }, 3000);

        return;
      }

      navigate('/cart');
    } catch {
      setNotice(
        'Could not reorder right now — please try again.'
      );

      setTimeout(() => {
        setNotice('');
      }, 3000);
    } finally {
      setReordering(false);
    }
  };

  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-white transition-all duration-300 hover:shadow-card">
      {/* Order summary */}
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="group flex w-full flex-col gap-5 p-5 text-left sm:p-6 lg:flex-row lg:items-center lg:justify-between"
      >
        {/* Order information */}
        <div className="min-w-0">
          <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-text/40">
            Order
          </p>

          <p className="mt-1 truncate font-heading text-xl text-brown sm:text-2xl">
            {order.orderNumber}
          </p>

          <p className="mt-1 text-xs text-text/50">
            Placed on {orderDate}
          </p>
        </div>

        {/* Summary information */}
        <div className="flex w-full items-center justify-between gap-4 sm:gap-6 lg:w-auto lg:justify-end">
          {/* Status */}
          <div className="min-w-0">
            <p className="mb-1 text-[9px] font-medium uppercase tracking-[0.18em] text-text/35">
              Status
            </p>

            <OrderStatusBadge status={order.status} />
          </div>

          {/* Total */}
          <div className="text-right">
            <p className="text-[9px] font-medium uppercase tracking-[0.18em] text-text/35">
              Total
            </p>

            <p className="mt-1 whitespace-nowrap font-heading text-lg text-brown sm:text-xl">
              {formatPrice(order.grandTotal)}
            </p>
          </div>

          {/* Expand */}
          <motion.span
            animate={{
              rotate: open ? 180 : 0,
            }}
            transition={{
              duration: 0.25,
            }}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border text-text/50 transition-colors group-hover:border-gold group-hover:text-brown"
          >
            <HiOutlineChevronDown className="text-base" />
          </motion.span>
        </div>
      </button>

      {/* Expanded order */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{
              height: 0,
              opacity: 0,
            }}
            animate={{
              height: 'auto',
              opacity: 1,
            }}
            exit={{
              height: 0,
              opacity: 0,
            }}
            transition={{
              duration: 0.3,
              ease: 'easeInOut',
            }}
            className="overflow-hidden border-t border-border"
          >
            <div className="space-y-5 p-5 sm:p-6">
              {/* Items heading */}
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-text/40">
                  Order Items
                </p>

                <p className="text-xs text-text/40">
                  {order.items.length}{' '}
                  {order.items.length === 1 ? 'item' : 'items'}
                </p>
              </div>

              {/* Products */}
              <div className="space-y-2.5">
                {order.items.map((item, index) => (
                  <div
                    key={`${item.productId}-${index}`}
                    className="flex min-w-0 items-center gap-3 rounded-xl border border-border/70 bg-bg/60 p-3 sm:gap-4 sm:p-3.5"
                  >
                    {/* Product image */}
                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-white sm:h-16 sm:w-16">
                      <ImageWithFallback
                        src={item.image}
                        alt={item.name}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    </div>

                    {/* Product information */}
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-sm font-medium leading-5 text-brown">
                        {item.name}
                      </p>

                      <p className="mt-1 text-xs text-text/50">
                        Quantity: {item.quantity}
                      </p>
                    </div>

                    {/* Item total */}
                    <p className="shrink-0 text-right text-sm font-medium text-brown sm:text-base">
                      {formatPrice(item.lineTotal)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Notes */}
              {order.notes && (
                <div className="rounded-xl border border-border bg-beige/40 px-4 py-3">
                  <p className="text-[9px] font-medium uppercase tracking-[0.18em] text-text/40">
                    Notes
                  </p>

                  <p className="mt-1.5 text-xs leading-relaxed text-text/65">
                    {order.notes}
                  </p>
                </div>
              )}

              {/* Bottom actions */}
              <div className="flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center">
                <button
                  type="button"
                  onClick={handleReorder}
                  disabled={reordering}
                  className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-brown px-6 py-3 text-xs font-medium text-white transition-all duration-200 hover:bg-gold disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                  <HiOutlineArrowPath
                    className={reordering ? 'animate-spin' : ''}
                  />

                  {reordering ? 'Adding…' : 'Order Again'}
                </button>

                {notice && (
                  <p className="text-xs leading-relaxed text-red-500">
                    {notice}
                  </p>
                )}
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
    <section
      aria-labelledby="order-history-heading"
      className="w-full"
    >
      {/* Header */}
      <Reveal>
        <div className="border-b border-border pb-5 sm:pb-6">
          <p className="eyebrow">
            Your Purchases
          </p>

          <h1
            id="order-history-heading"
            className="mt-2 font-heading text-2xl text-brown sm:text-3xl"
          >
            Order History
          </h1>

          {!loading && orders.length > 0 && (
            <p className="mt-2 text-sm text-text/50">
              {orders.length}{' '}
              {orders.length === 1 ? 'order' : 'orders'} placed
            </p>
          )}
        </div>
      </Reveal>

      {/* Orders */}
      <div className="mt-6 space-y-3 sm:mt-7 sm:space-y-4">
        {/* Loading */}
        {loading && (
          <div className="rounded-2xl border border-border bg-white p-6">
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 animate-pulse rounded-full bg-gold" />

              <p className="text-sm text-text/50">
                Loading your orders...
              </p>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="rounded-2xl border border-red-100 bg-red-50/60 px-5 py-4">
            <p className="text-sm leading-relaxed text-red-500">
              {error}
            </p>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && orders.length === 0 && (
          <div className="rounded-2xl border border-border bg-white px-6 py-14 text-center sm:py-16">
            <p className="font-heading text-xl text-brown">
              No orders yet
            </p>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-text/50">
              You haven't placed any orders yet. Your purchases
              will appear here once you complete an order.
            </p>
          </div>
        )}

        {/* Order list */}
        {!loading &&
          orders.map((order) => (
            <OrderRow
              key={order.id}
              order={order}
            />
          ))}
      </div>
    </section>
  );
}