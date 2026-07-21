import { motion } from 'framer-motion';
import { HiOutlineShoppingBag } from 'react-icons/hi2';
import GoldButton from '@/components/buttons/GoldButton';

export default function EmptyCart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center justify-center py-28 text-center"
    >
      <motion.span
        initial={{ scale: 0.8, rotate: -6 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.1 }}
        className="flex h-20 w-20 items-center justify-center rounded-full bg-beige"
      >
        <HiOutlineShoppingBag className="text-3xl text-gold" />
      </motion.span>
      <h2 className="mt-6 font-heading text-2xl text-brown">Your bag is empty</h2>
      <p className="mt-2 max-w-xs text-sm text-text/60">
        Looks like you haven't added anything yet. Explore our collections to find something you'll love.
      </p>
      <div className="mt-8">
        <GoldButton to="/shop">Continue Shopping</GoldButton>
      </div>
    </motion.div>
  );
}
