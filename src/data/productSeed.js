import { MATERIALS, STONES, COLORS, COLOR_HEX, FINISHES, RING_SIZES, OCCASION_OPTIONS } from './constants';

const img = (id, w = 900) => `https://images.unsplash.com/${id}?q=80&w=${w}&auto=format&fit=crop`;

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

export const CATEGORY_DEFS = [
  {
    key: 'necklace-sets',
    label: 'Necklace Sets',
    names: [
      'Meenakari Kundan Necklace Set', 'Antique Temple Necklace Set', 'Royal Peacock Necklace',
      'Victorian Filigree Necklace', 'Layered Bridal Necklace', 'Emerald Kundan Necklace Set',
    ],
  },
  {
    key: 'long-haaram',
    label: 'Long Haaram',
    names: [
      'Rani Haaram Long Necklace', 'Coin Motif Long Haaram', 'Temple Coin Haaram',
      'Kundan Polki Long Haaram', 'Multilayer Gold Haaram', 'Bridal Rani Haaram',
    ],
  },
  {
    key: 'temple-jewellery',
    label: 'Temple Jewellery',
    names: [
      'Antique Temple Choker', 'South Indian Temple Necklace', 'Temple Lakshmi Choker',
      'Nakshi Temple Necklace', 'Temple Coin Choker', 'Goddess Motif Temple Set',
    ],
  },
  {
    key: 'earrings',
    label: 'Earrings',
    names: [
      'Polki Chandbali Earrings', 'Emerald Kundan Jhumkas', 'Lotus Motif Stud Earrings',
      'Floral Enamel Earrings', 'Pearl Drop Chandbali', 'Antique Jhumka Earrings',
    ],
  },
  {
    key: 'bangles',
    label: 'Bangles',
    names: [
      'Gold Plated Kada Bangles', 'Classic Gold Vati Bangles', 'Kundan Polki Bangles Pair',
      'Rose Gold Charm Bangles', 'Temple Motif Kada', 'Meenakari Enamel Bangles',
    ],
  },
  {
    key: 'bridal-sets',
    label: 'Bridal Sets',
    names: [
      'Sabyasachi Inspired Bridal Set', 'Bridal Layered Necklace Set', 'Royal Bridal Choker Set',
      'Kundan Bridal Jewellery Set', 'Rani Pink Bridal Set', 'Heritage Bridal Necklace Set',
    ],
  },
  {
    key: 'rings',
    label: 'Rings',
    names: [
      'Ruby Studded Statement Ring', 'Crystal Stone Cocktail Ring', 'Diamond Cut Solitaire Ring',
      'Kundan Polki Ring', 'Antique Floral Ring', 'Emerald Statement Ring',
    ],
  },
  {
    key: 'maang-tikka',
    label: 'Maang Tikka',
    names: [
      'Pearl Drop Maang Tikka', 'Traditional Jhumar Maang Tikka', 'Kundan Maang Tikka',
      'Temple Motif Tikka', 'Bridal Polki Tikka', 'Crystal Drop Tikka',
    ],
  },
  {
    key: 'accessories',
    label: 'Accessories',
    names: [
      'Kundan Hair Pin Set', 'Pearl Anklet Pair', 'Temple Motif Waist Belt',
      'Meenakari Bracelet', 'Antique Nose Pin', 'Bridal Kamarbandh',
    ],
  },
];

export const COLLECTION_SEED = ['Heritage Bloom', 'Royal Nakshi', 'Modern Minimal', 'Bridal Reverie', 'Temple Legacy', 'Everyday Luxe'];

const PACKAGE_BY_CATEGORY = {
  'necklace-sets': '1 x Necklace, 1 x Pair of Earrings',
  'long-haaram': '1 x Long Haaram',
  'temple-jewellery': '1 x Necklace, 1 x Pair of Earrings',
  earrings: '1 x Pair of Earrings',
  bangles: '1 x Set of Bangles',
  'bridal-sets': '1 x Necklace, 1 x Pair of Earrings, 1 x Maang Tikka',
  rings: '1 x Ring',
  'maang-tikka': '1 x Maang Tikka',
  accessories: '1 x Piece',
};

const DIMENSIONS_BY_CATEGORY = (i) => ({
  'necklace-sets': `${14 + (i % 4)} in chain + 2 in extender`,
  'long-haaram': `${26 + (i % 6)} in chain length`,
  'temple-jewellery': `${15 + (i % 3)} in chain + 2 in extender`,
  earrings: `${3 + (i % 4)} cm drop length`,
  bangles: `${2.4 + (i % 3) * 0.2} in inner diameter`,
  'bridal-sets': `${16 + (i % 4)} in chain + 2 in extender`,
  rings: 'Adjustable / As per selected size',
  'maang-tikka': `${5 + (i % 3)} cm drop length`,
  accessories: 'Adjustable',
});

const FLAT = CATEGORY_DEFS.flatMap((cat) => cat.names.map((name) => ({ name, category: cat.key })));

function stockQtyFor(i) {
  if (i % 11 === 0) return 0;
  if (i % 7 === 0) return 3;
  return 15 + ((i * 5) % 40);
}

export const SEED_PRODUCTS = FLAT.map(({ name, category }, i) => {
  const price = 1499 + ((i * 733) % 8500);
  const hasDiscount = i % 3 !== 0;
  const oldPrice = hasDiscount ? Math.round(price * 1.35) : null;

  return {
    id: `kj-${String(i + 1).padStart(3, '0')}`,
    sku: `KJ-${String(i + 1).padStart(4, '0')}`,
    brand: 'Khayaal Jewels',
    slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    name,
    category,
    collection: COLLECTION_SEED[i % COLLECTION_SEED.length],
    occasion: OCCASION_OPTIONS[i % OCCASION_OPTIONS.length],
    material: MATERIALS[i % MATERIALS.length],
    stone: STONES[i % STONES.length],
    color: COLORS[i % COLORS.length],
    price,
    oldPrice,
    costPrice: Math.round(price * 0.55),
    stockQty: stockQtyFor(i),
    rating: Number((3.8 + ((i * 37) % 12) / 10).toFixed(1)),
    reviewCount: 12 + ((i * 17) % 220),
    images: [gallery[i % gallery.length], gallery[(i + 1) % gallery.length], gallery[(i + 2) % gallery.length]],
    isBestSeller: i % 4 === 0,
    isNewArrival: i % 5 === 1,
    isFeatured: i % 6 === 2,
    isTrending: i % 7 === 3,
    isComingSoon: false,
    isPublished: true,
    description:
      'Handcrafted imitation jewellery finished with a premium plating and set with hand-placed stones — designed to look and feel like a genuine heirloom piece.',
    shortDescription: 'Premium hand-finished imitation jewellery, designed to be worn and remembered.',
    tags: [category.replace(/-/g, ' '), 'handcrafted', 'imitation jewellery'],
    specs: {
      metal: MATERIALS[i % MATERIALS.length],
      stone: STONES[i % STONES.length],
      finish: FINISHES[i % FINISHES.length],
      weight: `${8 + ((i * 7) % 40)} g`,
      dimensions: DIMENSIONS_BY_CATEGORY(i)[category],
      occasion: OCCASION_OPTIONS[i % OCCASION_OPTIONS.length],
      packageIncludes: `${PACKAGE_BY_CATEGORY[category]}, 1 x Khayaal Jewels Gift Box, 1 x Authenticity Card`,
      warranty: '6 Months Against Manufacturing Defects',
      countryOfOrigin: 'India',
    },
    careInstructions:
      'Keep away from perfume, water, and sweat. Store in the provided pouch/box when not in use. Avoid contact with harsh chemicals. Clean gently with a soft, dry cloth.',
    deliveryDays: 4 + (i % 5),
    codAvailable: i % 6 !== 0,
    returnDays: 7,
    videos: [],
    variants: COLORS.map((c, vi) => ({
      id: c.toLowerCase().replace(/\s+/g, '-'),
      label: c,
      hex: COLOR_HEX[c],
      image: gallery[(i + vi + 3) % gallery.length],
      priceDelta: vi === 0 ? 0 : vi * 120,
    })),
    ringSizes:
      category === 'rings'
        ? RING_SIZES.map((size) => ({ size, available: (i + size) % 5 !== 0 }))
        : null,
  };
});
