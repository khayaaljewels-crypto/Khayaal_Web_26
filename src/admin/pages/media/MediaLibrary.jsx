import { useEffect, useRef, useState } from 'react';
import { HiOutlineTrash, HiOutlineArrowPath, HiOutlinePlus, HiOutlineMagnifyingGlass } from 'react-icons/hi2';
import { api } from '@/utils/apiClient';
import { useAdminProducts } from '@/admin/hooks/useAdminProducts';

function ReuseMenu({ products, onReuse }) {
  const [open, setOpen] = useState(false);
  const [targetId, setTargetId] = useState('');

  const handleAdd = () => {
    if (!targetId) return;
    onReuse(targetId);
    setOpen(false);
    setTargetId('');
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Reuse for another product"
        className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-brown hover:text-gold"
      >
        <HiOutlinePlus className="text-sm" />
      </button>
    );
  }

  return (
    <div className="absolute inset-x-1 bottom-1 flex items-center gap-1 rounded-lg bg-white p-1" onClick={(e) => e.stopPropagation()}>
      <select
        value={targetId}
        onChange={(e) => setTargetId(e.target.value)}
        className="min-w-0 flex-1 rounded-md border border-border px-1 py-0.5 text-[10px]"
      >
        <option value="">Add to...</option>
        {products.map((p) => (
          <option key={p.id} value={p.id}>{p.name}</option>
        ))}
      </select>
      <button type="button" onClick={handleAdd} className="shrink-0 text-[10px] font-medium text-gold hover:underline">Add</button>
    </div>
  );
}

export default function MediaLibrary() {
  // A flat, generously-sized page for the "which product" dropdowns below —
  // fine for browsing/reuse purposes; the product catalogue itself is never
  // loaded in bulk like this anywhere else (see useProductList for the real,
  // server-paginated listing).
  const { products } = useAdminProducts({ pageSize: 200 });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [productFilter, setProductFilter] = useState('');
  const [error, setError] = useState('');
  const replaceInputRef = useRef(null);
  const [replacingId, setReplacingId] = useState(null);

  const productName = (productId) => products.find((p) => p.id === productId)?.name ?? productId;

  const load = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.set('search', search.trim());
      if (productFilter) params.set('productId', productFilter);
      const query = params.toString() ? `?${params.toString()}` : '';
      const { images: fetched } = await api.get(`/api/admin/media${query}`);
      setImages(fetched);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, productFilter]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this image? Any product still referencing it will show a broken image.')) return;
    try {
      await api.delete(`/api/admin/images/${id}`);
      setImages((prev) => prev.filter((img) => img.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleReplaceClick = (id) => {
    setReplacingId(id);
    replaceInputRef.current?.click();
  };

  const handleReplaceFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || !replacingId) return;
    try {
      const formData = new FormData();
      formData.append('image', file);
      const { image } = await api.uploadPut(`/api/admin/images/${replacingId}/replace`, formData);
      setImages((prev) => prev.map((img) => (img.id === image.id ? { ...image, _bust: Date.now() } : img)));
    } catch (err) {
      setError(err.message);
    } finally {
      setReplacingId(null);
    }
  };

  const handleReuse = async (imageId, targetProductId) => {
    try {
      await api.post(`/api/admin/images/${imageId}/attach`, { targetProductId });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-gold">Catalogue</p>
        <h1 className="mt-2 font-heading text-3xl text-brown">Media Library ({images.length})</h1>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative w-full max-w-xs">
          <HiOutlineMagnifyingGlass className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text/40" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by filename..."
            className="w-full rounded-full border border-border bg-white py-2.5 pl-10 pr-4 text-sm focus:border-gold focus:outline-none"
          />
        </div>
        <select
          value={productFilter}
          onChange={(e) => setProductFilter(e.target.value)}
          className="rounded-full border border-border bg-white px-4 py-2.5 text-sm focus:border-gold focus:outline-none"
        >
          <option value="">All Products</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}
      <input ref={replaceInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleReplaceFile} />

      {loading ? (
        <p className="text-sm text-text/50">Loading images...</p>
      ) : images.length === 0 ? (
        <p className="rounded-2xl border border-border bg-white p-8 text-center text-sm text-text/50">
          No uploaded images {search || productFilter ? 'match this filter' : 'yet'} — upload images from a product's edit page.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {images.map((img) => (
            <div key={img.id} className="group relative overflow-hidden rounded-2xl border border-border bg-white">
              <div className="aspect-square bg-beige">
                <img src={img._bust ? `${img.url}?t=${img._bust}` : img.url} alt="" className="h-full w-full object-cover" />
              </div>
              <div className="p-2.5">
                <p className="truncate text-xs font-medium text-brown" title={productName(img.productId)}>
                  {productName(img.productId)}
                </p>
                {img.isThumbnail && <p className="mt-0.5 text-[10px] text-gold">Main image</p>}
              </div>
              <div className="absolute inset-0 flex items-center justify-center gap-2 bg-brown/60 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  type="button"
                  onClick={() => handleReplaceClick(img.id)}
                  aria-label="Replace image"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-brown hover:text-gold"
                >
                  <HiOutlineArrowPath className="text-sm" />
                </button>
                <ReuseMenu products={products} onReuse={(targetId) => handleReuse(img.id, targetId)} />
                <button
                  type="button"
                  onClick={() => handleDelete(img.id)}
                  aria-label="Delete image"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-red-500 hover:text-red-600"
                >
                  <HiOutlineTrash className="text-sm" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
