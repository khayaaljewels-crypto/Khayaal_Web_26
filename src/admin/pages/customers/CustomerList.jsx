import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineArrowDownTray } from 'react-icons/hi2';
import { useOrders } from '@/context/OrdersContext';
import { formatPrice } from '@/utils/format';
import { downloadCSV } from '@/utils/csv';

export default function CustomerList() {
  const { customers } = useOrders();
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search.trim()) return customers;
    const q = search.toLowerCase();
    return customers.filter((c) => c.name.toLowerCase().includes(q) || c.phone.includes(q));
  }, [customers, search]);

  const handleExport = () => {
    downloadCSV(
      'khayaal-customers.csv',
      filtered.map((c) => ({
        name: c.name, phone: c.phone, email: c.email ?? '', city: c.city, state: c.state,
        orders: c.orders.length, totalSpent: c.totalSpent,
      }))
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-gold">Customers</p>
          <h1 className="mt-2 font-heading text-3xl text-brown">Customers ({customers.length})</h1>
        </div>
        <button onClick={handleExport} className="flex items-center gap-1.5 rounded-full border border-border px-4 py-2.5 text-xs font-medium text-brown hover:border-gold">
          <HiOutlineArrowDownTray /> Export CSV
        </button>
      </div>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by name or phone..."
        className="w-full max-w-xs rounded-full border border-border bg-white px-4 py-2.5 text-sm focus:border-gold focus:outline-none"
      />

      <div className="overflow-x-auto rounded-2xl border border-border bg-white">
        <table className="w-full min-w-[600px] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs uppercase tracking-wide text-text/40">
              <th className="p-4">Name</th>
              <th className="p-4">Phone</th>
              <th className="p-4">Location</th>
              <th className="p-4">Orders</th>
              <th className="p-4">Total Spent</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.phone} className="border-b border-border last:border-b-0 hover:bg-beige/40">
                <td className="p-4">
                  <Link to={`/admin/customers/${c.phone}`} className="font-medium text-brown hover:text-gold">{c.name}</Link>
                </td>
                <td className="p-4 text-text/60">{c.phone}</td>
                <td className="p-4 text-text/60">{c.city}, {c.state}</td>
                <td className="p-4 text-text/60">{c.orders.length}</td>
                <td className="p-4 font-medium text-brown">{formatPrice(c.totalSpent)}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={5} className="p-10 text-center text-sm text-text/50">No customers yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
