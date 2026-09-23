import { memo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HiHeart,
  HiOutlineHeart,
  HiOutlineShoppingBag,
  HiOutlineEye,
  HiOutlineArrowsRightLeft,
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
  const [secondaryImageVisible, setSecondaryImageVisible] = useState(false);

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
        <Link to={`/product/${product.slug}`} className="relative aspect-square w-32 shrink-0 overflow-hidden bg-beige sm:w-44">
          <ImageWithFallback
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            className={`h-full w-full object-cover transition-transform duration-700 ease-luxury group-hover:scale-[1.03] ${outOfStock ? 'opacity-50 grayscale' : ''}`}
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
              <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.14em] text-text/50">{product.category?.name || product.collection?.name || 'Khayaal Jewels'}</p>
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
      onPointerEnter={() => setSecondaryImageVisible(true)}
    >
      <div className="relative overflow-hidden bg-beige">
        <Link to={`/product/${product.slug}`} className="block">
          <div className="relative aspect-square w-full overflow-hidden">
            <ImageWithFallback
              src={product.images[0]}
              alt={product.name}
              loading="lazy"
              width={600}
              height={600}
              sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, 50vw"
              className={`h-full w-full object-cover transition-all duration-700 ease-luxury group-hover:scale-[1.03] group-hover:opacity-0 ${outOfStock ? 'grayscale' : ''}`}
            />
            {secondaryImageVisible && (
              <ImageWithFallback
                src={product.images[1] ?? product.images[0]}
                alt=""
                aria-hidden
                loading="lazy"
                width={600}
                height={600}
                className={`absolute inset-0 h-full w-full scale-[1.03] object-cover opacity-0 transition-all duration-700 ease-luxury group-hover:scale-100 group-hover:opacity-100 ${outOfStock ? 'grayscale' : ''}`}
              />
            )}
            {outOfStock && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/50">
                <span className="rounded-full bg-brown/90 px-4 py-1.5 text-[11px] font-semibold tracking-wide text-white">
                  Out of Stock
                </span>
              </div>
            )}
          </div>
        </Link>

        <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-transparent transition-colors duration-300 group-hover:ring-gold/50" />

        <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {product.discount > 0 && (
            <span className="bg-brown px-2.5 py-1 text-[9px] font-semibold tracking-[0.12em] text-white">
              -{product.discount}%
            </span>
          )}
          {product.isNewArrival && (
            <span className="bg-beige/95 px-2.5 py-1 text-[9px] font-semibold tracking-[0.12em] text-gold">
              NEW
            </span>
          )}
          {!outOfStock && product.lowStock && (
            <span className="bg-white/90 px-2.5 py-1 text-[9px] font-semibold tracking-[0.1em] text-brown">
              Only Few Left
            </span>
          )}
        </div>

        <div className="absolute right-3 top-3 flex flex-col gap-2">
          <button
            onClick={() => toggleWishlist(product)}
            aria-label="Toggle wishlist"
            data-cursor-hover
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-brown shadow-sm backdrop-blur transition duration-200 hover:scale-105 hover:text-gold"
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
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-brown opacity-0 shadow-sm backdrop-blur transition-all duration-300 group-hover:opacity-100 hover:scale-105 hover:text-gold"
          >
            <HiOutlineEye />
          </button>

          <button
            onClick={() => toggleCompare(product)}
            aria-label="Compare"
            data-cursor-hover
            className={`flex h-9 w-9 items-center justify-center rounded-full shadow-sm backdrop-blur transition-all duration-300 hover:scale-105 opacity-0 group-hover:opacity-100 ${
              comparing ? 'bg-gold text-white' : 'bg-white/90 text-brown'
            }`}
          >
            <HiOutlineArrowsRightLeft className="text-sm" />
          </button>
        </div>

        {/* Add to cart / quick buy slide-up bar */}
        <div className="absolute inset-x-0 bottom-0 flex translate-y-0 transition-transform duration-400 ease-luxury sm:translate-y-full sm:group-hover:translate-y-0">
          {outOfStock ? (
            <span className="flex w-full items-center justify-center gap-2 bg-brown/60 py-3 text-xs font-medium tracking-wide text-white">
              Out of Stock
            </span>
          ) : (
            <>
              <button
                onClick={() => addItem(product)}
                data-cursor-hover
                className="flex min-h-11 flex-1 items-center justify-center gap-2 bg-brown py-3 text-xs font-medium tracking-wide text-white transition-colors hover:bg-gold"
              >
                <HiOutlineShoppingBag />
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                data-cursor-hover
                aria-label="Buy now"
                className="min-h-11 w-14 border-l border-white/20 bg-brown text-xs font-medium tracking-wide text-white transition-colors hover:bg-gold"
              >
                Buy
              </button>
            </>
          )}
        </div>
      </div>

      <Link to={`/product/${product.slug}`} className="mt-3 block">
        <p className="truncate font-heading text-[15px] leading-snug text-brown transition-colors duration-300 group-hover:text-gold sm:text-base">{product.name}</p>
        <p className="mt-1 truncate text-[10px] font-medium uppercase tracking-[0.14em] text-text/50">{product.category?.name || product.collection?.name || 'Fine jewellery'}</p>
        <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-0.5">
          <span className="font-medium text-brown">{formatPrice(product.price)}</span>
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
