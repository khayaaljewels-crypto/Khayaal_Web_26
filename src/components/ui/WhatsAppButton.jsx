import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { FaWhatsapp } from 'react-icons/fa';
import { useSettings } from '@/context/SettingsContext';

export default function WhatsAppButton() {
  const { pathname } = useLocation();
  const { settings } = useSettings();
  const hasStickyBar = pathname.startsWith('/product/');

  const message = encodeURIComponent(
    `Hello Khayaal,

I would like to know more about your jewellery collection.

Thank you!`
  );

  return (
    <motion.a
      href={`https://wa.me/${settings.whatsappNumber}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className={`fixed left-5 sm:bottom-8 sm:left-8 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-soft ${
        hasStickyBar ? 'bottom-40' : 'bottom-24'
      }`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      transition={{ duration: 0.4, delay: 1.4 }}
    >
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#25D366] opacity-30" />
      <FaWhatsapp className="relative text-2xl" />
    </motion.a>
  );
}