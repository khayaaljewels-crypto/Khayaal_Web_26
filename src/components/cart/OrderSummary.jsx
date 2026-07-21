import { useState } from 'react';
import { HiOutlineTicket, HiOutlineXMark } from 'react-icons/hi2';
import { formatPrice } from '@/utils/format';
import { useCart } from '@/context/CartContext';
import GoldButton from '@/components/buttons/GoldButton';

export default function OrderSummary({ showCheckoutButton = true }) {
  const {
    subtotal,
    discount,
    shippingFee,
    grandTotal,
    couponCode,
    couponError,
    applyCoupon,
    removeCoupon,
    freeShippingThreshold,
  } = useCart();
  const [code, setCode] = useState('');

  const handleApply = (e) => {
    e.preventDefault();
    if (!code.trim()) return;
    if (applyCoupon(code)) setCode('');
  };

  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - (subtotal - discount));

  return (
    <div className="rounded-2xl border border-border bg-white p-6">
      <p className="font-heading text-lg text-brown">Order Summary</p>

      {!couponCode ? (
        <form onSubmit={handleApply} className="mt-4 flex gap-2">
          <div className="relative flex-1">
            <HiOutlineTicket className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text/40" />
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Coupon code"
              className="w-full rounded-full border border-border py-2.5 pl-10 pr-4 text-sm focus:border-gold focus:outline-none"
            />
          </div>
          <button type="submit" className="rounded-full border border-gold px-5 py-2.5 text-xs font-medium text-brown hover:bg-gold hover:text-white">
            Apply
          </button>
        </form>
      ) : (
        <div className="mt-4 flex items-center justify-between rounded-full bg-gold/10 px-4 py-2.5 text-xs font-medium text-brown">
          <span>Coupon "{couponCode}" applied</span>
          <button onClick={removeCoupon} aria-label="Remove coupon">
            <HiOutlineXMark />
          </button>
        </div>
      )}
      {couponError && <p className="mt-2 text-xs text-red-500">{couponError}</p>}
      <p className="mt-2 text-[11px] text-text/40">Try KHAYAAL10 or WELCOME200</p>

      {remainingForFreeShipping > 0 && (
        <p className="mt-4 rounded-lg bg-beige px-3 py-2 text-xs text-brown">
          Add {formatPrice(remainingForFreeShipping)} more for free shipping
        </p>
      )}

      <div className="mt-5 space-y-2.5 border-t border-border pt-5 text-sm">
        <div className="flex justify-between text-text/70">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-gold">
            <span>Discount</span>
            <span>-{formatPrice(discount)}</span>
          </div>
        )}
        <div className="flex justify-between text-text/70">
          <span>Shipping</span>
          <span>{shippingFee === 0 ? 'Free' : formatPrice(shippingFee)}</span>
        </div>
      </div>

      <div className="mt-4 flex justify-between border-t border-border pt-4">
        <span className="font-heading text-base text-brown">Total</span>
        <span className="font-heading text-xl text-brown">{formatPrice(grandTotal)}</span>
      </div>

      {showCheckoutButton && (
        <GoldButton to="/checkout" className="mt-6 w-full justify-center">
          Proceed to Checkout
        </GoldButton>
      )}
    </div>
  );
}
