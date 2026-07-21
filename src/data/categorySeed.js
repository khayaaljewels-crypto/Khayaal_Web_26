// NOTE ON IMAGES: no reference image files were actually received with the
// request that introduced these categories (the message referenced
// "attached" images, but no attachments came through). These reuse the
// existing verified jewelry photo pool as temporary placeholders — every
// image here can be replaced any time via Admin → Categories → Edit,
// no code changes needed.
const img = (id, w = 800) => `https://images.unsplash.com/${id}?q=80&w=${w}&auto=format&fit=crop`;

const placeholderPool = [
  img('photo-1599643477877-530eb83abc8e'),
  img('photo-1611652022419-a9419f74343d'),
  img('photo-1601121141461-9d6647bca1ed'),
  img('photo-1635767798638-3e25273a8236'),
  img('photo-1611591437281-460bfbe1220a'),
  img('photo-1611085583191-a3b181a88401'),
  img('photo-1605100804763-247f67b3557e'),
  img('photo-1583292650898-7d22cd27ca6f'),
];

const CATEGORIES = [
  { name: 'Bridal Sets', description: 'Statement pieces designed for the bride who wants to be remembered.' },
  { name: 'Kundan Sets', description: 'Hand-set kundan work with the warm glow of traditional gold artistry.' },
  { name: 'Polki Sets', description: 'Uncut-diamond-style polki work, radiant and richly antique.' },
  { name: 'Jadau Sets', description: 'Intricate jadau craftsmanship, layered with old-world detail.' },
  { name: 'Temple Jewellery Sets', description: 'South Indian temple motifs, cast in devotional gold artistry.' },
  { name: 'Antique Finish Sets', description: 'Oxidised, heirloom-toned pieces with a timeworn, regal finish.' },
  { name: 'Meenakari Sets', description: 'Vivid enamel work in jewel tones, painted onto gold-finished settings.' },
  { name: 'American Diamond (AD) Sets', description: 'Brilliant-cut AD stones for maximum sparkle at every angle.' },
  { name: 'CZ (Cubic Zirconia) Sets', description: 'Clean, contemporary sparkle with precision-cut CZ stones.' },
  { name: 'Moissanite Sets', description: 'Exceptional fire and brilliance, for a diamond-like finish.' },
  { name: 'Victorian Sets', description: 'Dark oxidised metalwork with vintage European-inspired detailing.' },
];

export const CATEGORY_SEED = CATEGORIES.map((c, i) => ({
  id: c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
  name: c.name,
  slug: c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
  image: placeholderPool[i % placeholderPool.length],
  description: c.description,
  hidden: false,
}));
