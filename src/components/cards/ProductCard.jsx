import { memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HiHeart,
  HiOutlineHeart,
  HiOutlineShoppingBag,
  HiOutlineEye,
  HiOutlineArrowsRightLeft,
  HiStar,
} from 'react-icons/hi2';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { useCompare } from '@/context/CompareContext';
import { formatPrice } from '@/utils/format';
import ImageWithFallback from '@/components/ui/ImageWithFallback';

function ProductCard({ product, index = 0, view = 'grid', onQuickView }) {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { addItem } = useCart();
  const { isComparing, toggleCompare } = useCompare();
  const navigate = useNavigate();
  const wishlisted = isWishlisted(product.id);
  const comparing = isComparing(product.id);
  const outOfStock = !product.inStock;

  const handleBuyNow = (e) => {
    e.preventDefault();
    addItem(product);
    navigate('/checkout');
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    if (onQuickView) onQuickView(product);
  };

  if (view === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, delay: (index % 4) * 0.06, ease: [0.16, 1, 0.3, 1] }}
        className="group flex gap-4 rounded-2xl border border-border bg-white p-3 sm:gap-6 sm:p-4"
      >
        <Link to={`/product/${product.slug}`} className="relative h-32 w-32 shrink-0 overflow-hidden rounded-xl bg-beige sm:h-44 sm:w-44">
          <ImageWithFallback
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            className={`h-full w-full object-cover transition-transform duration-700 ease-luxury group-hover:scale-110 ${outOfStock ? 'opacity-50 grayscale' : ''}`}
          />
          {product.discount > 0 && (
            <span className="absolute left-2 top-2 rounded-full bg-brown px-2.5 py-0.5 text-[10px] font-semibold text-white">
              -{product.discount}%
            </span>
          )}
        </Link>
        <div className="flex flex-1 flex-col justify-center">
          <div className="flex items-start justify-between gap-2">
            <div>
              <Link to={`/product/${product.slug}`}>
                <p className="font-heading text-base text-brown sm:text-lg">{product.name}</p>
              </Link>
              <div className="mt-1 flex items-center gap-1 text-gold">
                {Array.from({ length: 5 }).map((_, i) => (
                  <HiStar key={i} className={`text-[11px] ${i < Math.round(product.rating) ? '' : 'opacity-25'}`} />
                ))}
                <span className="ml-1 text-[11px] text-text/50">({product.reviewCount})</span>
              </div>
            </div>
            <button
              onClick={() => toggleWishlist(product)}
              aria-label="Toggle wishlist"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-brown transition-colors hover:bg-beige"
            >
              {wishlisted ? <HiHeart className="text-gold" /> : <HiOutlineHeart />}
            </button>
          </div>

          <p className="mt-2 hidden text-xs text-text/60 sm:block line-clamp-2">{product.description}</p>

          <div className="mt-3 flex items-center gap-2">
            <span className="font-heading text-lg text-brown">{formatPrice(product.price)}</span>
            {product.oldPrice && (
              <span className="text-xs text-text/40 line-through">{formatPrice(product.oldPrice)}</span>
            )}
            {outOfStock ? (
              <span className="ml-auto text-xs font-medium text-text/40">Out of Stock</span>
            ) : product.lowStock ? (
              <span className="ml-auto text-xs font-medium text-gold">Only Few Left</span>
            ) : null}
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <button
              onClick={() => !outOfStock && addItem(product)}
              disabled={outOfStock}
              className="rounded-full bg-brown px-5 py-2 text-xs font-medium text-white transition-colors hover:bg-gold disabled:cursor-not-allowed disabled:opacity-40"
            >
              Add to Cart
            </button>
            {onQuickView && (
              <button
                onClick={handleQuickView}
                className="rounded-full border border-border px-4 py-2 text-xs font-medium text-brown transition-colors hover:border-gold hover:text-gold"
              >
                Quick View
              </button>
            )}
            <button
              onClick={() => toggleCompare(product)}
              className={`rounded-full border px-4 py-2 text-xs font-medium transition-colors ${
                comparing ? 'border-gold text-gold' : 'border-border text-brown hover:border-gold hover:text-gold'
              }`}
            >
              Compare
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, delay: (index % 4) * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="group relative"
    >
      <div className="relative overflow-hidden rounded-2xl bg-beige">
        <Link to={`/product/${product.slug}`} className="block">
          <div className="relative aspect-4/5 overflow-hidden">
            <ImageWithFallback
              src={product.images[0]}
              alt={product.name}
              loading="lazy"
              className={`h-full w-full object-cover transition-all duration-700 ease-luxury group-hover:scale-110 group-hover:opacity-0 ${outOfStock ? 'grayscale' : ''}`}
            />
            <ImageWithFallback
              src={product.images[1] ?? product.images[0]}
              alt=""
              aria-hidden
              loading="lazy"
              className={`absolute inset-0 h-full w-full scale-110 object-cover opacity-0 transition-all duration-700 ease-luxury group-hover:scale-100 group-hover:opacity-100 ${outOfStock ? 'grayscale' : ''}`}
            />
            {outOfStock && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/50">
                <span className="rounded-full bg-brown/90 px-4 py-1.5 text-[11px] font-semibold tracking-wide text-white">
                  Out of Stock
                </span>
              </div>
            )}
          </div>
        </Link>

        {/* Gold border glow on hover */}
        <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-transparent transition-all duration-500 group-hover:shadow-gold-glow group-hover:ring-gold/40" />

        <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {product.discount > 0 && (
            <span className="rounded-full bg-brown px-3 py-1 text-[10px] font-semibold tracking-wide text-white">
              -{product.discount}%
            </span>
          )}
          {product.isNewArrival && (
            <span className="rounded-full bg-gold px-3 py-1 text-[10px] font-semibold tracking-wide text-white">
              NEW
            </span>
          )}
          {!outOfStock && product.lowStock && (
            <span className="rounded-full bg-white/90 px-3 py-1 text-[10px] font-semibold tracking-wide text-brown">
              Only Few Left
            </span>
          )}
        </div>

        <div className="absolute right-3 top-3 flex flex-col gap-2">
          <button
            onClick={() => toggleWishlist(product)}
            aria-label="Toggle wishlist"
            data-cursor-hover
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-brown shadow-sm backdrop-blur transition-transform hover:scale-110"
          >
            <motion.span
              key={wishlisted ? 'filled' : 'outline'}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.25 }}
            >
              {wishlisted ? <HiHeart className="text-gold" /> : <HiOutlineHeart />}
            </motion.span>
          </button>

          <button
            onClick={handleQuickView}
            aria-label="Quick view"
            data-cursor-hover
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-brown opacity-0 shadow-sm backdrop-blur transition-all duration-300 group-hover:opacity-100 hover:scale-110"
          >
            <HiOutlineEye />
          </button>

          <button
            onClick={() => toggleCompare(product)}
            aria-label="Compare"
            data-cursor-hover
            className={`flex h-9 w-9 items-center justify-center rounded-full shadow-sm backdrop-blur transition-all duration-300 hover:scale-110 opacity-0 group-hover:opacity-100 ${
              comparing ? 'bg-gold text-white' : 'bg-white/90 text-brown'
            }`}
          >
            <HiOutlineArrowsRightLeft className="text-sm" />
          </button>
        </div>

        {/* Add to cart / quick buy slide-up bar */}
        <div className="absolute inset-x-0 bottom-0 flex translate-y-full transition-transform duration-400 ease-luxury group-hover:translate-y-0">
          {outOfStock ? (
            <span className="flex w-full items-center justify-center gap-2 bg-brown/60 py-3 text-xs font-medium tracking-wide text-white">
              Out of Stock
            </span>
          ) : (
            <>
              <button
                onClick={() => addItem(product)}
                data-cursor-hover
                className="flex flex-1 items-center justify-center gap-2 bg-brown py-3 text-xs font-medium tracking-wide text-white transition-colors hover:bg-gold"
              >
                <HiOutlineShoppingBag />
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                data-cursor-hover
                aria-label="Buy now"
                className="w-14 border-l border-white/20 bg-brown text-xs font-medium tracking-wide text-white transition-colors hover:bg-gold"
              >
                Buy
              </button>
            </>
          )}
        </div>
      </div>

      <Link to={`/product/${product.slug}`} className="mt-4 block">
        <p className="truncate font-heading text-sm text-brown sm:text-base">{product.name}</p>
        <div className="mt-1 flex items-center gap-1 text-gold">
          {Array.from({ length: 5 }).map((_, i) => (
            <HiStar key={i} className={`text-[11px] ${i < Math.round(product.rating) ? '' : 'opacity-25'}`} />
          ))}
          <span className="ml-1 text-[11px] text-text/50">({product.reviewCount})</span>
        </div>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-0.5">
          <span className="relative overflow-hidden font-medium text-brown">
            {formatPrice(product.price)}
            <span className="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/60 to-transparent group-hover:animate-[shimmer_1.2s_ease]" />
          </span>
          {product.oldPrice && (
            <span className="text-xs text-text/40 line-through">{formatPrice(product.oldPrice)}</span>
          )}
        </div>
      </Link>
    </motion.div>
  );
}

// Rendered many times per grid (Shop, Home rails, Wishlist) — memo avoids
// re-rendering every card when an unrelated sibling's props change on the
// parent list. Doesn't prevent re-renders from this component's own
// useWishlist/useCart/useCompare context subscriptions (those update
// whenever ANY item changes, not just this card's) — that would need a
// bigger context restructuring, out of scope here.
export default memo(ProductCard);
