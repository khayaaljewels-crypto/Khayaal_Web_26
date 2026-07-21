import { useRef } from 'react';
import { motion } from 'framer-motion';

export default function MagneticButton({
  children,
  className = '',
  strength = 0.35,
  as = 'button',
  ...rest
}) {
  const ref = useRef(null);
  const Component = motion[as] ?? motion.button;

  const handleMouseMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    el.style.setProperty('--mx', `${x * strength}px`);
    el.style.setProperty('--my', `${y * strength}px`);
  };

  const handleMouseLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty('--mx', '0px');
    el.style.setProperty('--my', '0px');
  };

  return (
    <Component
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ translateX: 'var(--mx, 0px)', translateY: 'var(--my, 0px)' }}
      className={`transition-transform duration-300 ease-out ${className}`}
      {...rest}
    >
      {children}
    </Component>
  );
}
