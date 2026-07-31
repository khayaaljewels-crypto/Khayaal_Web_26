import { api } from '@/utils/apiClient';

function toQueryString(params = {}) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === '') continue;
    if (Array.isArray(value)) {
      if (value.length) search.set(key, value.join(','));
    } else {
      search.set(key, value);
    }
  }
  const qs = search.toString();
  return qs ? `?${qs}` : '';
}

// Public — published-only, used by the storefront.
export const fetchProducts = (params) => api.get(`/products${toQueryString(params)}`);
export const fetchProduct = (slug) => api.get(`/products/${slug}`);
export const fetchProductsByIds = (ids) =>
  ids?.length ? api.get(`/products/by-ids${toQueryString({ ids })}`).then((r) => r.products) : Promise.resolve([]);
export const fetchProductFacets = () => api.get('/products/facets');

// Admin — sees unpublished products too, and can mutate.
export const fetchAdminProducts = (params) => api.get(`/api/admin/products${toQueryString(params)}`);
export const fetchAdminProduct = (id) => api.get(`/api/admin/products/${id}`).then((r) => r.product);
export const createProduct = (payload) => api.post('/api/admin/products', payload).then((r) => r.product);
export const updateProduct = (id, patch) => api.put(`/api/admin/products/${id}`, patch).then((r) => r.product);
export const deleteProduct = (id) => api.delete(`/api/admin/products/${id}`);
export const bulkUpdateProducts = (ids, patch) => api.post('/api/admin/products/bulk', { ids, patch });
export const bulkDeleteProducts = (ids) => api.post('/api/admin/products/bulk', { ids, action: 'delete' });
export const duplicateProduct = (id) => api.post(`/api/admin/products/${id}/duplicate`, {}).then((r) => r.product);
