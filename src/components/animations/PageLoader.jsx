import { AnimatePresence, motion } from 'framer-motion';

export default function PageLoader({ isLoading }) {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-bg"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 } }}
        >
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0.6 }}
            animate={{ opacity: 0.2 }}
            transition={{ duration: 1.4 }}
            style={{
              background:
                'radial-gradient(circle at center, rgba(184,134,74,0.15) 0%, rgba(250,248,245,0) 70%)',
            }}
          />
          <motion.span
            className="font-script text-6xl sm:text-7xl text-gold"
            initial={{ opacity: 0, y: 16, letterSpacing: '0.1em' }}
            animate={{ opacity: 1, y: 0, letterSpacing: '0.02em' }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            Khayaal
          </motion.span>
          <motion.span
            className="mt-6 eyebrow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            Jewels Manifested
          </motion.span>
          <motion.div
            className="mt-8 h-px w-40 overflow-hidden bg-border"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <motion.div
              className="h-full bg-gold"
              initial={{ x: '-100%' }}
              animate={{ x: '0%' }}
              transition={{ duration: 1.1, ease: [0.65, 0, 0.35, 1], delay: 0.4 }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
