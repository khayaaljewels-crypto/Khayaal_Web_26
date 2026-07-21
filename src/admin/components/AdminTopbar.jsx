import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiOutlineBars3, HiOutlineArrowRightOnRectangle, HiOutlineGlobeAlt, HiOutlineMagnifyingGlass } from 'react-icons/hi2';
import { useAdminAuth } from '@/admin/context/AdminAuthContext';
import { useProducts } from '@/context/ProductsContext';
import { useOrders } from '@/context/OrdersContext';

export default function AdminTopbar({ onOpenMobile }) {
  const { logout } = useAdminAuth();
  const { products } = useProducts();
  const { orders, customers } = useOrders();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);

  const results = query.trim()
    ? {
        products: products.filter((p) => p.name.toLowerCase().includes(query.toLowerCase())).slice(0, 4),
        orders: orders.filter((o) => o.id.toLowerCase().includes(query.toLowerCase())).slice(0, 4),
        customers: customers.filter((c) => c.name.toLowerCase().includes(query.toLowerCase())).slice(0, 4),
      }
    : null;

  const goTo = (path) => {
    navigate(path);
    setQuery('');
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-border bg-white/90 px-6 backdrop-blur-xl">
      <button onClick={onOpenMobile} className="text-brown lg:hidden" aria-label="Open menu">
        <HiOutlineBars3 className="text-2xl" />
      </button>

      <div className="relative hidden flex-1 max-w-md lg:block">
        <HiOutlineMagnifyingGlass className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text/40" />
        <input
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder="Search products, orders, customers..."
          className="w-full rounded-full border border-border bg-beige/40 py-2.5 pl-10 pr-4 text-sm focus:border-gold focus:outline-none"
        />
        {open && results && (
          <div className="absolute left-0 right-0 top-full mt-2 rounded-2xl border border-border bg-white p-3 text-sm shadow-soft">
            {results.products.length === 0 && results.orders.length === 0 && results.customers.length === 0 && (
              <p className="p-2 text-xs text-text/50">No results</p>
            )}
            {results.products.map((p) => (
              <button key={p.id} onMouseDown={() => goTo(`/admin/products/${p.id}/edit`)} className="block w-full rounded-lg p-2 text-left hover:bg-beige">
                <span className="text-text/40">Product · </span>{p.name}
              </button>
            ))}
            {results.orders.map((o) => (
              <button key={o.id} onMouseDown={() => goTo(`/admin/orders/${o.id}`)} className="block w-full rounded-lg p-2 text-left hover:bg-beige">
                <span className="text-text/40">Order · </span>{o.id} — {o.customer.name}
              </button>
            ))}
            {results.customers.map((c) => (
              <button key={c.phone} onMouseDown={() => goTo(`/admin/customers/${c.phone}`)} className="block w-full rounded-lg p-2 text-left hover:bg-beige">
                <span className="text-text/40">Customer · </span>{c.name}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        <Link
          to="/"
          target="_blank"
          className="flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-xs font-medium text-brown hover:border-gold"
        >
          <HiOutlineGlobeAlt /> View Site
        </Link>
        <button
          onClick={logout}
          className="flex items-center gap-1.5 rounded-full bg-brown px-4 py-2 text-xs font-medium text-white hover:bg-gold"
        >
          <HiOutlineArrowRightOnRectangle /> Logout
        </button>
      </div>
    </header>
  );
}
