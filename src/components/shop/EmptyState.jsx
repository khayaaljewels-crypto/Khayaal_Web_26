import { motion } from 'framer-motion';
import { HiOutlineMagnifyingGlass } from 'react-icons/hi2';
import GoldButton from '@/components/buttons/GoldButton';

export default function EmptyState({ onClearAll }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-24 text-center"
    >
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-beige">
        <HiOutlineMagnifyingGlass className="text-2xl text-gold" />
      </span>
      <h3 className="mt-6 font-heading text-xl text-brown">No products found</h3>
      <p className="mt-2 max-w-xs text-sm text-text/60">
        Try adjusting your filters or search terms to find what you're looking for.
      </p>
      <div className="mt-6">
        <GoldButton onClick={onClearAll} variant="outline">
          Clear All Filters
        </GoldButton>
      </div>
    </motion.div>
  );
}
