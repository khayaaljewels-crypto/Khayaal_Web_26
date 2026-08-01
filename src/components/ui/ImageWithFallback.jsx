const DEFAULT_FALLBACK = '/images/placeholder.svg';

// Drop-in replacement for a plain <img> — falls back to a placeholder when
// src is missing/empty (never lets React hand the browser an undefined/null
// src) or when the real image fails to load (dead URL, storage-driver/host
// changed since upload, etc). Category/collection images are the current
// reason this exists (see SingleImageUpload.jsx's fix for the root cause),
// but this is deliberately generic — any image anywhere can use it.
export default function ImageWithFallback({ src, fallback = DEFAULT_FALLBACK, alt = '', ...rest }) {
  return (
    <img
      src={src || fallback}
      alt={alt}
      onError={(e) => {
        // Guards against looping forever if the fallback asset itself
        // ever fails to load.
        if (e.currentTarget.dataset.fallbackApplied) return;
        e.currentTarget.dataset.fallbackApplied = 'true';
        e.currentTarget.src = fallback;
      }}
      {...rest}
    />
  );
}
