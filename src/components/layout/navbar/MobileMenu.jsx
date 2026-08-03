import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HiOutlineXMark } from 'react-icons/hi2';
import { FaInstagram, FaFacebookF, FaPinterestP } from 'react-icons/fa';
import { navLinks } from './navLinks';
import { useCategories } from '@/context/CategoriesContext';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';
import ImageWithFallback from '@/components/ui/ImageWithFallback';
import Logo from '@/components/ui/Logo';

const listVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.2 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

export default function MobileMenu({ open, onClose }) {
  const { visibleCategories: categories } = useCategories();
  useLockBodyScroll(open);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[95] bg-bg/98 backdrop-blur-xl lg:hidden"
          initial={{ clipPath: 'circle(0% at 100% 0%)' }}
          animate={{ clipPath: 'circle(150% at 100% 0%)' }}
          exit={{ clipPath: 'circle(0% at 100% 0%)' }}
          transition={{ duration: 0.6, ease: [0.65, 0, 0.35, 1] }}
        >
          <div className="flex h-full flex-col overflow-y-auto px-8 py-8">
            <div className="flex items-center justify-between">
              <Logo className="h-9 w-auto" />
              <button
                onClick={onClose}
                aria-label="Close menu"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border"
              >
                <HiOutlineXMark className="text-xl text-brown" />
              </button>
            </div>

            <motion.nav
              className="mt-12 flex flex-col gap-5"
              variants={listVariants}
              initial="hidden"
              animate="show"
            >
              {navLinks.map((link) => (
                <motion.div key={link.label} variants={itemVariants}>
                  <Link
                    to={link.to}
                    onClick={onClose}
                    className="font-heading text-3xl text-brown transition-colors hover:text-gold"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </motion.nav>

            <motion.div
              variants={listVariants}
              initial="hidden"
              animate="show"
              className="mt-12"
            >
              <motion.p variants={itemVariants} className="eyebrow mb-4">
                Shop by Category
              </motion.p>
              <div className="grid grid-cols-3 gap-3">
                {categories.slice(0, 6).map((cat) => (
                  <motion.div key={cat.id} variants={itemVariants}>
                    <Link to={`/shop?category=${cat.slug}`} onClick={onClose} className="block">
                      <div className="aspect-square overflow-hidden rounded-xl bg-beige">
                        <ImageWithFallback src={cat.image} alt={cat.name} className="h-full w-full object-cover" />
                      </div>
                      <p className="mt-1.5 text-center text-[11px] text-brown">{cat.name}</p>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <div className="mt-auto flex items-center gap-4 pt-10">
              <a href="#" aria-label="Instagram" className="text-brown transition-colors hover:text-gold">
                <FaInstagram className="text-xl" />
              </a>
              <a href="#" aria-label="Facebook" className="text-brown transition-colors hover:text-gold">
                <FaFacebookF className="text-xl" />
              </a>
              <a href="#" aria-label="Pinterest" className="text-brown transition-colors hover:text-gold">
                <FaPinterestP className="text-xl" />
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
