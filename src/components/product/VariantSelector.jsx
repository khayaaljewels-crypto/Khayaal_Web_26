export function ColorVariantSelector({ variants, activeId, onChange }) {
  return (
    <div>
      <p className="text-xs font-medium text-brown">
        Color: <span className="text-text/60">{variants.find((v) => v.id === activeId)?.label}</span>
      </p>
      <div className="mt-2.5 flex items-center gap-3">
        {variants.map((variant) => (
          <button
            key={variant.id}
            onClick={() => onChange(variant.id)}
            aria-label={variant.label}
            title={variant.label}
            className={`h-9 w-9 rounded-full border-2 transition-all ${
              activeId === variant.id ? 'border-gold scale-110' : 'border-transparent hover:scale-105'
            }`}
            style={{ boxShadow: `0 0 0 1px ${activeId === variant.id ? 'transparent' : '#ECE7E2'}` }}
          >
            <span
              className="block h-full w-full rounded-full border border-black/10"
              style={{ backgroundColor: variant.hex }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

export function RingSizeSelector({ sizes, activeSize, onChange }) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-brown">
          Size: <span className="text-text/60">{activeSize ?? 'Select a size'}</span>
        </p>
        <a href="/faq#size-guide" className="text-xs font-medium text-gold underline-offset-4 hover:underline">
          Size Guide
        </a>
      </div>
      <div className="mt-2.5 grid grid-cols-5 gap-2 sm:grid-cols-9">
        {sizes.map(({ size, available }) => (
          <button
            key={size}
            disabled={!available}
            onClick={() => onChange(size)}
            className={`flex h-10 items-center justify-center rounded-lg border text-sm transition-colors ${
              activeSize === size
                ? 'border-gold bg-gold text-white'
                : available
                  ? 'border-border text-brown hover:border-gold'
                  : 'border-border text-text/30 line-through cursor-not-allowed'
            }`}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
}
