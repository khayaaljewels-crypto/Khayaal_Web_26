import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineHeart } from 'react-icons/hi2';
import { useWishlist } from '@/context/WishlistContext';
import ProductCard from '@/components/cards/ProductCard';
import QuickViewModal from '@/components/shop/QuickViewModal';
import GoldButton from '@/components/buttons/GoldButton';
import Reveal from '@/components/animations/Reveal';

export default function Wishlist() {
  const { items } = useWishlist();
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  return (
    <div className="bg-bg pb-24 pt-28 lg:pt-32">
      <div className="container-luxury">
        <Reveal>
          <p className="eyebrow">Saved For You</p>
          <h1 className="mt-3 font-heading text-3xl text-brown sm:text-4xl">Your Wishlist</h1>
        </Reveal>

        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-beige">
              <HiOutlineHeart className="text-2xl text-gold" />
            </span>
            <h2 className="mt-6 font-heading text-xl text-brown">Your wishlist is empty</h2>
            <p className="mt-2 max-w-xs text-sm text-text/60">
              Tap the heart on any product to save it here for later.
            </p>
            <div className="mt-8">
              <GoldButton to="/shop">Explore the Collection</GoldButton>
            </div>
          </motion.div>
        ) : (
          <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-3 lg:gap-x-8 xl:grid-cols-4">
            {items.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} onQuickView={setQuickViewProduct} />
            ))}
          </div>
        )}
      </div>

      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </div>
  );
}
