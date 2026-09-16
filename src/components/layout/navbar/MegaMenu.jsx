import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useCategories } from '@/context/CategoriesContext';

export default function MegaMenu() {
  const { visibleCategories: categories } = useCategories();

  return (
    <section className="bg-bg py-8 sm:py-10 lg:py-12">
      <div className="container-luxury">
        <div className="no-scrollbar flex touch-pan-x flex-nowrap gap-3 overflow-x-auto whitespace-nowrap pb-1">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4, delay: i * 0.04 }}
              className="shrink-0"
            >
              <Link
                to={`/shop?category=${cat.slug}`}
                className="block whitespace-nowrap rounded-full border border-gold/35 bg-white px-5 py-3 text-[11px] font-medium uppercase tracking-[0.18em] text-brown transition-colors duration-300 hover:border-gold hover:bg-beige/40 hover:text-gold"
              >
                {cat.name}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
