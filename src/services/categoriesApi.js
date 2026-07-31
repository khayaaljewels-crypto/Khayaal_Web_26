import { api } from '@/utils/apiClient';

// Public — visible-only, used by the storefront.
export const fetchCategories = () => api.get('/categories').then((r) => r.categories);

// Admin — sees hidden categories too, and can mutate.
export const fetchAdminCategories = () => api.get('/api/admin/categories').then((r) => r.categories);
export const createCategory = (payload) => api.post('/api/admin/categories', payload).then((r) => r.category);
export const updateCategory = (id, patch) => api.put(`/api/admin/categories/${id}`, patch).then((r) => r.category);
export const deleteCategory = (id) => api.delete(`/api/admin/categories/${id}`);
