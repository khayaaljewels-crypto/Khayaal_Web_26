import { useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { HiOutlineArrowLeft, HiOutlinePrinter, HiOutlineClipboard, HiOutlineTrash } from 'react-icons/hi2';
import { FaWhatsapp } from 'react-icons/fa';
import { useOrders } from '@/context/OrdersContext';
import { useSettings } from '@/context/SettingsContext';
import { formatPrice } from '@/utils/format';
import { buildWhatsAppOrderLink } from '@/utils/buildWhatsAppOrderMessage';
import { ORDER_STATUSES } from '@/data/constants';
import StatusBadge from '@/admin/components/StatusBadge';
import { inputClass } from '@/admin/components/AdminField';
import ImageWithFallback from '@/components/ui/ImageWithFallback';

export default function OrderDetail() {
  const { id } = useParams();
  const { getOrderById, updateOrderStatus, addInternalNote, deleteOrder } = useOrders();
  const { settings } = useSettings();
  const [note, setNote] = useState('');
  const order = getOrderById(id);

  if (!order) return <Navigate to="/admin/orders" replace />;

  const handleCopyAddress = () => {
    const text = `${order.customer.address}\n${order.customer.city}, ${order.customer.state} - ${order.customer.pincode}`;
    navigator.clipboard.writeText(text);
  };

  const handleAddNote = () => {
    if (!note.trim()) return;
    addInternalNote(order.id, note.trim());
    setNote('');
  };

  const handleDelete = () => {
    if (window.confirm('Delete this order record? This cannot be undone.')) {
      deleteOrder(order.id);
    }
  };

  return (
    <div className="space-y-6 print:space-y-4">
      <div className="flex flex-col gap-4 print:hidden sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <Link to="/admin/orders" className="text-text/50 hover:text-brown"><HiOutlineArrowLeft className="text-xl" /></Link>
          <h1 className="font-heading text-2xl text-brown sm:text-3xl">{order.id}</h1>
          <StatusBadge status={order.status} />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <a
            href={buildWhatsAppOrderLink(order, settings.whatsappNumber)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-full bg-[#25D366] px-4 py-2.5 text-xs font-medium text-white hover:bg-[#1ea952]"
          >
            <FaWhatsapp /> Message Customer
          </a>
          <button onClick={() => window.print()} className="flex items-center gap-1.5 rounded-full border border-border px-4 py-2.5 text-xs font-medium text-brown hover:border-gold">
            <HiOutlinePrinter /> Print
          </button>
          <button onClick={handleDelete} className="flex items-center gap-1.5 rounded-full border border-red-200 px-4 py-2.5 text-xs font-medium text-red-600 hover:bg-red-50">
            <HiOutlineTrash />
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="rounded-2xl border border-border bg-white p-6">
            <p className="font-heading text-lg text-brown">Items</p>
            <div className="mt-4 divide-y divide-border">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center gap-4 py-3">
                  <ImageWithFallback src={item.image} alt={item.name} className="h-14 w-14 rounded-lg object-cover" />
                  <div className="flex-1">
                    <p className="text-sm text-brown">{item.name}</p>
                    <p className="text-xs text-text/50">{item.variantLabel && `${item.variantLabel} · `}Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-medium text-brown">{formatPrice(item.lineTotal)}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-1.5 border-t border-border pt-4 text-sm">
              <div className="flex justify-between text-text/60"><span>Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
              {order.discount > 0 && <div className="flex justify-between text-gold"><span>Discount ({order.coupon})</span><span>-{formatPrice(order.discount)}</span></div>}
              <div className="flex justify-between text-text/60"><span>Shipping</span><span>{order.shippingFee === 0 ? 'Free' : formatPrice(order.shippingFee)}</span></div>
              <div className="flex justify-between border-t border-border pt-2 font-heading text-base text-brown"><span>Grand Total</span><span>{formatPrice(order.grandTotal)}</span></div>
            </div>
            {order.notes && (
              <div className="mt-4 rounded-xl bg-beige/50 p-3 text-xs text-text/70">
                <span className="font-medium text-brown">Customer Notes: </span>{order.notes}
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-border bg-white p-6 print:hidden">
            <p className="font-heading text-lg text-brown">Internal Notes</p>
            <div className="mt-3 space-y-2">
              {(order.internalNotes ?? []).map((n, i) => (
                <div key={i} className="rounded-xl bg-beige/50 p-3 text-xs text-text/70">
                  <p>{n.text}</p>
                  <p className="mt-1 text-text/40">{new Date(n.at).toLocaleString('en-IN')}</p>
                </div>
              ))}
              {(order.internalNotes ?? []).length === 0 && <p className="text-xs text-text/40">No internal notes yet.</p>}
            </div>
            <div className="mt-3 flex gap-2">
              <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add a note for the team..." className={inputClass} />
              <button onClick={handleAddNote} className="rounded-full bg-brown px-4 py-2 text-xs font-medium text-white hover:bg-gold">Add</button>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-2xl border border-border bg-white p-6 print:hidden">
            <p className="font-heading text-lg text-brown">Order Status</p>
            <select
              value={order.status}
              onChange={(e) => updateOrderStatus(order.id, e.target.value)}
              className={`mt-3 ${inputClass}`}
            >
              {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </section>

          <section className="rounded-2xl border border-border bg-white p-6">
            <p className="font-heading text-lg text-brown">Customer</p>
            <div className="mt-3 space-y-1.5 text-sm text-text/70">
              <p><span className="text-text/40">Name:</span> {order.customer.name}</p>
              <p><span className="text-text/40">Phone:</span> {order.customer.phone}</p>
              {order.customer.email && <p><span className="text-text/40">Email:</span> {order.customer.email}</p>}
              <Link to={`/admin/customers/${order.customer.phone}`} className="mt-2 inline-block text-xs font-medium text-gold hover:underline">
                View Customer Profile →
              </Link>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-white p-6">
            <div className="flex items-center justify-between">
              <p className="font-heading text-lg text-brown">Delivery Address</p>
              <button onClick={handleCopyAddress} aria-label="Copy address" className="text-text/40 hover:text-gold print:hidden">
                <HiOutlineClipboard />
              </button>
            </div>
            <p className="mt-3 text-sm text-text/70">
              {order.customer.address}
              {order.customer.landmark && <><br />Near {order.customer.landmark}</>}
              <br />{order.customer.city}, {order.customer.state} - {order.customer.pincode}
            </p>
            <p className="mt-3 text-xs text-text/40">Placed on {new Date(order.createdAt).toLocaleString('en-IN')}</p>
          </section>
        </div>
      </div>
    </div>
  );
}
