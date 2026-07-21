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
          <div className="container-luxury grid grid-cols-3 gap-8 py-10 lg:grid-cols-9">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
              >
                <Link to={`/shop?category=${cat.slug}`} onClick={onClose} className="group block">
                  <div className="relative aspect-square overflow-hidden rounded-2xl bg-beige">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-brown/0 transition-colors duration-500 group-hover:bg-brown/10" />
                  </div>
                  <p className="mt-3 text-center font-heading text-sm text-brown group-hover:text-gold transition-colors">
                    {cat.name}
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
