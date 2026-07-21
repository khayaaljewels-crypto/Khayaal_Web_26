import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

export const staggerItem = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
};

export default function StaggerGroup({
  children,
  className = '',
  staggerDelay = 0.12,
  once = true,
  threshold = 0.15,
  ...rest
}) {
  const [ref, inView] = useInView({ triggerOnce: once, threshold });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={inView ? 'show' : 'hidden'}
      variants={{ show: { transition: { staggerChildren: staggerDelay } } }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
