import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function GoldButton({
  children,
  to,
  href,
  onClick,
  type = 'button',
  variant = 'solid',
  className = '',
  icon: Icon,
  ...rest
}) {
  const base =
    'group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full px-8 py-3.5 text-sm font-medium tracking-wide transition-colors duration-300';

  const variants = {
    solid: 'bg-brown text-white hover:text-brown',
    outline: 'border border-gold text-brown hover:text-white',
    ghost: 'text-brown hover:text-gold',
  };

  const content = (
    <>
      {variant !== 'ghost' && (
        <span className="absolute inset-0 -z-10 origin-left scale-x-0 bg-gold transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:scale-x-100" />
      )}
      <span className="relative z-10">{children}</span>
      {Icon && (
        <Icon className="relative z-10 text-base transition-transform duration-300 group-hover:translate-x-1" />
      )}
    </>
  );

  const shared = {
    className: `${base} ${variants[variant]} ${className}`,
    whileTap: { scale: 0.96 },
    whileHover: { scale: 1.02 },
    ...rest,
  };

  if (to) {
    return (
      <motion.div {...shared} style={{ display: 'inline-block' }}>
        <Link to={to} className="flex items-center gap-2">
          {content}
        </Link>
      </motion.div>
    );
  }

  if (href) {
    return (
      <motion.a href={href} {...shared}>
        {content}
      </motion.a>
    );
  }

  return (
    <motion.button type={type} onClick={onClick} {...shared}>
      {content}
    </motion.button>
  );
}
