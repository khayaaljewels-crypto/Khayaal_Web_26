// Keeps existing image records compatible while asking image CDNs for an
// appropriately sized modern rendition. Local/static URLs are returned as-is.
export function optimizedImageUrl(src, { width, height, quality = 'auto:good' } = {}) {
  if (!src || typeof src !== 'string') return src;

  try {
    const url = new URL(src);

    if (url.hostname.endsWith('res.cloudinary.com') && url.pathname.includes('/upload/')) {
      const transforms = [`f_auto`, `q_${quality}`];
      if (width) transforms.push(`w_${Math.round(width)}`, 'c_limit');
      if (height) transforms.push(`h_${Math.round(height)}`, 'c_limit');
      url.pathname = url.pathname.replace('/upload/', `/upload/${transforms.join(',')}/`);
      return url.toString();
    }

    if (url.hostname.endsWith('images.unsplash.com')) {
      url.searchParams.set('auto', 'format');
      url.searchParams.set('q', '80');
      if (width) url.searchParams.set('w', String(Math.round(width)));
      if (height) url.searchParams.set('h', String(Math.round(height)));
      return url.toString();
    }
  } catch {
    // Relative paths and malformed legacy URLs retain their original value.
  }

  return src;
}
