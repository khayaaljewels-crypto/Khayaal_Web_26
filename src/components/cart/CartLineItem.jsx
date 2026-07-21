import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineMinus, HiOutlinePlus, HiOutlineTrash, HiOutlineBookmark, HiOutlineArrowUturnLeft } from 'react-icons/hi2';
import { formatPrice } from '@/utils/format';
import { getItemPrice } from '@/context/CartContext';

export default function CartLineItem({ item, mode = 'cart', onQtyChange, onRemove, onSaveForLater, onMoveToCart }) {
  const variant = item.variant ? item.product.variants?.find((v) => v.id === item.variant) : null;
  const price = getItemPrice(item);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -40, transition: { duration: 0.3 } }}
      className="flex gap-4 border-b border-border py-6 last:border-b-0 sm:gap-6"
    >
      <Link to={`/product/${item.product.slug}`} className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-beige sm:h-32 sm:w-32">
        <img src={item.product.images[0]} alt={item.product.name} className="h-full w-full object-cover" />
      </Link>

      <div className="flex flex-1 flex-col justify-between">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Link to={`/product/${item.product.slug}`}>
              <p className="font-heading text-sm text-brown sm:text-base">{item.product.name}</p>
            </Link>
            {variant && <p className="mt-1 text-xs text-text/50">Color: {variant.label}</p>}
            <p className="mt-1 font-medium text-brown">{formatPrice(price)}</p>
          </div>
          <button
            onClick={() => onRemove(item.key)}
            aria-label="Remove item"
            className="text-text/40 transition-colors hover:text-red-500"
          >
            <HiOutlineTrash />
          </button>
        </div>

        <div className="mt-3 flex items-center justify-between">
          {mode === 'cart' ? (
            <div className="flex items-center rounded-full border border-border">
              <button
                onClick={() => onQtyChange(item.key, item.quantity - 1)}
                className="flex h-8 w-8 items-center justify-center text-brown"
                aria-label="Decrease quantity"
              >
                <HiOutlineMinus className="text-xs" />
              </button>
              <span className="w-7 text-center text-sm">{item.quantity}</span>
              <button
                onClick={() => onQtyChange(item.key, item.quantity + 1)}
                className="flex h-8 w-8 items-center justify-center text-brown"
                aria-label="Increase quantity"
              >
                <HiOutlinePlus className="text-xs" />
              </button>
            </div>
          ) : (
            <span className="text-xs text-text/50">Qty: {item.quantity}</span>
          )}

          {mode === 'cart' && onSaveForLater && (
            <button
              onClick={() => onSaveForLater(item.key)}
              className="flex items-center gap-1.5 text-xs font-medium text-text/50 hover:text-gold"
            >
              <HiOutlineBookmark /> Save for Later
            </button>
          )}
          {mode === 'saved' && onMoveToCart && (
            <button
              onClick={() => onMoveToCart(item.key)}
              className="flex items-center gap-1.5 text-xs font-medium text-gold hover:underline"
            >
              <HiOutlineArrowUturnLeft /> Move to Cart
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
