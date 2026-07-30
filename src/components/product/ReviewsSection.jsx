import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiStar, HiOutlineStar, HiCheckBadge, HiOutlineHandThumbUp } from 'react-icons/hi2';
import { getReviewsForProduct, getRatingDistribution } from '@/data/reviews';
import Reveal from '@/components/animations/Reveal';

const PAGE_SIZE = 3;

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function WriteReviewForm({ onSubmit, onCancel }) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) return;
    onSubmit({ rating, name: name.trim(), comment: comment.trim() });
  };

  return (
    <motion.form
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      onSubmit={handleSubmit}
      className="overflow-hidden rounded-2xl border border-border p-6"
    >
      <p className="font-heading text-lg text-brown">Write a Review</p>

      <div className="mt-4 flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => {
          const value = i + 1;
          const filled = value <= (hoverRating || rating);
          return (
            <button
              type="button"
              key={i}
              onMouseEnter={() => setHoverRating(value)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(value)}
              aria-label={`Rate ${value} stars`}
            >
              {filled ? <HiStar className="text-xl text-gold" /> : <HiOutlineStar className="text-xl text-gold" />}
            </button>
          );
        })}
      </div>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name"
        className="mt-4 w-full rounded-xl border border-border px-4 py-2.5 text-sm focus:border-gold focus:outline-none"
      />
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Share your experience with this product..."
        rows={4}
        className="mt-3 w-full rounded-xl border border-border px-4 py-2.5 text-sm focus:border-gold focus:outline-none"
      />

      <div className="mt-4 flex gap-3">
        <button type="submit" className="rounded-full bg-brown px-6 py-2.5 text-xs font-medium text-white hover:bg-gold">
          Submit Review
        </button>
        <button type="button" onClick={onCancel} className="rounded-full border border-border px-6 py-2.5 text-xs font-medium text-brown">
          Cancel
        </button>
      </div>
    </motion.form>
  );
}

export default function ReviewsSection({ product }) {
  const [extraReviews, setExtraReviews] = useState([]);
  const [helpfulIds, setHelpfulIds] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const baseReviews = getReviewsForProduct(product);
  const reviews = [...extraReviews, ...baseReviews];
  const distribution = getRatingDistribution(reviews);
  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  const handleSubmitReview = ({ rating, name, comment }) => {
    setExtraReviews((prev) => [
      {
        id: `local-${Date.now()}`,
        name,
        rating,
        comment,
        date: new Date().toISOString(),
        verified: false,
        helpful: 0,
        images: [],
      },
      ...prev,
    ]);
    setShowForm(false);
  };

  const toggleHelpful = (id) =>
    setHelpfulIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  return (
    <section id="reviews" className="scroll-mt-28">
      <Reveal>
        <h2 className="font-heading text-2xl text-brown sm:text-3xl">Customer Reviews</h2>
      </Reveal>

      <div className="mt-8 grid gap-10 lg:grid-cols-[280px_1fr]">
        <div>
          <div className="text-center lg:text-left">
            <p className="font-heading text-5xl text-brown">{avgRating}</p>
            <div className="mt-2 flex items-center justify-center gap-1 text-gold lg:justify-start">
              {Array.from({ length: 5 }).map((_, i) => (
                <HiStar key={i} className={i < Math.round(avgRating) ? '' : 'opacity-25'} />
              ))}
            </div>
            <p className="mt-1 text-xs text-text/50">Based on {reviews.length} reviews</p>
          </div>

          <div className="mt-6 space-y-2">
            {distribution.map((d) => (
              <div key={d.star} className="flex items-center gap-2 text-xs text-text/60">
                <span className="w-8">{d.star}★</span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-beige">
                  <div className="h-full rounded-full bg-gold" style={{ width: `${d.pct}%` }} />
                </div>
                <span className="w-6 text-right">{d.count}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => setShowForm((s) => !s)}
            className="mt-6 w-full rounded-full border border-gold py-3 text-sm font-medium text-brown transition-colors hover:bg-gold hover:text-white"
          >
            Write a Review
          </button>
        </div>

        <div>
          <AnimatePresence>
            {showForm && (
              <div className="mb-6">
                <WriteReviewForm onSubmit={handleSubmitReview} onCancel={() => setShowForm(false)} />
              </div>
            )}
          </AnimatePresence>

          {reviews.length === 0 && !showForm && (
            <p className="rounded-2xl border border-border bg-white p-8 text-center text-sm text-text/50">
              No reviews yet — be the first to write one.
            </p>
          )}

          <div className="space-y-6">
            {reviews.slice(0, visibleCount).map((review) => (
              <div key={review.id} className="border-b border-border pb-6 last:border-b-0">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-heading text-sm text-brown">{review.name}</p>
                      {review.verified && (
                        <span className="flex items-center gap-1 text-[10px] font-medium text-green-700">
                          <HiCheckBadge /> Verified Purchase
                        </span>
                      )}
                    </div>
                    <div className="mt-1 flex items-center gap-1 text-gold">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <HiStar key={i} className={`text-xs ${i < review.rating ? '' : 'opacity-25'}`} />
                      ))}
                    </div>
                  </div>
                  <span className="text-xs text-text/40">{formatDate(review.date)}</span>
                </div>

                <p className="mt-3 text-sm leading-relaxed text-text/70">{review.comment}</p>

                {review.images.length > 0 && (
                  <div className="mt-3 flex gap-2">
                    {review.images.map((img, i) => (
                      <img key={i} src={img} alt="Customer upload" className="h-16 w-16 rounded-lg object-cover" />
                    ))}
                  </div>
                )}

                <button
                  onClick={() => toggleHelpful(review.id)}
                  className={`mt-3 flex items-center gap-1.5 text-xs font-medium transition-colors ${
                    helpfulIds.includes(review.id) ? 'text-gold' : 'text-text/50 hover:text-gold'
                  }`}
                >
                  <HiOutlineHandThumbUp />
                  Helpful ({review.helpful + (helpfulIds.includes(review.id) ? 1 : 0)})
                </button>
              </div>
            ))}
          </div>

          {visibleCount < reviews.length && (
            <button
              onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
              className="mt-4 rounded-full border border-border px-6 py-2.5 text-sm font-medium text-brown transition-colors hover:border-gold hover:text-gold"
            >
              Load More Reviews
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
