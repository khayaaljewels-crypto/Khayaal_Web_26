import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { HiArrowUp } from 'react-icons/hi2';

export default function BackToTop() {
  const [visible, setVisible] = useState(false);
  const { pathname } = useLocation();
  const hasStickyBar = pathname.startsWith('/product/');

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={scrollToTop}
          aria-label="Back to top"
          className={`fixed right-5 sm:bottom-8 sm:right-8 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-brown text-white shadow-soft ${
            hasStickyBar ? 'bottom-40' : 'bottom-24'
          }`}
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.8 }}
          whileHover={{ scale: 1.08, backgroundColor: '#B8864A' }}
          whileTap={{ scale: 0.92 }}
          transition={{ duration: 0.3 }}
        >
          <HiArrowUp className="text-lg" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
