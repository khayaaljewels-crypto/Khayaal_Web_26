import { Link, Navigate, useParams } from 'react-router-dom';
import { HiOutlineArrowLeft } from 'react-icons/hi2';
import { FaWhatsapp } from 'react-icons/fa';
import { useOrders } from '@/context/OrdersContext';
import { formatPrice } from '@/utils/format';
import StatusBadge from '@/admin/components/StatusBadge';

export default function CustomerDetail() {
  const { phone } = useParams();
  const { getCustomerByPhone } = useOrders();
  const customer = getCustomerByPhone(phone);

  if (!customer) return <Navigate to="/admin/customers" replace />;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/admin/customers" className="text-text/50 hover:text-brown"><HiOutlineArrowLeft className="text-xl" /></Link>
        <h1 className="font-heading text-3xl text-brown">{customer.name}</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="rounded-2xl border border-border bg-white p-6">
          <p className="font-heading text-lg text-brown">Contact Details</p>
          <div className="mt-3 space-y-1.5 text-sm text-text/70">
            <p><span className="text-text/40">Phone:</span> {customer.phone}</p>
            {customer.email && <p><span className="text-text/40">Email:</span> {customer.email}</p>}
            <p><span className="text-text/40">Location:</span> {customer.city}, {customer.state}</p>
          </div>
          <a
            href={`https://wa.me/${customer.phone.replace(/\D/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex w-fit items-center gap-1.5 rounded-full bg-[#25D366] px-4 py-2 text-xs font-medium text-white hover:bg-[#1ea952]"
          >
            <FaWhatsapp /> Message on WhatsApp
          </a>
        </section>

        <section className="rounded-2xl border border-border bg-white p-6">
          <p className="text-xs uppercase tracking-wide text-text/40">Total Orders</p>
          <p className="mt-2 font-heading text-3xl text-brown">{customer.orders.length}</p>
        </section>

        <section className="rounded-2xl border border-border bg-white p-6">
          <p className="text-xs uppercase tracking-wide text-text/40">Total Spent</p>
          <p className="mt-2 font-heading text-3xl text-brown">{formatPrice(customer.totalSpent)}</p>
        </section>
      </div>

      <section className="rounded-2xl border border-border bg-white p-6">
        <p className="font-heading text-lg text-brown">Order History</p>
        <div className="mt-4 divide-y divide-border">
          {customer.orders.map((o) => (
            <Link key={o.id} to={`/admin/orders/${o.id}`} className="flex items-center justify-between py-3 text-sm hover:bg-beige/40">
              <div>
                <p className="font-medium text-brown">{o.id}</p>
                <p className="text-xs text-text/50">{new Date(o.createdAt).toLocaleDateString('en-IN')}</p>
              </div>
              <div className="flex items-center gap-3">
                <p className="font-medium text-brown">{formatPrice(o.grandTotal)}</p>
                <StatusBadge status={o.status} />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
