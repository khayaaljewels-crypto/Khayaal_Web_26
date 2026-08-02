import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { HiOutlineXMark, HiHeart, HiOutlineHeart, HiStar, HiOutlineMinus, HiOutlinePlus } from 'react-icons/hi2';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { formatPrice } from '@/utils/format';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';
import ImageWithFallback from '@/components/ui/ImageWithFallback';

export default function QuickViewModal({ product, onClose }) {
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const { addItem } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const navigate = useNavigate();
  const open = !!product;
  useLockBodyScroll(open);

  const handleAddToCart = () => {
    if (!product) return;
    addItem(product, { quantity: qty });
    onClose();
  };

  const handleBuyNow = () => {
    if (!product) return;
    addItem(product, { quantity: qty });
    onClose();
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-brown/50 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="grid max-h-[90svh] w-full max-w-3xl grid-cols-1 overflow-y-auto rounded-3xl bg-white sm:grid-cols-2"
          >
            <div className="relative bg-beige">
              <button
                onClick={onClose}
                aria-label="Close quick view"
                className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-brown sm:hidden"
              >
                <HiOutlineXMark />
              </button>
              <div className="aspect-square overflow-hidden">
                <ImageWithFallback src={product?.images[activeImg]} alt={product?.name} className="h-full w-full object-cover" />
              </div>
              <div className="flex gap-2 p-4">
                {product?.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`h-14 w-14 shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${
                      i === activeImg ? 'border-gold' : 'border-transparent'
                    }`}
                  >
                    <ImageWithFallback src={img} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <div className="relative flex flex-col p-6 sm:p-8">
              <button
                onClick={onClose}
                aria-label="Close quick view"
                className="absolute right-6 top-6 hidden h-8 w-8 items-center justify-center rounded-full border border-border text-brown sm:flex"
              >
                <HiOutlineXMark />
              </button>

              <p className="eyebrow">{product?.category?.name}</p>
              <h3 className="mt-2 font-heading text-2xl text-brown">{product?.name}</h3>

              <div className="mt-2 flex items-center gap-1 text-gold">
                {Array.from({ length: 5 }).map((_, i) => (
                  <HiStar key={i} className={`text-sm ${i < Math.round(product?.rating ?? 0) ? '' : 'opacity-25'}`} />
                ))}
                <span className="ml-1 text-xs text-text/50">({product?.reviewCount} reviews)</span>
              </div>

              <div className="mt-4 flex items-center gap-3">
                <span className="font-heading text-2xl text-brown">{formatPrice(product?.price ?? 0)}</span>
                {product?.oldPrice && (
                  <span className="text-sm text-text/40 line-through">{formatPrice(product.oldPrice)}</span>
                )}
                {product?.discount > 0 && <span className="text-sm font-medium text-gold">-{product.discount}%</span>}
              </div>

              <p className="mt-4 text-sm leading-relaxed text-text/70">{product?.description}</p>

              <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-xs text-text/60">
                <span>Material: <strong className="text-brown">{product?.material}</strong></span>
                <span>Stone: <strong className="text-brown">{product?.stone}</strong></span>
                <span>Color: <strong className="text-brown">{product?.color}</strong></span>
              </div>

              <div className="mt-6 flex items-center gap-4">
                <div className="flex items-center rounded-full border border-border">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="flex h-10 w-10 items-center justify-center text-brown"
                    aria-label="Decrease quantity"
                  >
                    <HiOutlineMinus className="text-xs" />
                  </button>
                  <span className="w-8 text-center text-sm">{qty}</span>
                  <button
                    onClick={() => setQty((q) => q + 1)}
                    className="flex h-10 w-10 items-center justify-center text-brown"
                    aria-label="Increase quantity"
                  >
                    <HiOutlinePlus className="text-xs" />
                  </button>
                </div>

                <button
                  onClick={() => toggleWishlist(product)}
                  aria-label="Toggle wishlist"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-brown"
                >
                  {isWishlisted(product?.id) ? <HiHeart className="text-gold" /> : <HiOutlineHeart />}
                </button>
              </div>

              {product?.inStock ? (
                <div className="mt-6 flex gap-3">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 rounded-full bg-brown py-3.5 text-sm font-medium text-white transition-colors hover:bg-gold"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={handleBuyNow}
                    className="flex-1 rounded-full border border-gold py-3.5 text-sm font-medium text-brown transition-colors hover:bg-gold hover:text-white"
                  >
                    Buy Now
                  </button>
                </div>
              ) : (
                <div className="mt-6 rounded-full bg-beige py-3.5 text-center text-sm font-medium text-text/50">
                  Out of Stock
                </div>
              )}

              <Link
                to={`/product/${product?.slug}`}
                onClick={onClose}
                className="mt-4 text-center text-xs font-medium text-gold underline-offset-4 hover:underline"
              >
                View Full Details
              </Link>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
