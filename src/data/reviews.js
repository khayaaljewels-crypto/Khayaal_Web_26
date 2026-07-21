const REVIEWERS = [
  'Ananya Rao', 'Priya Menon', 'Sneha Iyer', 'Ritika Kapoor', 'Divya Nair',
  'Meera Pillai', 'Kavya Reddy', 'Anjali Verma', 'Pooja Shah', 'Nisha Gupta',
  'Sanjana Bhatt', 'Lakshmi Krishnan',
];

const COMMENTS = [
  'Absolutely stunning piece — looks far more expensive than what I paid. Packaging felt very premium too.',
  'Exceeded my expectations. The finish is flawless and it hasn\'t tarnished even after a few wears.',
  'Perfect for my sister\'s wedding. Got so many compliments! Will definitely order again.',
  'Good quality overall, slightly heavier than I expected but that just makes it feel more premium.',
  'Beautiful craftsmanship and the stones are set really well. True to the photos.',
  'Loved it! Delivery was quick and the piece was exactly as shown on the site.',
  'Great value for the price. Comfortable to wear for long hours at functions.',
  'The color is a touch different from the picture but still gorgeous in person.',
  'This is my third purchase from Khayaal and the quality is consistently excellent.',
  'Elegant design, feels like a genuine heirloom piece. Highly recommend.',
];

function seededPick(arr, seed) {
  return arr[seed % arr.length];
}

export function getReviewsForProduct(product) {
  const count = 4 + (product.id.charCodeAt(product.id.length - 1) % 3);
  return Array.from({ length: count }).map((_, i) => {
    const seed = product.id.length * 7 + i * 13;
    const rating = [5, 5, 4, 5, 4, 3][seed % 6];
    return {
      id: `${product.id}-review-${i + 1}`,
      name: seededPick(REVIEWERS, seed + i),
      rating,
      date: new Date(Date.now() - (seed % 220) * 86400000).toISOString(),
      comment: seededPick(COMMENTS, seed + i * 3),
      verified: (seed + i) % 4 !== 0,
      helpful: (seed * 3 + i * 5) % 48,
      images: i % 3 === 0 ? [product.images[(i + 1) % product.images.length]] : [],
    };
  });
}

export function getRatingDistribution(reviews) {
  const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach((r) => { dist[r.rating] = (dist[r.rating] || 0) + 1; });
  const total = reviews.length || 1;
  return [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: dist[star],
    pct: Math.round(((dist[star]) / total) * 100),
  }));
}
