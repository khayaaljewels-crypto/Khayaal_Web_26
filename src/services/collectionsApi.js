import { api } from '@/utils/apiClient';

// Public — visible-only, used by the storefront.
export const fetchCollections = () => api.get('/collections').then((r) => r.collections);

// Admin — sees hidden collections too, and can mutate.
export const fetchAdminCollections = () => api.get('/api/admin/collections').then((r) => r.collections);
export const createCollection = (payload) => api.post('/api/admin/collections', payload).then((r) => r.collection);
export const updateCollection = (id, patch) =>
  api.put(`/api/admin/collections/${id}`, patch).then((r) => r.collection);
export const deleteCollection = (id) => api.delete(`/api/admin/collections/${id}`);
