export function Field({ label, children, className = '' }) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-xs font-medium text-brown">{label}</label>
      {children}
    </div>
  );
}

export const inputClass =
  'w-full rounded-xl border border-border px-4 py-2.5 text-sm focus:border-gold focus:outline-none';

// Meant to be used inside a `divide-y divide-border` list (see
// `ToggleList` below) so every row shares one consistent height, spacing,
// and left/right alignment — the Shopify-settings-panel look, rather than
// each toggle being its own separately-bordered box.
export function Toggle({ label, checked, onChange }) {
  return (
    <label className="flex min-h-11 cursor-pointer items-center justify-between gap-4 py-3">
      <span className="text-sm font-medium text-brown">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ${checked ? 'bg-gold' : 'bg-border'}`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </label>
  );
}

// Wraps a group of <Toggle> rows with dividers between them — equal height,
// equal spacing, label-left/switch-right on every row. Expects to sit inside
// an already-bordered card (e.g. ProductForm's <section>); no border/bg of
// its own so it doesn't double up when nested there.
export function ToggleList({ children }) {
  return <div className="divide-y divide-border">{children}</div>;
}
