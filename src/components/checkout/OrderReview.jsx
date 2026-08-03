import { HiOutlinePencil } from 'react-icons/hi2';
import { FaWhatsapp } from 'react-icons/fa';
import { formatPrice } from '@/utils/format';
import { getItemPrice } from '@/context/CartContext';
import ImageWithFallback from '@/components/ui/ImageWithFallback';

export default function OrderReview({ customer, items, subtotal, discount, shippingFee, grandTotal, coupon, onEdit, onConfirm, submitting }) {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-white p-6 sm:p-8">
        <div className="flex items-center justify-between">
          <p className="font-heading text-lg text-brown">Customer &amp; Delivery Details</p>
          <button onClick={onEdit} className="flex items-center gap-1.5 text-xs font-medium text-gold hover:underline">
            <HiOutlinePencil /> Edit
          </button>
        </div>
        <div className="mt-4 grid gap-x-6 gap-y-2 text-sm text-text/70 sm:grid-cols-2">
          <p><span className="text-text/40">Name:</span> {customer.name}</p>
          <p><span className="text-text/40">Phone:</span> {customer.phone}</p>
          {customer.email && <p><span className="text-text/40">Email:</span> {customer.email}</p>}
          <p><span className="text-text/40">WhatsApp:</span> {customer.whatsapp}</p>
        </div>
        <div className="mt-4 border-t border-border pt-4 text-sm text-text/70">
          <p className="text-text/40">Delivery Address:</p>
          <p className="mt-1">{customer.address}</p>
          {customer.landmark && <p>Near {customer.landmark}</p>}
          <p>{customer.city}, {customer.state} - {customer.pincode}</p>
        </div>
        {customer.notes && (
          <div className="mt-4 border-t border-border pt-4 text-sm text-text/70">
            <p className="text-text/40">Order Notes:</p>
            <p className="mt-1">{customer.notes}</p>
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-border bg-white p-6 sm:p-8">
        <p className="font-heading text-lg text-brown">Order Items ({items.length})</p>
        <div className="mt-4 divide-y divide-border">
          {items.map((item) => (
            <div key={item.key} className="flex items-center gap-4 py-3">
              <ImageWithFallback src={item.product.images[0]} alt={item.product.name} loading="lazy" className="h-14 w-14 rounded-lg object-cover" />
              <div className="flex-1">
                <p className="text-sm text-brown">{item.product.name}</p>
                <p className="text-xs text-text/50">Qty: {item.quantity}</p>
              </div>
              <p className="text-sm font-medium text-brown">{formatPrice(getItemPrice(item) * item.quantity)}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
          <div className="flex justify-between text-text/70">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-gold">
              <span>Discount ({coupon})</span>
              <span>-{formatPrice(discount)}</span>
            </div>
          )}
          <div className="flex justify-between text-text/70">
            <span>Shipping</span>
            <span>{shippingFee === 0 ? 'Free' : formatPrice(shippingFee)}</span>
          </div>
          <div className="flex justify-between border-t border-border pt-3">
            <span className="font-heading text-base text-brown">Grand Total</span>
            <span className="font-heading text-xl text-brown">{formatPrice(grandTotal)}</span>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-beige px-6 py-4 text-center text-xs text-text/70">
        No online payment required. Our team will contact you on WhatsApp to confirm your order and payment method.
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          onClick={onEdit}
          className="flex-1 rounded-full border border-border py-4 text-sm font-medium text-brown transition-colors hover:border-gold"
        >
          Edit Order
        </button>
        <button
          onClick={onConfirm}
          disabled={submitting}
          className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#25D366] py-4 text-sm font-medium text-white transition-colors hover:bg-[#1ea952] disabled:opacity-60"
        >
          <FaWhatsapp className="text-base" />
          {submitting ? 'Opening WhatsApp...' : 'Confirm Order on WhatsApp'}
        </button>
      </div>
    </div>
  );
}
