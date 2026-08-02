import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  HiOutlinePlus,
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlineDocumentDuplicate,
  HiOutlineEye,
  HiOutlineEyeSlash,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
} from 'react-icons/hi2';
import { useAdminProducts } from '@/admin/hooks/useAdminProducts';
import { useCategories } from '@/context/CategoriesContext';
import { useToast } from '@/admin/context/ToastContext';
import { formatPrice } from '@/utils/format';
import ImageWithFallback from '@/components/ui/ImageWithFallback';

const PAGE_SIZE = 10;

export default function ProductList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState([]);
  const toast = useToast();

  const stockFilter = searchParams.get('stock');

  // Debounced so typing doesn't fire a request per keystroke.
  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchInput), 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const { categories } = useCategories();
  const { products, meta, loading, error, deleteProduct, deleteProducts, bulkUpdate, duplicateProduct } =
    useAdminProducts({ search, category: categoryFilter, stock: stockFilter, page, pageSize: PAGE_SIZE });

  const pageCount = Math.max(1, Math.ceil(meta.total / PAGE_SIZE));

  const toggleSelect = (id) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const toggleSelectAll = () =>
    setSelected((prev) => (prev.length === products.length ? [] : products.map((p) => p.id)));

  const runOrToast = async (action) => {
    try {
      await action();
    } catch (err) {
      toast.error(err.message || 'Something went wrong.');
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this product? This cannot be undone.')) {
      runOrToast(() => deleteProduct(id));
    }
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Delete ${selected.length} selected product(s)? This cannot be undone.`)) {
      runOrToast(async () => {
        await deleteProducts(selected);
        setSelected([]);
      });
    }
  };

  const clearStockFilter = () => {
    searchParams.delete('stock');
    setSearchParams(searchParams);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-gold">Catalogue</p>
          <h1 className="mt-2 font-heading text-3xl text-brown">Products ({meta.total})</h1>
        </div>
        <Link to="/admin/products/new" className="flex w-fit items-center gap-1.5 rounded-full bg-brown px-5 py-3 text-sm font-medium text-white hover:bg-gold">
          <HiOutlinePlus /> Add Product
        </Link>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <input
          value={searchInput}
          onChange={(e) => { setSearchInput(e.target.value); setPage(1); }}
          placeholder="Search by name or SKU..."
          className="w-full max-w-xs rounded-full border border-border bg-white px-4 py-2.5 text-sm focus:border-gold focus:outline-none"
        />
        <select
          value={categoryFilter}
          onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
          className="rounded-full border border-border bg-white px-4 py-2.5 text-sm focus:border-gold focus:outline-none"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>{c.name}</option>
          ))}
        </select>
        {stockFilter && (
          <button onClick={clearStockFilter} className="rounded-full bg-gold/10 px-4 py-2.5 text-xs font-medium text-gold">
            Filter: {stockFilter === 'low' ? 'Low Stock' : 'Out of Stock'} ✕
          </button>
        )}
        {selected.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-text/50">{selected.length} selected</span>
            <button onClick={() => runOrToast(() => bulkUpdate(selected, { isPublished: true }))} className="rounded-full border border-border px-3 py-1.5 text-xs hover:border-gold">Publish</button>
            <button onClick={() => runOrToast(() => bulkUpdate(selected, { isPublished: false }))} className="rounded-full border border-border px-3 py-1.5 text-xs hover:border-gold">Hide</button>
            <button onClick={handleBulkDelete} className="rounded-full border border-red-200 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50">Delete</button>
          </div>
        )}
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
      )}

      <div className="overflow-x-auto rounded-2xl border border-border bg-white">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs uppercase tracking-wide text-text/40">
              <th className="w-10 p-4">
                <input type="checkbox" checked={selected.length === products.length && products.length > 0} onChange={toggleSelectAll} />
              </th>
              <th className="p-4">Product</th>
              <th className="p-4">SKU</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price</th>
              <th className="p-4">Stock</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={8} className="p-10 text-center text-sm text-text/50">Loading…</td>
              </tr>
            )}
            {!loading && products.map((p) => (
              <tr key={p.id} className="border-b border-border last:border-b-0 hover:bg-beige/40">
                <td className="p-4">
                  <input type="checkbox" checked={selected.includes(p.id)} onChange={() => toggleSelect(p.id)} />
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <ImageWithFallback src={p.images[0]} alt={p.name} className="h-11 w-11 rounded-lg object-cover bg-beige" />
                    <div>
                      <p className="font-medium text-brown">{p.name}</p>
                      <div className="mt-0.5 flex gap-1">
                        {p.isFeatured && <span className="rounded bg-gold/10 px-1.5 py-0.5 text-[10px] text-gold">Featured</span>}
                        {p.isTrending && <span className="rounded bg-blue-50 px-1.5 py-0.5 text-[10px] text-blue-600">Trending</span>}
                        {p.isComingSoon && <span className="rounded bg-purple-50 px-1.5 py-0.5 text-[10px] text-purple-600">Coming Soon</span>}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-text/60">{p.sku}</td>
                <td className="p-4 text-text/60 capitalize">{p.category?.name ?? '—'}</td>
                <td className="p-4 font-medium text-brown">{formatPrice(p.price)}</td>
                <td className="p-4">
                  <span className={p.inStock ? (p.lowStock ? 'text-amber-600' : 'text-green-700') : 'text-red-500'}>
                    {p.stockQty} {p.lowStock && '(Low)'}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`rounded-full px-2.5 py-1 text-xs ${p.isPublished ? 'bg-green-50 text-green-700' : 'bg-beige text-text/50'}`}>
                    {p.isPublished ? 'Published' : 'Hidden'}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-end gap-2 text-text/50">
                    <Link to={`/admin/products/${p.id}/edit`} aria-label="Edit" className="hover:text-gold"><HiOutlinePencilSquare /></Link>
                    <button onClick={() => runOrToast(() => bulkUpdate([p.id], { isPublished: !p.isPublished }))} aria-label="Toggle publish" className="hover:text-gold">
                      {p.isPublished ? <HiOutlineEyeSlash /> : <HiOutlineEye />}
                    </button>
                    <button onClick={() => runOrToast(() => duplicateProduct(p.id))} aria-label="Duplicate" className="hover:text-gold"><HiOutlineDocumentDuplicate /></button>
                    <button onClick={() => handleDelete(p.id)} aria-label="Delete" className="hover:text-red-500"><HiOutlineTrash /></button>
                  </div>
                </td>
              </tr>
            ))}
            {!loading && products.length === 0 && (
              <tr>
                <td colSpan={8} className="p-10 text-center text-sm text-text/50">No products found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {pageCount > 1 && (
        <div className="flex items-center justify-center gap-3">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="rounded-full border border-border p-2 disabled:opacity-30">
            <HiOutlineChevronLeft />
          </button>
          <span className="text-sm text-text/60">Page {page} of {pageCount}</span>
          <button onClick={() => setPage((p) => Math.min(pageCount, p + 1))} disabled={page === pageCount} className="rounded-full border border-border p-2 disabled:opacity-30">
            <HiOutlineChevronRight />
          </button>
        </div>
      )}
    </div>
  );
}
