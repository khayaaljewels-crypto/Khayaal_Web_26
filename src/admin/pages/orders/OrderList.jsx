import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useOrders } from '@/context/OrdersContext';
import { formatPrice } from '@/utils/format';
import { ORDER_STATUSES } from '@/data/constants';
import StatusBadge from '@/admin/components/StatusBadge';

export default function OrderList() {
  const { orders } = useOrders();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const statusFilter = searchParams.get('status') ?? '';

  const filtered = useMemo(() => {
    let list = orders;
    if (statusFilter) list = list.filter((o) => o.status === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((o) => o.id.toLowerCase().includes(q) || o.customer.name.toLowerCase().includes(q) || o.customer.phone.includes(q));
    }
    return list;
  }, [orders, statusFilter, search]);

  const setStatusFilter = (status) => {
    if (status) searchParams.set('status', status);
    else searchParams.delete('status');
    setSearchParams(searchParams);
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-gold">Sales</p>
        <h1 className="mt-2 font-heading text-3xl text-brown">Orders ({orders.length})</h1>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search order ID, customer, phone..."
          className="w-full max-w-xs rounded-full border border-border bg-white px-4 py-2.5 text-sm focus:border-gold focus:outline-none"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-full border border-border bg-white px-4 py-2.5 text-sm focus:border-gold focus:outline-none"
        >
          <option value="">All Statuses</option>
          {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-white">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs uppercase tracking-wide text-text/40">
              <th className="p-4">Order</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Items</th>
              <th className="p-4">Total</th>
              <th className="p-4">Date</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((o) => (
              <tr key={o.id} className="cursor-pointer border-b border-border last:border-b-0 hover:bg-beige/40">
                <td className="p-4">
                  <Link to={`/admin/orders/${o.id}`} className="font-medium text-brown hover:text-gold">{o.id}</Link>
                </td>
                <td className="p-4">
                  <p className="text-brown">{o.customer.name}</p>
                  <p className="text-xs text-text/50">{o.customer.phone}</p>
                </td>
                <td className="p-4 text-text/60">{o.items.reduce((s, i) => s + i.quantity, 0)} items</td>
                <td className="p-4 font-medium text-brown">{formatPrice(o.grandTotal)}</td>
                <td className="p-4 text-text/60">{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
                <td className="p-4"><StatusBadge status={o.status} /></td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="p-10 text-center text-sm text-text/50">No orders found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
