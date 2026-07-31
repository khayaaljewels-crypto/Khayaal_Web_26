import { api } from '@/utils/apiClient';

// One-time migration: pushes the existing localStorage catalogue into the
// database. See src/admin/pages/MigrateData.jsx — the only caller.
export const runImport = (payload) => api.post('/api/admin/import', payload);
