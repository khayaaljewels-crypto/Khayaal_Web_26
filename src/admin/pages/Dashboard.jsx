import { Link } from 'react-router-dom';
import {
  HiOutlineSparkles,
  HiOutlineTag,
  HiOutlineRectangleStack,
  HiOutlineShoppingBag,
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineTruck,
  HiOutlineXCircle,
  HiOutlineExclamationTriangle,
  HiOutlineArchiveBoxXMark,
  HiOutlineUsers,
  HiOutlinePlus,
  HiOutlineChartBar,
} from 'react-icons/hi2';
import { useProducts } from '@/context/ProductsContext';
import { useCategories } from '@/context/CategoriesContext';
import { useCollections } from '@/context/CollectionsContext';
import { useOrders } from '@/context/OrdersContext';
import { formatPrice } from '@/utils/format';
import StatCard from '@/admin/components/StatCard';
import SimpleBarChart from '@/admin/components/SimpleBarChart';
import StatusBadge from '@/admin/components/StatusBadge';

function monthLabel(date) {
  return date.toLocaleDateString('en-IN', { month: 'short' });
}

export default function Dashboard() {
  const { allProducts } = useProducts();
  const { categories } = useCategories();
  const { collections } = useCollections();
  const { orders, customers } = useOrders();

  const stats = {
    totalProducts: allProducts.length,
    totalCategories: categories.length,
    totalCollections: collections.length,
    totalOrders: orders.length,
    pending: orders.filter((o) => o.status === 'New').length,
    confirmed: orders.filter((o) => o.status === 'Confirmed').length,
    delivered: orders.filter((o) => o.status === 'Delivered').length,
    cancelled: orders.filter((o) => o.status === 'Cancelled').length,
    lowStock: allProducts.filter((p) => p.lowStock).length,
    outOfStock: allProducts.filter((p) => !p.inStock).length,
    totalCustomers: customers.length,
  };

  const monthlyOrders = (() => {
    const now = new Date();
    const buckets = Array.from({ length: 6 }).map((_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      return { label: monthLabel(d), year: d.getFullYear(), month: d.getMonth(), value: 0 };
    });
    orders.forEach((o) => {
      const d = new Date(o.createdAt);
      const bucket = buckets.find((b) => b.year === d.getFullYear() && b.month === d.getMonth());
      if (bucket) bucket.value += 1;
    });
    return buckets;
  })();

  const bestSelling = (() => {
    const map = new Map();
    orders.forEach((o) => {
      o.items.forEach((item) => {
        map.set(item.name, (map.get(item.name) ?? 0) + item.quantity);
      });
    });
    return [...map.entries()]
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  })();

  const recentOrders = orders.slice(0, 5);
  const recentCustomers = customers.slice(0, 5);

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-gold">Overview</p>
          <h1 className="mt-2 font-heading text-3xl text-brown">Dashboard</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to="/admin/products/new" className="flex items-center gap-1.5 rounded-full bg-brown px-4 py-2.5 text-xs font-medium text-white hover:bg-gold">
            <HiOutlinePlus /> Add Product
          </Link>
          <Link to="/admin/categories" className="flex items-center gap-1.5 rounded-full border border-border px-4 py-2.5 text-xs font-medium text-brown hover:border-gold">
            <HiOutlineTag /> Add Category
          </Link>
          <Link to="/admin/orders" className="flex items-center gap-1.5 rounded-full border border-border px-4 py-2.5 text-xs font-medium text-brown hover:border-gold">
            <HiOutlineShoppingBag /> View Orders
          </Link>
          <a href="#charts" className="flex items-center gap-1.5 rounded-full border border-border px-4 py-2.5 text-xs font-medium text-brown hover:border-gold">
            <HiOutlineChartBar /> Analytics
          </a>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <StatCard label="Total Products" value={stats.totalProducts} icon={HiOutlineSparkles} to="/admin/products" tone="gold" />
        <StatCard label="Categories" value={stats.totalCategories} icon={HiOutlineTag} to="/admin/categories" />
        <StatCard label="Collections" value={stats.totalCollections} icon={HiOutlineRectangleStack} to="/admin/collections" />
        <StatCard label="Total Orders" value={stats.totalOrders} icon={HiOutlineShoppingBag} to="/admin/orders" />
        <StatCard label="Total Customers" value={stats.totalCustomers} icon={HiOutlineUsers} to="/admin/customers" />
        <StatCard label="Low Stock" value={stats.lowStock} icon={HiOutlineExclamationTriangle} to="/admin/products?stock=low" tone="warn" />
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Pending" value={stats.pending} icon={HiOutlineClock} to="/admin/orders?status=New" />
        <StatCard label="Confirmed" value={stats.confirmed} icon={HiOutlineCheckCircle} to="/admin/orders?status=Confirmed" />
        <StatCard label="Delivered" value={stats.delivered} icon={HiOutlineTruck} to="/admin/orders?status=Delivered" />
        <StatCard label="Cancelled" value={stats.cancelled} icon={HiOutlineXCircle} to="/admin/orders?status=Cancelled" tone="danger" />
      </div>

      {stats.outOfStock > 0 && (
        <Link
          to="/admin/products?stock=out"
          className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          <HiOutlineArchiveBoxXMark className="text-xl" />
          {stats.outOfStock} product{stats.outOfStock > 1 ? 's are' : ' is'} out of stock — review inventory
        </Link>
      )}

      <div id="charts" className="grid gap-6 scroll-mt-8 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-white p-6">
          <p className="font-heading text-lg text-brown">Orders by Month</p>
          <div className="mt-5">
            <SimpleBarChart data={monthlyOrders} />
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-white p-6">
          <p className="font-heading text-lg text-brown">Best Selling Products</p>
          <div className="mt-5">
            {bestSelling.length ? (
              <SimpleBarChart data={bestSelling} />
            ) : (
              <p className="text-sm text-text/50">No sales data yet.</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-white p-6">
          <div className="flex items-center justify-between">
            <p className="font-heading text-lg text-brown">Recent Orders</p>
            <Link to="/admin/orders" className="text-xs font-medium text-gold hover:underline">View All</Link>
          </div>
          <div className="mt-4 space-y-3">
            {recentOrders.length === 0 && <p className="text-sm text-text/50">No orders yet.</p>}
            {recentOrders.map((o) => (
              <Link key={o.id} to={`/admin/orders/${o.id}`} className="flex items-center justify-between rounded-xl p-2 text-sm hover:bg-beige">
                <div>
                  <p className="font-medium text-brown">{o.id}</p>
                  <p className="text-xs text-text/50">{o.customer.name}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-brown">{formatPrice(o.grandTotal)}</p>
                  <StatusBadge status={o.status} />
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-white p-6">
          <div className="flex items-center justify-between">
            <p className="font-heading text-lg text-brown">Recent Customers</p>
            <Link to="/admin/customers" className="text-xs font-medium text-gold hover:underline">View All</Link>
          </div>
          <div className="mt-4 space-y-3">
            {recentCustomers.length === 0 && <p className="text-sm text-text/50">No customers yet.</p>}
            {recentCustomers.map((c) => (
              <Link key={c.phone} to={`/admin/customers/${c.phone}`} className="flex items-center justify-between rounded-xl p-2 text-sm hover:bg-beige">
                <div>
                  <p className="font-medium text-brown">{c.name}</p>
                  <p className="text-xs text-text/50">{c.phone}</p>
                </div>
                <p className="font-medium text-brown">{formatPrice(c.totalSpent)}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
