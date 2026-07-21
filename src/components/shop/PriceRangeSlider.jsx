import { useState, useEffect } from 'react';
import { useProducts } from '@/context/ProductsContext';
import { formatPrice } from '@/utils/format';

export default function PriceRangeSlider({ value, onChange }) {
  const [local, setLocal] = useState(value);
  const { priceBounds } = useProducts();

  useEffect(() => setLocal(value), [value]);

  const { min, max } = priceBounds;
  const [lo, hi] = local;

  const handleLo = (e) => {
    const next = Math.min(Number(e.target.value), hi - 100);
    setLocal([next, hi]);
  };
  const handleHi = (e) => {
    const next = Math.max(Number(e.target.value), lo + 100);
    setLocal([lo, next]);
  };
  const commit = () => onChange(local);

  const loPct = ((lo - min) / (max - min)) * 100;
  const hiPct = ((hi - min) / (max - min)) * 100;

  return (
    <div>
      <div className="flex items-center justify-between text-xs text-brown/70">
        <span>{formatPrice(lo)}</span>
        <span>{formatPrice(hi)}</span>
      </div>
      <div className="relative mt-4 h-1.5">
        <div className="absolute inset-0 rounded-full bg-border" />
        <div
          className="absolute h-full rounded-full bg-gold"
          style={{ left: `${loPct}%`, right: `${100 - hiPct}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={100}
          value={lo}
          onChange={handleLo}
          onMouseUp={commit}
          onTouchEnd={commit}
          className="range-thumb pointer-events-none absolute inset-0 w-full appearance-none bg-transparent"
        />
        <input
          type="range"
          min={min}
          max={max}
          step={100}
          value={hi}
          onChange={handleHi}
          onMouseUp={commit}
          onTouchEnd={commit}
          className="range-thumb pointer-events-none absolute inset-0 w-full appearance-none bg-transparent"
        />
      </div>
    </div>
  );
}
