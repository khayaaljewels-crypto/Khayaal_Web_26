import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useCategories } from '@/context/CategoriesContext';

export default function MegaMenu({ open, onClose }) {
  const { visibleCategories: categories } = useCategories();

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          onMouseLeave={onClose}
          className="absolute left-0 right-0 top-full z-40 border-t border-border bg-white/95 backdrop-blur-xl shadow-soft"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="container-luxury py-5">
            <div className="no-scrollbar flex gap-3 overflow-x-auto pb-1">
              {categories.map((cat, i) => (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.04 }}
                >
                  <Link
                    to={`/shop?category=${cat.slug}`}
                    onClick={onClose}
                    className="block shrink-0 whitespace-nowrap rounded-full border border-gold/35 bg-white px-5 py-3 text-[11px] font-medium uppercase tracking-[0.18em] text-brown transition-colors duration-300 hover:border-gold hover:bg-beige/40 hover:text-gold"
                  >
                    {cat.name}
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
