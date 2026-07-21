import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const DIRECTIONS = {
  up: { y: 48, x: 0 },
  down: { y: -48, x: 0 },
  left: { y: 0, x: 48 },
  right: { y: 0, x: -48 },
  none: { y: 0, x: 0 },
};

export default function Reveal({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.9,
  distance,
  once = true,
  threshold = 0.2,
  className = '',
  as: Component = motion.div,
  ...rest
}) {
  const [ref, inView] = useInView({ triggerOnce: once, threshold });
  const offset = DIRECTIONS[direction] ?? DIRECTIONS.up;
  const scale = distance ? distance / 48 : 1;

  return (
    <Component
      ref={ref}
      className={className}
      initial={{ opacity: 0, x: offset.x * scale, y: offset.y * scale }}
      animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
      {...rest}
    >
      {children}
    </Component>
  );
}
