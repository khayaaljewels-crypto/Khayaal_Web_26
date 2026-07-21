import { MATERIALS, COLORS, COLOR_HEX, OCCASION_OPTIONS } from './constants';

// NOTE ON IMAGES: no reference image files were actually received with the
// request that introduced this catalogue (the message referenced "attached"
// product images, but no attachments came through). These reuse the
// existing verified jewelry photo pool as temporary placeholders — swap
// them any time via Admin → Products → Edit → Images, no code changes
// needed. Real product photography should replace these before launch.
const img = (id, w = 1200) => `https://images.unsplash.com/${id}?q=80&w=${w}&auto=format&fit=crop`;

const gallery = [
  img('photo-1599643477877-530eb83abc8e'),
  img('photo-1611652022419-a9419f74343d'),
  img('photo-1601121141461-9d6647bca1ed'),
  img('photo-1635767798638-3e25273a8236'),
  img('photo-1611591437281-460bfbe1220a'),
  img('photo-1611085583191-a3b181a88401'),
  img('photo-1605100804763-247f67b3557e'),
  img('photo-1583292650898-7d22cd27ca6f'),
];

// Launch catalogue: Khayaal Jewels is going live with these 5 real products
// only. This array is just seed/first-load data — the admin can add
// unlimited further products through the dashboard with zero code changes
// (see ProductsContext: addProduct/updateProduct write straight to
// localStorage, nothing here is hardcoded as a limit).
// All 5 launch products share one collection (rather than per-category
// collections) so "Complete The Look" — which pairs a product with a
// different-category item from the same collection — has cross-category
// matches to show instead of coming up empty.
export const COLLECTION_SEED = ['The Launch Edit'];
const LAUNCH_COLLECTION = COLLECTION_SEED[0];

function makeVariants(seedIndex, primaryColor) {
  return COLORS.map((c, vi) => ({
    id: c.toLowerCase().replace(/\s+/g, '-'),
    label: c,
    hex: COLOR_HEX[c],
    image: gallery[(seedIndex + vi) % gallery.length],
    priceDelta: c === primaryColor ? 0 : vi * 100,
  }));
}

const RAW_PRODUCTS = [
  {
    name: 'Sabyasachi Inspired Polki Set',
    category: 'polki-sets',
    price: 2999,
    oldPrice: 3499,
    stone: 'Polki',
    color: 'Gold',
    imgStart: 0,
    shortDescription: 'A regal, uncut-polki bridal set inspired by Sabyasachi\'s iconic maximalist heritage aesthetic.',
    description:
      'The Sabyasachi Inspired Polki Set brings runway-grade maximalism to your bridal or festive look. Set in an antique gold finish with hand-placed polki stones, this piece is built to be the centerpiece of a wedding trousseau — layered, ornate, and unmistakably regal. Every stone is set by hand to catch light from every angle, and the antique gold base is finished to resist tarnish with everyday care.',
    tags: ['polki', 'bridal', 'sabyasachi inspired', 'antique gold', 'statement necklace'],
  },
  {
    name: 'Emerald Blue-Ruby Polki Set',
    category: 'polki-sets',
    price: 3599,
    oldPrice: 4299,
    stone: 'Emerald',
    color: 'Gold',
    imgStart: 2,
    shortDescription: 'Polki work layered with emerald-green and ruby-red stones for a jewel-toned bridal statement.',
    description:
      'The Emerald Blue-Ruby Polki Set pairs traditional polki work with rich emerald-green and ruby-red stone accents, creating a jewel-box effect that photographs beautifully against both light and dark bridal outfits. Hand-set stones and an antique gold-toned base give it the weighty, heirloom feel of vintage fine jewellery, while remaining lightweight enough for a full day of wear.',
    tags: ['polki', 'emerald', 'ruby', 'bridal', 'jewel tone necklace'],
  },
  {
    name: 'Ruby Polki Necklace Set',
    category: 'polki-sets',
    price: 3199,
    oldPrice: 3999,
    stone: 'Ruby',
    color: 'Gold',
    imgStart: 4,
    shortDescription: 'Classic polki necklace set with deep ruby-red stone work for a traditional bridal finish.',
    description:
      'The Ruby Polki Necklace Set is a classic choice for weddings and festive occasions, combining traditional polki settings with deep ruby-red stone accents. The antique gold finish and detailed stone work give it an heirloom quality, making it equally suited to the wedding day itself or the celebrations around it.',
    tags: ['polki', 'ruby', 'bridal', 'necklace set', 'traditional jewellery'],
  },
  {
    name: 'Seafoam Kundan Necklace Set',
    category: 'kundan-sets',
    price: 1799,
    oldPrice: 2499,
    stone: 'Kundan',
    color: 'Gold',
    imgStart: 1,
    shortDescription: 'Kundan necklace set in a fresh seafoam palette, ideal for daytime festive wear.',
    description:
      'The Seafoam Kundan Necklace Set brings a lighter, fresher palette to traditional kundan craftsmanship. Set against a gold-plated base, the seafoam stone work is well suited to daytime functions, mehendi ceremonies, and festive wear where a brighter, less heavy look is preferred without losing the detail of hand-set kundan work.',
    tags: ['kundan', 'seafoam', 'festive', 'necklace set', 'daytime jewellery'],
  },
  {
    name: 'Ruby Cascade Kundan Necklace Set',
    category: 'kundan-sets',
    price: 2499,
    oldPrice: 2999,
    stone: 'Ruby',
    color: 'Gold',
    imgStart: 3,
    shortDescription: 'A cascading kundan necklace set with ruby-red drops for a rich, festive finish.',
    description:
      'The Ruby Cascade Kundan Necklace Set layers hand-set kundan work with cascading ruby-red drops, designed to move and catch light with every step. The gold-plated base and detailed stone setting make it a strong choice for weddings, receptions, and festive occasions that call for a fuller, more dramatic silhouette.',
    tags: ['kundan', 'ruby', 'cascade', 'necklace set', 'festive jewellery'],
  },
];

export const SEED_PRODUCTS = RAW_PRODUCTS.map((p, i) => {
  const discountPct = Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100);
  const slug = p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  return {
    id: `kj-${String(i + 1).padStart(3, '0')}`,
    sku: `KJ-${String(i + 1).padStart(4, '0')}`,
    brand: 'Khayaal Jewels',
    slug,
    name: p.name,
    category: p.category,
    collection: LAUNCH_COLLECTION,
    occasion: OCCASION_OPTIONS[0],
    material: MATERIALS[2],
    stone: p.stone,
    color: p.color,
    price: p.price,
    oldPrice: p.oldPrice,
    costPrice: Math.round(p.price * 0.55),
    stockQty: 12 + i * 3,
    rating: 4.6 + (i % 3) * 0.1,
    reviewCount: 42 + i * 11,
    images: [
      gallery[p.imgStart % gallery.length],
      gallery[(p.imgStart + 1) % gallery.length],
      gallery[(p.imgStart + 2) % gallery.length],
      gallery[(p.imgStart + 3) % gallery.length],
    ],
    isBestSeller: true,
    isNewArrival: true,
    isFeatured: true,
    isTrending: true,
    isComingSoon: false,
    isPublished: true,
    description: p.description,
    shortDescription: p.shortDescription,
    tags: p.tags,
    specs: {
      metal: MATERIALS[2],
      stone: p.stone,
      finish: 'Antique Gold Polish',
      weight: `${28 + i * 4} g`,
      dimensions: `${15 + (i % 3)} in chain + 2 in extender`,
      occasion: OCCASION_OPTIONS[0],
      packageIncludes: '1 x Necklace, 1 x Pair of Earrings, 1 x Khayaal Jewels Gift Box, 1 x Authenticity Card',
      warranty: '6 Months Against Manufacturing Defects',
      countryOfOrigin: 'India',
    },
    careInstructions:
      'Keep away from perfume, water, and sweat. Store in the provided pouch/box when not in use, away from direct sunlight. Avoid contact with harsh chemicals and cosmetics. Clean gently with a soft, dry cloth after each wear.',
    deliveryDays: 5,
    codAvailable: true,
    returnDays: 7,
    videos: [],
    variants: makeVariants(p.imgStart, p.color),
    ringSizes: null,
    seoTitle: `${p.name} | Khayaal Jewels`,
    seoDescription: `Buy the ${p.name} online at Khayaal Jewels — ${p.shortDescription} Premium imitation jewellery, ₹${p.price} onwards.`,
    discountPct,
  };
});
