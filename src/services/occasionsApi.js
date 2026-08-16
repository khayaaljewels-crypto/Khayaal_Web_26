import { api } from '@/utils/apiClient';

// Public — visible-only, used by the storefront and new-product selection.
export const fetchOccasions = () => api.get('/occasions').then((r) => r.occasions);

// Admin — sees hidden occasions too, and can mutate.
export const fetchAdminOccasions = () => api.get('/api/admin/occasions').then((r) => r.occasions);
export const createOccasion = (payload) => api.post('/api/admin/occasions', payload).then((r) => r.occasion);
export const updateOccasion = (id, patch) => api.put(`/api/admin/occasions/${id}`, patch).then((r) => r.occasion);
export const deleteOccasion = (id) => api.delete(`/api/admin/occasions/${id}`);
