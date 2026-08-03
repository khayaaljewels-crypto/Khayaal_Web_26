// Single source of truth for the "Khayaal" brand mark — a tightly-cropped
// export of public/images/Khayaal_logo.png (that source file has a lot of
// empty canvas around the wordmark, unsuitable for a navbar/footer/favicon
// at a glance, so this points at the trimmed version instead). The image
// already bakes in "Khayaal" + "Jewels Manifested", so callers never need
// separate tagline markup alongside it.
//
// `invert` renders a pure-white silhouette via a CSS filter (brightness-0
// + invert), for dark/transparent backgrounds — e.g. the navbar over the
// hero image — since a raster image can't pick up a `text-white` class the
// way the old text-based wordmark did.
export default function Logo({ className = 'h-10 w-auto', invert = false, alt = 'Khayaal Jewels' }) {
  return (
    <img
      src="/images/Khayaal_logo_trimmed.png"
      alt={alt}
      className={`${className} object-contain ${invert ? 'brightness-0 invert' : ''}`}
    />
  );
}
