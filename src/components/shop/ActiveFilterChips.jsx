import { AnimatePresence, motion } from 'framer-motion';
import { HiOutlineXMark } from 'react-icons/hi2';

export default function ActiveFilterChips({ chips, onRemove, onClearAll }) {
  if (!chips.length) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 pb-2">
      <AnimatePresence initial={false}>
        {chips.map((chip) => (
          <motion.button
            key={`${chip.key}-${chip.value ?? chip.label}`}
            layout
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => onRemove(chip.key, chip.value)}
            className="flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/10 px-3 py-1.5 text-xs font-medium capitalize text-brown transition-colors hover:bg-gold/20"
          >
            {chip.label}
            <HiOutlineXMark className="text-sm" />
          </motion.button>
        ))}
      </AnimatePresence>
      <button
        onClick={onClearAll}
        className="text-xs font-medium text-text/50 underline-offset-2 hover:text-gold hover:underline"
      >
        Clear All
      </button>
    </div>
  );
}
