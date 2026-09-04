import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { HiOutlineArrowLeft } from 'react-icons/hi2';
import { fetchAdminProduct, createProduct, updateProduct } from '@/services/productsApi';
import { clearProductListCache } from '@/hooks/useProductList';
import { useCategories } from '@/context/CategoriesContext';
import { useCollections } from '@/context/CollectionsContext';
import { fetchOccasions } from '@/services/occasionsApi';
import { MATERIALS, STONES, COLORS, COLOR_HEX } from '@/data/constants';
import { Field, inputClass, Toggle, ToggleList } from '@/admin/components/AdminField';
import ImageUploader from '@/admin/components/ImageUploader';
import { api } from '@/utils/apiClient';
import { useToast } from '@/admin/context/ToastContext';

const emptyForm = {
  name: '', sku: '', brand: 'Khayaal Jewels', categoryId: '', collectionId: '', occasion: '',
  price: '', oldPrice: '', costPrice: '', stockQty: '',
  material: MATERIALS[0], stone: STONES[0], color: COLORS[0],
  description: '', shortDescription: '', careInstructions: '', tags: '',
  weight: '', dimensions: '', packageIncludes: '', warranty: '6 Months Against Manufacturing Defects', countryOfOrigin: 'India',
  deliveryDays: 5, returnDays: 7, codAvailable: true,
  isFeatured: false, isTrending: false, isNewArrival: false, isBestSeller: false, isComingSoon: false, isPublished: true,
};

export default function ProductForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { visibleCategories } = useCategories();
  const { visibleCollections } = useCollections();
  const toast = useToast();
  const [occasions, setOccasions] = useState([]);
  const [occasionsLoading, setOccasionsLoading] = useState(true);
  const [occasionsError, setOccasionsError] = useState(null);

  // For edit, the id is already known from the route synchronously — seeded
  // straight into state so the images-fetch effect below never runs once
  // with a null productId before correcting itself (that would flash
  // "no images" for a product that has them). For a brand new product this
  // starts null, and the effect below fills it in once a real (unpublished)
  // draft row exists on the server — images uploaded before the first save
  // already have somewhere real to attach to (product_images.product_id)
  // instead of an id that might never become an actual product row.
  // Opening Add Product must not create a database row. An id exists only
  // after the administrator explicitly saves the new product.
  const [productId, setProductId] = useState(id ?? null);

  const [existing, setExisting] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formLoading, setFormLoading] = useState(isEdit);
  const [formError, setFormError] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchOccasions()
      .then((rows) => {
        if (cancelled) return;
        setOccasions(rows);
        // New products start with the first visible backend-managed occasion.
        // Edit mode deliberately leaves the persisted value untouched.
        if (!isEdit && rows.length) {
          setForm((current) => (current.occasion ? current : { ...current, occasion: rows[0].slug }));
        }
      })
      .catch((err) => {
        if (!cancelled) setOccasionsError(err.message);
      })
      .finally(() => {
        if (!cancelled) setOccasionsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [isEdit]);

  useEffect(() => {
    if (!isEdit) return;
    let cancelled = false;
    fetchAdminProduct(id)
      .then((product) => {
        if (cancelled) return;
        setExisting(product);
        setForm({
          ...emptyForm,
          ...product,
          categoryId: product.category?.id ?? '',
          collectionId: product.collection?.id ?? '',
          tags: (product.tags ?? []).join(', '),
          weight: product.specs?.weight ?? '',
          dimensions: product.specs?.dimensions ?? '',
          packageIncludes: product.specs?.packageIncludes ?? '',
          warranty: product.specs?.warranty ?? emptyForm.warranty,
          countryOfOrigin: product.specs?.countryOfOrigin ?? 'India',
        });
      })
      .catch((err) => !cancelled && setFormError(err.message))
      .finally(() => !cancelled && setFormLoading(false));
    return () => {
      cancelled = true;
    };
  }, [isEdit, id]);

  // Authoritative image list lives in Postgres (product_images), not in
  // form state — ImageUploader talks to the upload API directly and reports
  // back the current, server-confirmed list.
  const [images, setImages] = useState([]);
  const [imagesLoading, setImagesLoading] = useState(isEdit);
  const [imagesUploading, setImagesUploading] = useState(false);
  const [imageError, setImageError] = useState('');

  useEffect(() => {
    if (!isEdit) return;
    api.get(`/api/admin/products/${productId}/images`)
      .then(({ images: fetched }) => setImages(fetched))
      .catch(() => {})
      .finally(() => setImagesLoading(false));
  }, [isEdit, productId]);

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));
  const occasionOptions = form.occasion && !occasions.some((occasion) => occasion.slug === form.occasion)
    ? [{ slug: form.occasion, name: `${form.occasion.replace(/-/g, ' ')} (hidden or deleted)` }, ...occasions]
    : occasions;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isEdit && images.length === 0) {
      setImageError('A product thumbnail is required — upload at least one image below.');
      toast.error('Add a product thumbnail before saving.');
      return;
    }
    setImageError('');
    setSaving(true);

    const imageUrls = images.map((img) => img.url);
    const payload = {
      id: productId,
      name: form.name.trim(),
      sku: form.sku.trim() || `KJ-${Date.now().toString().slice(-6)}`,
      brand: form.brand.trim(),
      categoryId: form.categoryId || null,
      collectionId: form.collectionId || null,
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
        : [{ id: form.color.toLowerCase().replace(/\s+/g, '-'), label: form.color, hex: COLOR_HEX[form.color] ?? '#B8864A', image: imageUrls[0], priceDelta: 0 }],
      ringSizes: existing?.ringSizes ?? null,
      rating: existing?.rating ?? 0,
      reviewCount: existing?.reviewCount ?? 0,
    };

    try {
      if (isEdit) {
        await updateProduct(id, payload);
      } else {
        const created = await createProduct(payload);
        clearProductListCache();
        toast.success('Product created. Add its images, then save any further changes.');
        navigate(`/admin/products/${created.id}/edit`, { replace: true });
        return;
      }
      clearProductListCache();
      toast.success(isEdit ? 'Product updated.' : 'Product created.');
      navigate('/admin/products');
    } catch (err) {
      toast.error(err.message || 'Failed to save product.');
    } finally {
      setSaving(false);
    }
  };

  if (formLoading) {
    return <p className="p-10 text-center text-sm text-text/50">Loading product…</p>;
  }

  if (formError) {
    return <p className="p-10 text-center text-sm text-red-600">{formError}</p>;
  }

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
                <select required className={inputClass} value={form.categoryId} onChange={(e) => set('categoryId', e.target.value)}>
                  <option value="">Select category</option>
                  {visibleCategories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </Field>
              <Field label="Collection">
                <select className={inputClass} value={form.collectionId} onChange={(e) => set('collectionId', e.target.value)}>
                  <option value="">None</option>
                  {visibleCollections.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </Field>
              <Field label="Occasion">
                <select className={inputClass} value={form.occasion} onChange={(e) => set('occasion', e.target.value)} disabled={occasionsLoading || Boolean(occasionsError)}>
                  {occasionsLoading ? (
                    <option value="">Loading occasions…</option>
                  ) : occasionOptions.length ? (
                    occasionOptions.map((occasion) => <option key={occasion.slug} value={occasion.slug}>{occasion.name}</option>)
                  ) : (
                    <option value="">No active occasions available</option>
                  )}
                </select>
                {occasionsError && <p className="mt-1 text-xs text-red-500">Could not load occasions: {occasionsError}</p>}
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
            <ToggleList>
              <Toggle label="Cash on Delivery Available" checked={form.codAvailable} onChange={(v) => set('codAvailable', v)} />
            </ToggleList>
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
            <ToggleList>
              <Toggle label="Published (visible on site)" checked={form.isPublished} onChange={(v) => set('isPublished', v)} />
              <Toggle label="Featured" checked={form.isFeatured} onChange={(v) => set('isFeatured', v)} />
              <Toggle label="Trending" checked={form.isTrending} onChange={(v) => set('isTrending', v)} />
              <Toggle label="New Arrival" checked={form.isNewArrival} onChange={(v) => set('isNewArrival', v)} />
              <Toggle label="Best Seller" checked={form.isBestSeller} onChange={(v) => set('isBestSeller', v)} />
              <Toggle label="Coming Soon" checked={form.isComingSoon} onChange={(v) => set('isComingSoon', v)} />
            </ToggleList>
          </section>

          <section className="space-y-3 rounded-2xl border border-border bg-white p-6">
            <p className="font-heading text-lg text-brown">
              Images <span className="text-red-500">*</span>
            </p>
            {!productId ? (
              <p className="text-xs text-text/50">Save the product first, then upload its images.</p>
            ) : imagesLoading ? (
              <p className="text-xs text-text/50">Loading images...</p>
            ) : (
              <ImageUploader
                productId={productId}
                folder={visibleCategories.find((c) => c.id === form.categoryId)?.slug}
                images={images}
                onImagesChange={(next) => { setImages(next); if (next.length) setImageError(''); }}
                onUploadingChange={setImagesUploading}
              />
            )}
            {imageError && <p className="text-xs text-red-500">{imageError}</p>}
          </section>

          <button
            type="submit"
            disabled={saving || imagesUploading}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-brown py-4 text-sm font-medium text-white hover:bg-gold disabled:cursor-not-allowed disabled:opacity-60"
          >
            {(saving || imagesUploading) && (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            )}
            {imagesUploading ? 'Uploading images...' : saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  );
}
