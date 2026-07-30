import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { SEED_PRODUCTS } from '@/data/productSeed';
import { MATERIALS, STONES, COLORS, OCCASION_OPTIONS } from '@/data/constants';

const ProductsContext = createContext(null);
const STORAGE_KEY = 'khayaal_products_v3';

function readStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function slugify(name) {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function hydrate(raw) {
  const stockQty = Number(raw.stockQty ?? 0);
  const inStock = stockQty > 0;
  const lowStock = inStock && stockQty <= 5;
  const discount =
    raw.oldPrice && raw.oldPrice > raw.price ? Math.round(((raw.oldPrice - raw.price) / raw.oldPrice) * 100) : 0;
  return { ...raw, stockQty, inStock, lowStock, discount };
}

const NEW_PRODUCT_DEFAULTS = {
  brand: 'Khayaal Jewels',
  price: 0,
  oldPrice: null,
  costPrice: 0,
  stockQty: 0,
  rating: 0,
  reviewCount: 0,
  images: [],
  isBestSeller: false,
  isNewArrival: false,
  isFeatured: false,
  isTrending: false,
  isComingSoon: false,
  isPublished: true,
  description: '',
  shortDescription: '',
  careInstructions: '',
  tags: [],
  specs: {
    metal: '', stone: '', finish: '', weight: '', dimensions: '', occasion: '',
    packageIncludes: '', warranty: '', countryOfOrigin: 'India',
  },
  deliveryDays: 5,
  codAvailable: true,
  returnDays: 7,
  videos: [],
  variants: [],
  ringSizes: null,
};

export function ProductsProvider({ children }) {
  const [rawProducts, setRawProducts] = useState(() => readStored() ?? SEED_PRODUCTS);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rawProducts));
  }, [rawProducts]);

  const allProducts = useMemo(() => rawProducts.map(hydrate), [rawProducts]);
  const products = useMemo(() => allProducts.filter((p) => p.isPublished !== false), [allProducts]);

  const addProduct = (data) => {
    // Allows the admin form to pre-generate an id before the product is
    // actually saved, so uploaded images can be associated with the product
    // (via product_images.product_id) while the form is still being filled in.
    const id = data.id || `kj-${Date.now().toString(36)}`;
    const slug = data.slug?.trim() || slugify(data.name || 'new-product');
    const record = { ...NEW_PRODUCT_DEFAULTS, ...data, id, slug };
    setRawProducts((prev) => [record, ...prev]);
    return id;
  };

  const updateProduct = (id, patch) => {
    setRawProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...patch, slug: patch.slug?.trim() || (patch.name ? slugify(patch.name) : p.slug) } : p))
    );
  };

  const deleteProduct = (id) => setRawProducts((prev) => prev.filter((p) => p.id !== id));
  const deleteProducts = (ids) => setRawProducts((prev) => prev.filter((p) => !ids.includes(p.id)));

  const bulkUpdate = (ids, patch) =>
    setRawProducts((prev) => prev.map((p) => (ids.includes(p.id) ? { ...p, ...patch } : p)));

  const duplicateProduct = (id) => {
    const source = rawProducts.find((p) => p.id === id);
    if (!source) return null;
    const newId = `kj-${Date.now().toString(36)}`;
    const name = `${source.name} (Copy)`;
    const copy = { ...source, id: newId, name, slug: slugify(`${name}-${newId}`), isPublished: false };
    setRawProducts((prev) => [copy, ...prev]);
    return newId;
  };

  const resetToSeed = () => setRawProducts(SEED_PRODUCTS);

  const getBySlug = (slug) => products.find((p) => p.slug === slug);
  const getById = (id) => allProducts.find((p) => p.id === id);

  const bestSellers = useMemo(() => products.filter((p) => p.isBestSeller), [products]);
  const newArrivals = useMemo(() => products.filter((p) => p.isNewArrival), [products]);
  const featured = useMemo(() => products.filter((p) => p.isFeatured), [products]);
  const trending = useMemo(() => products.filter((p) => p.isTrending), [products]);
  const comingSoon = useMemo(() => products.filter((p) => p.isComingSoon), [products]);

  const getRelatedProducts = (product, limit = 8) =>
    products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, limit);

  const getCompleteTheLook = (product, limit = 4) =>
    products
      .filter((p) => p.category !== product.category && p.collection === product.collection && p.id !== product.id)
      .slice(0, limit);

  const collectionsInUse = useMemo(
    () => [...new Set(allProducts.map((p) => p.collection).filter(Boolean))],
    [allProducts]
  );

  const priceBounds = useMemo(() => {
    if (products.length === 0) return { min: 0, max: 10000 };
    return {
      min: Math.min(...products.map((p) => p.price)),
      max: Math.max(...products.map((p) => p.price)),
    };
  }, [products]);

  const value = {
    products,
    allProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    deleteProducts,
    bulkUpdate,
    duplicateProduct,
    resetToSeed,
    getBySlug,
    getById,
    bestSellers,
    newArrivals,
    featured,
    trending,
    comingSoon,
    getRelatedProducts,
    getCompleteTheLook,
    collectionsInUse,
    priceBounds,
    materialOptions: MATERIALS,
    stoneOptions: STONES,
    colorOptions: COLORS,
    occasionOptions: OCCASION_OPTIONS,
  };

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
}

export function useProducts() {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error('useProducts must be used within a ProductsProvider');
  return ctx;
}
