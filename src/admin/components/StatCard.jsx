import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function StatCard({ label, value, icon: Icon, to, tone = 'default' }) {
  const toneClasses = {
    default: 'bg-white text-brown',
    gold: 'bg-brown text-white',
    warn: 'bg-white text-amber-700',
    danger: 'bg-white text-red-600',
  };

  const content = (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -3 }}
      className={`rounded-2xl border border-border p-5 shadow-card ${toneClasses[tone]}`}
    >
      <div className="flex items-center justify-between">
        <p className={`text-xs font-medium uppercase tracking-wide ${tone === 'gold' ? 'text-white/60' : 'text-text/50'}`}>
          {label}
        </p>
        {Icon && <Icon className={`text-lg ${tone === 'gold' ? 'text-gold-hover' : 'text-gold'}`} />}
      </div>
      <p className="mt-3 font-heading text-3xl">{value}</p>
    </motion.div>
  );

  return to ? <Link to={to}>{content}</Link> : content;
}
