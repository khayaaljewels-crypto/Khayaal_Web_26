import { motion } from 'framer-motion';

export default function SimpleBarChart({ data, valueKey = 'value', labelKey = 'label', formatValue = (v) => v }) {
  const max = Math.max(...data.map((d) => d[valueKey]), 1);

  return (
    <div className="space-y-3">
      {data.map((d, i) => (
        <div key={i} className="flex items-center gap-3 text-xs">
          <span className="w-20 shrink-0 truncate text-text/60">{d[labelKey]}</span>
          <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-beige">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(d[valueKey] / max) * 100}%` }}
              transition={{ duration: 0.6, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="h-full rounded-full bg-gold"
            />
          </div>
          <span className="w-16 shrink-0 text-right font-medium text-brown">{formatValue(d[valueKey])}</span>
        </div>
      ))}
    </div>
  );
}
