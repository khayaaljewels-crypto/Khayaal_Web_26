import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HiOutlineXMark } from 'react-icons/hi2';
import { FaInstagram, FaFacebookF, FaPinterestP } from 'react-icons/fa';
import { navLinks } from './navLinks';
import { useCategories } from '@/context/CategoriesContext';
import { useSettings } from '@/context/SettingsContext';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';
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
  const { settings } = useSettings();
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
          <div className="flex h-full flex-col overflow-y-auto px-5 py-6 xs:px-6 xs:py-8 sm:px-8">
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
              className="mt-9 flex flex-col gap-4 xs:mt-12 xs:gap-5"
              variants={listVariants}
              initial="hidden"
              animate="show"
            >
              {navLinks.map((link) => (
                <motion.div key={link.label} variants={itemVariants}>
                  <Link
                    to={link.to}
                    onClick={onClose}
                    className="font-heading text-2xl text-brown transition-colors hover:text-gold xs:text-3xl"
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
              className="mt-9 xs:mt-12"
            >
              <motion.p variants={itemVariants} className="eyebrow mb-4">
                Shop by Category
              </motion.p>
              <div className="no-scrollbar flex gap-3 overflow-x-auto pb-1">
                {categories.map((cat) => (
                  <motion.div key={cat.id} variants={itemVariants}>
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
            </motion.div>

            <div className="mt-auto flex items-center gap-4 pt-10">
              <a href={settings.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-brown transition-colors hover:text-gold">
                <FaInstagram className="text-xl" />
              </a>
              <a href={settings.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-brown transition-colors hover:text-gold">
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
