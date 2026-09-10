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
