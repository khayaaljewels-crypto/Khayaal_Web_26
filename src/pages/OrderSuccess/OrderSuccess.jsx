import { useEffect, useRef } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaWhatsapp } from 'react-icons/fa';
import GoldButton from '@/components/buttons/GoldButton';
import { formatPrice } from '@/utils/format';
import { useCart } from '@/context/CartContext';

export default function OrderSuccess() {
  const { state } = useLocation();
  const { clearCart } = useCart();
  const cleared = useRef(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (state?.order && !cleared.current) {
      cleared.current = true;
      clearCart();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!state?.order) return <Navigate to="/" replace />;

  const { order } = state;

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4 pb-24 pt-28 lg:pt-32">
      <div className="w-full max-w-lg text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 14, delay: 0.1 }}
          className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gold/10"
        >
          <motion.svg viewBox="0 0 52 52" className="h-14 w-14">
            <motion.circle
              cx="26"
              cy="26"
              r="24"
              fill="none"
              stroke="#B8864A"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            />
            <motion.path
              d="M14 27l7 7 17-17"
              fill="none"
              stroke="#B8864A"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: 1 }}
            />
          </motion.svg>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.6 }}>
          <p className="mt-8 eyebrow">Order Sent Successfully</p>
          <h1 className="mt-3 font-heading text-3xl text-brown sm:text-4xl">Thank You, {order.customer.name.split(' ')[0]}</h1>
          <p className="mt-4 text-sm text-text/60">
            Your order <span className="font-medium text-brown">{order.id}</span> for{' '}
            <span className="font-medium text-brown">{formatPrice(order.grandTotal)}</span> has been sent to our
            WhatsApp business number. Our team will confirm your order and payment details there shortly.
          </p>

          <div className="mt-6 flex items-center justify-center gap-2 rounded-full bg-[#25D366]/10 px-5 py-3 text-sm text-[#1ea952]">
            <FaWhatsapp />
            Check your WhatsApp for order confirmation
          </div>

          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <GoldButton to="/shop">Continue Shopping</GoldButton>
            <Link to="/track-order" className="text-sm font-medium text-gold underline-offset-4 hover:underline">
              Track Your Order
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
