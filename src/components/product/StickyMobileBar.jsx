import { formatPrice } from '@/utils/format';

export default function StickyMobileBar({ product, effectivePrice, onAddToCart, onBuyNow, disabled }) {
  return (
    <div className="fixed inset-x-0 bottom-[calc(5rem+env(safe-area-inset-bottom))] z-[60] flex items-center gap-3 border-t border-border bg-white/95 px-4 py-3 shadow-soft backdrop-blur-xl sm:hidden">
      <div className="shrink-0">
        <p className="font-heading text-lg text-brown">{formatPrice(effectivePrice)}</p>
        {product.oldPrice && (
          <p className="text-[11px] text-text/40 line-through">{formatPrice(product.oldPrice)}</p>
        )}
      </div>
      <button
        onClick={onAddToCart}
        disabled={disabled}
        className="min-h-11 flex-1 rounded-full border border-gold py-3 text-xs font-medium text-brown disabled:cursor-not-allowed disabled:opacity-40"
      >
        Add to Cart
      </button>
      <button
        onClick={onBuyNow}
        disabled={disabled}
        className="min-h-11 flex-1 rounded-full bg-brown py-3 text-xs font-medium text-white disabled:cursor-not-allowed disabled:opacity-40"
      >
        Buy Now
      </button>
    </div>
  );
}
