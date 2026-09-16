import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useCategories } from '@/context/CategoriesContext';

// Categories stay entirely data-driven so additions in the admin flow appear
// here automatically, without changing the navigation layout.
export default function CategoryNavigation() {
  const { visibleCategories: categories } = useCategories();

  return (
    <section className="border-y border-border/80 bg-bg py-7 sm:py-8 lg:py-10">
      <div className="container-luxury">
        <nav
          aria-label="Jewellery categories"
          className="no-scrollbar flex max-w-full touch-pan-x flex-nowrap gap-3 overflow-x-auto overscroll-x-contain scroll-smooth whitespace-nowrap pb-1"
        >
          {categories.map((category, index) => (
            <motion.div
              key={category.id ?? category.slug}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4, delay: index * 0.04 }}
              className="shrink-0"
            >
              <Link
                to={`/shop?category=${category.slug}`}
                className="block rounded-full border border-gold/30 bg-white/85 px-5 py-3 text-[11px] font-medium uppercase tracking-[0.16em] text-brown transition-colors duration-300 hover:border-gold hover:bg-beige/45 hover:text-gold active:border-gold active:bg-gold active:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
              >
                {category.name}
              </Link>
            </motion.div>
          ))}
        </nav>
      </div>
    </section>
  );
}
