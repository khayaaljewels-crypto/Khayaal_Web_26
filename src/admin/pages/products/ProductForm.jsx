import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { HiOutlineArrowLeft, HiOutlineTrash, HiOutlineArrowUp, HiOutlineArrowDown, HiOutlinePlus } from 'react-icons/hi2';
import { useProducts } from '@/context/ProductsContext';
import { useCategories } from '@/context/CategoriesContext';
import { useCollections } from '@/context/CollectionsContext';
import { MATERIALS, STONES, COLORS, OCCASION_OPTIONS, COLOR_HEX } from '@/data/constants';
import { Field, inputClass, Toggle } from '@/admin/components/AdminField';

const emptyForm = {
  name: '', sku: '', brand: 'Khayaal Jewels', category: '', collection: '', occasion: OCCASION_OPTIONS[0],
  price: '', oldPrice: '', costPrice: '', stockQty: '',
  material: MATERIALS[0], stone: STONES[0], color: COLORS[0],
  description: '', shortDescription: '', careInstructions: '', tags: '',
  weight: '', dimensions: '', packageIncludes: '', warranty: '6 Months Against Manufacturing Defects', countryOfOrigin: 'India',
  deliveryDays: 5, returnDays: 7, codAvailable: true,
  isFeatured: false, isTrending: false, isNewArrival: false, isBestSeller: false, isComingSoon: false, isPublished: true,
  images: [''],
};

export default function ProductForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { getById, addProduct, updateProduct } = useProducts();
  const { visibleCategories } = useCategories();
  const { visibleCollections } = useCollections();

  const existing = isEdit ? getById(id) : null;

  const [form, setForm] = useState(() => {
    if (!existing) return emptyForm;
    return {
      ...emptyForm,
      ...existing,
      tags: (existing.tags ?? []).join(', '),
      weight: existing.specs?.weight ?? '',
      dimensions: existing.specs?.dimensions ?? '',
      packageIncludes: existing.specs?.packageIncludes ?? '',
      warranty: existing.specs?.warranty ?? emptyForm.warranty,
      countryOfOrigin: existing.specs?.countryOfOrigin ?? 'India',
      images: existing.images?.length ? existing.images : [''],
    };
  });
  const [saving, setSaving] = useState(false);

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const setImage = (i, value) => setForm((f) => ({ ...f, images: f.images.map((img, idx) => (idx === i ? value : img)) }));
  const addImage = () => setForm((f) => ({ ...f, images: [...f.images, ''] }));
  const removeImage = (i) => setForm((f) => ({ ...f, images: f.images.filter((_, idx) => idx !== i) }));
  const moveImage = (i, dir) =>
    setForm((f) => {
      const images = [...f.images];
      const j = i + dir;
      if (j < 0 || j >= images.length) return f;
      [images[i], images[j]] = [images[j], images[i]];
      return { ...f, images };
    });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);

    const images = form.images.map((s) => s.trim()).filter(Boolean);
    const payload = {
      name: form.name.trim(),
      sku: form.sku.trim() || `KJ-${Date.now().toString().slice(-6)}`,
      brand: form.brand.trim(),
      category: form.category,
      collection: form.collection,
      occasion: form.occasion,
      price: Number(form.price) || 0,
      oldPrice: form.oldPrice ? Number(form.oldPrice) : null,
      costPrice: Number(form.costPrice) || 0,
      stockQty: Number(form.stockQty) || 0,
      material: form.material,
      stone: form.stone,
      color: form.color,
      description: form.description,
      shortDescription: form.shortDescription,
      careInstructions: form.careInstructions,
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      deliveryDays: Number(form.deliveryDays) || 5,
      returnDays: Number(form.returnDays) || 7,
      codAvailable: form.codAvailable,
      isFeatured: form.isFeatured,
      isTrending: form.isTrending,
      isNewArrival: form.isNewArrival,
      isBestSeller: form.isBestSeller,
      isComingSoon: form.isComingSoon,
      isPublished: form.isPublished,
      images: images.length ? images : ['https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=900&auto=format&fit=crop'],
      specs: {
        metal: form.material,
        stone: form.stone,
        finish: existing?.specs?.finish ?? 'Glossy',
        weight: form.weight,
        dimensions: form.dimensions,
        occasion: form.occasion,
        packageIncludes: form.packageIncludes,
        warranty: form.warranty,
        countryOfOrigin: form.countryOfOrigin,
      },
      variants: existing?.variants?.length
        ? existing.variants
        : [{ id: form.color.toLowerCase().replace(/\s+/g, '-'), label: form.color, hex: COLOR_HEX[form.color] ?? '#B8864A', image: images[0], priceDelta: 0 }],
      ringSizes: existing?.ringSizes ?? null,
      rating: existing?.rating ?? 0,
      reviewCount: existing?.reviewCount ?? 0,
    };

    if (isEdit) {
      updateProduct(id, payload);
    } else {
      addProduct(payload);
    }

    navigate('/admin/products');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/admin/products" className="text-text/50 hover:text-brown"><HiOutlineArrowLeft className="text-xl" /></Link>
        <h1 className="font-heading text-3xl text-brown">{isEdit ? 'Edit Product' : 'Add Product'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="space-y-4 rounded-2xl border border-border bg-white p-6">
            <p className="font-heading text-lg text-brown">Basic Information</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Product Name" className="sm:col-span-2">
                <input required className={inputClass} value={form.name} onChange={(e) => set('name', e.target.value)} />
              </Field>
              <Field label="SKU / Product Code">
                <input className={inputClass} value={form.sku} onChange={(e) => set('sku', e.target.value)} placeholder="Auto-generated if blank" />
              </Field>
              <Field label="Brand">
                <input className={inputClass} value={form.brand} onChange={(e) => set('brand', e.target.value)} />
              </Field>
              <Field label="Category">
                <select required className={inputClass} value={form.category} onChange={(e) => set('category', e.target.value)}>
                  <option value="">Select category</option>
                  {visibleCategories.map((c) => <option key={c.id} value={c.slug}>{c.name}</option>)}
                </select>
              </Field>
              <Field label="Collection">
                <select className={inputClass} value={form.collection} onChange={(e) => set('collection', e.target.value)}>
                  <option value="">None</option>
                  {visibleCollections.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
              </Field>
              <Field label="Occasion">
                <select className={inputClass} value={form.occasion} onChange={(e) => set('occasion', e.target.value)}>
                  {OCCASION_OPTIONS.map((o) => <option key={o} value={o}>{o.replace(/-/g, ' ')}</option>)}
                </select>
              </Field>
              <Field label="Tags (comma separated)">
                <input className={inputClass} value={form.tags} onChange={(e) => set('tags', e.target.value)} />
              </Field>
            </div>
          </section>

          <section className="space-y-4 rounded-2xl border border-border bg-white p-6">
            <p className="font-heading text-lg text-brown">Pricing &amp; Inventory</p>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Price (Selling)">
                <input required type="number" min="0" className={inputClass} value={form.price} onChange={(e) => set('price', e.target.value)} />
              </Field>
              <Field label="MRP / Old Price">
                <input type="number" min="0" className={inputClass} value={form.oldPrice} onChange={(e) => set('oldPrice', e.target.value)} />
              </Field>
              <Field label="Cost Price (internal)">
                <input type="number" min="0" className={inputClass} value={form.costPrice} onChange={(e) => set('costPrice', e.target.value)} />
              </Field>
              <Field label="Stock Quantity">
                <input required type="number" min="0" className={inputClass} value={form.stockQty} onChange={(e) => set('stockQty', e.target.value)} />
              </Field>
              <Field label="Delivery Days">
                <input type="number" min="1" className={inputClass} value={form.deliveryDays} onChange={(e) => set('deliveryDays', e.target.value)} />
              </Field>
              <Field label="Return Window (days)">
                <input type="number" min="0" className={inputClass} value={form.returnDays} onChange={(e) => set('returnDays', e.target.value)} />
              </Field>
            </div>
            <Toggle label="Cash on Delivery Available" checked={form.codAvailable} onChange={(v) => set('codAvailable', v)} />
          </section>

          <section className="space-y-4 rounded-2xl border border-border bg-white p-6">
            <p className="font-heading text-lg text-brown">Attributes</p>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Material">
                <select className={inputClass} value={form.material} onChange={(e) => set('material', e.target.value)}>
                  {MATERIALS.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              </Field>
              <Field label="Stone Type">
                <select className={inputClass} value={form.stone} onChange={(e) => set('stone', e.target.value)}>
                  {STONES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </Field>
              <Field label="Color">
                <select className={inputClass} value={form.color} onChange={(e) => set('color', e.target.value)}>
                  {COLORS.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="Weight">
                <input className={inputClass} value={form.weight} onChange={(e) => set('weight', e.target.value)} placeholder="e.g. 24 g" />
              </Field>
              <Field label="Dimensions" className="sm:col-span-2">
                <input className={inputClass} value={form.dimensions} onChange={(e) => set('dimensions', e.target.value)} placeholder="e.g. 16 in chain + 2 in extender" />
              </Field>
              <Field label="Package Includes" className="sm:col-span-3">
                <input className={inputClass} value={form.packageIncludes} onChange={(e) => set('packageIncludes', e.target.value)} />
              </Field>
              <Field label="Warranty">
                <input className={inputClass} value={form.warranty} onChange={(e) => set('warranty', e.target.value)} />
              </Field>
              <Field label="Country of Origin">
                <input className={inputClass} value={form.countryOfOrigin} onChange={(e) => set('countryOfOrigin', e.target.value)} />
              </Field>
            </div>
          </section>

          <section className="space-y-4 rounded-2xl border border-border bg-white p-6">
            <p className="font-heading text-lg text-brown">Description</p>
            <Field label="Short Description">
              <input className={inputClass} value={form.shortDescription} onChange={(e) => set('shortDescription', e.target.value)} />
            </Field>
            <Field label="Full Description">
              <textarea rows={4} className={inputClass} value={form.description} onChange={(e) => set('description', e.target.value)} />
            </Field>
            <Field label="Care Instructions">
              <textarea rows={3} className={inputClass} value={form.careInstructions} onChange={(e) => set('careInstructions', e.target.value)} />
            </Field>
          </section>
        </div>

        <div className="space-y-6">
          <section className="space-y-3 rounded-2xl border border-border bg-white p-6">
            <p className="font-heading text-lg text-brown">Visibility &amp; Tags</p>
            <Toggle label="Published (visible on site)" checked={form.isPublished} onChange={(v) => set('isPublished', v)} />
            <Toggle label="Featured" checked={form.isFeatured} onChange={(v) => set('isFeatured', v)} />
            <Toggle label="Trending" checked={form.isTrending} onChange={(v) => set('isTrending', v)} />
            <Toggle label="New Arrival" checked={form.isNewArrival} onChange={(v) => set('isNewArrival', v)} />
            <Toggle label="Best Seller" checked={form.isBestSeller} onChange={(v) => set('isBestSeller', v)} />
            <Toggle label="Coming Soon" checked={form.isComingSoon} onChange={(v) => set('isComingSoon', v)} />
          </section>

          <section className="space-y-3 rounded-2xl border border-border bg-white p-6">
            <div className="flex items-center justify-between">
              <p className="font-heading text-lg text-brown">Images</p>
              <button type="button" onClick={addImage} className="flex items-center gap-1 text-xs font-medium text-gold hover:underline">
                <HiOutlinePlus /> Add
              </button>
            </div>
            <p className="text-xs text-text/50">Paste image URLs. First image is the primary image.</p>
            <div className="space-y-2">
              {form.images.map((img, i) => (
                <div key={i} className="flex items-center gap-2">
                  {img && <img src={img} alt="" className="h-10 w-10 shrink-0 rounded-lg object-cover" />}
                  <input
                    className={inputClass}
                    value={img}
                    onChange={(e) => setImage(i, e.target.value)}
                    placeholder="https://..."
                  />
                  <button type="button" onClick={() => moveImage(i, -1)} disabled={i === 0} className="text-text/40 hover:text-brown disabled:opacity-30"><HiOutlineArrowUp /></button>
                  <button type="button" onClick={() => moveImage(i, 1)} disabled={i === form.images.length - 1} className="text-text/40 hover:text-brown disabled:opacity-30"><HiOutlineArrowDown /></button>
                  <button type="button" onClick={() => removeImage(i)} className="text-text/40 hover:text-red-500"><HiOutlineTrash /></button>
                </div>
              ))}
            </div>
          </section>

          <button type="submit" disabled={saving} className="w-full rounded-full bg-brown py-4 text-sm font-medium text-white hover:bg-gold disabled:opacity-60">
            {isEdit ? 'Save Changes' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  );
}
