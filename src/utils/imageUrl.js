// Keep the stored URL byte-for-byte stable. Provider-side format, quality, or
// dimension transforms can change the delivered product image, so loading
// priority and browser caching are handled by the <img> element instead.
export function optimizedImageUrl(src) {
  return src;
}
