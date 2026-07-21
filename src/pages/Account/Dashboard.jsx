import { Link } from 'react-router-dom';
import { HiOutlineShoppingBag, HiOutlineMapPin, HiOutlineUserCircle } from 'react-icons/hi2';
import { useCustomerAuth } from '@/context/CustomerAuthContext';
import { useMyOrders } from '@/hooks/useMyOrders';
import { formatPrice } from '@/utils/format';
import OrderStatusBadge from '@/components/account/OrderStatusBadge';
import Reveal from '@/components/animations/Reveal';

export default function AccountDashboard() {
  const { user } = useCustomerAuth();
  const { orders, loading } = useMyOrders();

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
    : '—';

  return (
    <div className="space-y-8">
      <Reveal>
        <p className="eyebrow">Welcome back</p>
        <h1 className="mt-2 font-heading text-2xl text-brown sm:text-3xl">{user?.fullName?.split(' ')[0]}</h1>
      </Reveal>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-white p-5">
          <p className="text-xs uppercase tracking-wide text-text/40">Total Orders</p>
          <p className="mt-2 font-heading text-3xl text-brown">{orders.length}</p>
        </div>
        <div className="rounded-2xl border border-border bg-white p-5">
          <p className="text-xs uppercase tracking-wide text-text/40">Member Since</p>
          <p className="mt-2 font-heading text-lg text-brown">{memberSince}</p>
        </div>
        <div className="col-span-2 rounded-2xl border border-border bg-white p-5 sm:col-span-1">
          <p className="text-xs uppercase tracking-wide text-text/40">Account Status</p>
          <p className="mt-2 font-heading text-lg capitalize text-green-700">{user?.status ?? 'active'}</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Link to="/my-account/profile" className="flex items-center gap-3 rounded-2xl border border-border bg-white p-5 transition-colors hover:border-gold">
          <HiOutlineUserCircle className="text-2xl text-gold" />
          <span className="text-sm font-medium text-brown">Edit My Profile</span>
        </Link>
        <Link to="/my-account/orders" className="flex items-center gap-3 rounded-2xl border border-border bg-white p-5 transition-colors hover:border-gold">
          <HiOutlineShoppingBag className="text-2xl text-gold" />
          <span className="text-sm font-medium text-brown">View Order History</span>
        </Link>
        <Link to="/my-account/addresses" className="flex items-center gap-3 rounded-2xl border border-border bg-white p-5 transition-colors hover:border-gold">
          <HiOutlineMapPin className="text-2xl text-gold" />
          <span className="text-sm font-medium text-brown">Manage Addresses</span>
        </Link>
      </div>

      <div className="rounded-2xl border border-border bg-white p-6">
        <div className="flex items-center justify-between">
          <p className="font-heading text-lg text-brown">Recent Orders</p>
          <Link to="/my-account/orders" className="text-xs font-medium text-gold hover:underline">View All</Link>
        </div>
        <div className="mt-4 space-y-3">
          {loading && <p className="text-sm text-text/50">Loading orders...</p>}
          {!loading && orders.length === 0 && <p className="text-sm text-text/50">No orders yet.</p>}
          {orders.slice(0, 3).map((o) => (
            <div key={o.id} className="flex items-center justify-between rounded-xl bg-beige/40 p-3 text-sm">
              <div>
                <p className="font-medium text-brown">{o.orderNumber}</p>
                <p className="text-xs text-text/50">{new Date(o.createdAt).toLocaleDateString('en-IN')}</p>
              </div>
              <div className="flex items-center gap-3">
                <p className="font-medium text-brown">{formatPrice(o.grandTotal)}</p>
                <OrderStatusBadge status={o.status} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
