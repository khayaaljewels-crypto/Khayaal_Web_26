// No reviews ship pre-seeded — real reviews come from customers via the
// "Write a Review" form on the product page (see ReviewsSection.jsx).
export function getReviewsForProduct() {
  return [];
}

export function getRatingDistribution(reviews) {
  const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach((r) => { dist[r.rating] = (dist[r.rating] || 0) + 1; });
  const total = reviews.length || 1;
  return [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: dist[star],
    pct: Math.round((dist[star] / total) * 100),
  }));
}
