import { useState } from 'react';
import {
  HiHeart,
  HiOutlineHeart,
  HiOutlineShare,
  HiOutlineLink,
  HiOutlineArrowsRightLeft,
  HiOutlineMinus,
  HiOutlinePlus,
  HiStar,
  HiCheckCircle,
  HiXCircle,
} from 'react-icons/hi2';
import { formatPrice } from '@/utils/format';
import { useWishlist } from '@/context/WishlistContext';
import { useCompare } from '@/context/CompareContext';
import { ColorVariantSelector, RingSizeSelector } from './VariantSelector';
import PincodeChecker from './PincodeChecker';

export default function PurchasePanel({
  product,
  activeVariantId,
  onVariantChange,
  activeSize,
  onSizeChange,
  qty,
  onQtyChange,
  onAddToCart,
  onBuyNow,
  effectivePrice,
  effectiveOldPrice,
}) {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { isComparing, toggleCompare } = useCompare();
  const [copied, setCopied] = useState(false);

  const wishlisted = isWishlisted(product.id);
  const comparing = isComparing(product.id);
  const sizeRequired = product.ringSizes && !activeSize;

  const handleShare = async () => {
    const shareData = { title: product.name, text: product.name, url: window.location.href };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // user cancelled — no-op
      }
    } else {
      handleCopyLink();
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <p className="eyebrow">{product.collection?.name}</p>
      <h1 className="mt-2 font-heading text-2xl text-brown sm:text-3xl">{product.name}</h1>

      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-text/50">
        <span>SKU: {product.sku}</span>
        <span>Brand: {product.brand}</span>
      </div>

      <a href="#reviews" className="mt-3 flex w-fit items-center gap-1.5 text-gold">
        {Array.from({ length: 5 }).map((_, i) => (
          <HiStar key={i} className={`text-sm ${i < Math.round(product.rating) ? '' : 'opacity-25'}`} />
        ))}
        <span className="ml-1 text-xs text-text/50 underline-offset-2 hover:underline">
          {product.rating} ({product.reviewCount} reviews)
        </span>
      </a>

      <div className="mt-5 flex items-baseline gap-3">
        <span className="font-heading text-3xl text-brown">{formatPrice(effectivePrice)}</span>
        {effectiveOldPrice && (
          <span className="text-base text-text/40 line-through">{formatPrice(effectiveOldPrice)}</span>
        )}
        {product.discount > 0 && <span className="text-sm font-semibold text-gold">-{product.discount}% OFF</span>}
      </div>
      <p className="mt-1 text-xs text-text/50">Inclusive of all taxes (GST)</p>

      <div className="mt-3 flex items-center gap-1.5 text-sm">
        {product.inStock ? (
          <>
            <HiCheckCircle className="text-green-600" />
            <span className="font-medium text-green-700">
              In Stock {product.lowStock && <span className="text-gold">— Only a few left</span>}
            </span>
          </>
        ) : (
          <>
            <HiXCircle className="text-red-500" />
            <span className="font-medium text-red-500">Out of Stock</span>
          </>
        )}
      </div>

      <div className="mt-6 space-y-5 border-y border-border py-6">
        <ColorVariantSelector variants={product.variants} activeId={activeVariantId} onChange={onVariantChange} />
        {product.ringSizes && (
          <RingSizeSelector sizes={product.ringSizes} activeSize={activeSize} onChange={onSizeChange} />
        )}
      </div>

      <div className="mt-6 flex items-center gap-4">
        <div className="flex items-center rounded-full border border-border">
          <button
            onClick={() => onQtyChange(Math.max(1, qty - 1))}
            className="flex h-11 w-11 items-center justify-center text-brown"
            aria-label="Decrease quantity"
          >
            <HiOutlineMinus className="text-xs" />
          </button>
          <span className="w-8 text-center text-sm">{qty}</span>
          <button
            onClick={() => onQtyChange(qty + 1)}
            className="flex h-11 w-11 items-center justify-center text-brown"
            aria-label="Increase quantity"
          >
            <HiOutlinePlus className="text-xs" />
          </button>
        </div>

        <button
          onClick={() => toggleWishlist(product)}
          aria-label="Toggle wishlist"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-brown transition-colors hover:border-gold"
        >
          {wishlisted ? <HiHeart className="text-gold" /> : <HiOutlineHeart />}
        </button>

        <button
          onClick={() => toggleCompare(product)}
          aria-label="Compare"
          className={`flex h-11 w-11 items-center justify-center rounded-full border transition-colors ${
            comparing ? 'border-gold text-gold' : 'border-border text-brown hover:border-gold'
          }`}
        >
          <HiOutlineArrowsRightLeft />
        </button>
      </div>

      {sizeRequired && <p className="mt-3 text-xs text-gold">Please select a ring size to continue.</p>}

      <div className="mt-4 hidden gap-3 sm:flex">
        <button
          onClick={onAddToCart}
          disabled={!product.inStock || sizeRequired}
          className="flex-1 rounded-full bg-brown py-4 text-sm font-medium text-white transition-colors hover:bg-gold disabled:cursor-not-allowed disabled:opacity-40"
        >
          Add to Cart
        </button>
        <button
          onClick={onBuyNow}
          disabled={!product.inStock || sizeRequired}
          className="flex-1 rounded-full border border-gold py-4 text-sm font-medium text-brown transition-colors hover:bg-gold hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          Buy Now
        </button>
      </div>

      <div className="mt-4 flex items-center gap-5">
        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 text-xs font-medium text-text/60 hover:text-gold"
        >
          <HiOutlineShare /> Share
        </button>
        <button
          onClick={handleCopyLink}
          className="flex items-center gap-1.5 text-xs font-medium text-text/60 hover:text-gold"
        >
          <HiOutlineLink /> {copied ? 'Link Copied!' : 'Copy Link'}
        </button>
      </div>

      <div className="mt-6">
        <PincodeChecker
          deliveryDays={product.deliveryDays}
          codAvailable={product.codAvailable}
          returnDays={product.returnDays}
        />
      </div>
    </div>
  );
}
