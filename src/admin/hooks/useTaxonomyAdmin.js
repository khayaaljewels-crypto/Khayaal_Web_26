import { useCallback, useEffect, useState } from 'react';
import * as categoriesApi from '@/services/categoriesApi';
import * as collectionsApi from '@/services/collectionsApi';

const RESOURCES = {
  categories: {
    fetchAll: categoriesApi.fetchAdminCategories,
    create: categoriesApi.createCategory,
    update: categoriesApi.updateCategory,
    remove: categoriesApi.deleteCategory,
  },
  collections: {
    fetchAll: collectionsApi.fetchAdminCollections,
    create: collectionsApi.createCollection,
    update: collectionsApi.updateCollection,
    remove: collectionsApi.deleteCollection,
  },
};

// Full CRUD (including hidden rows) for the admin CategoryManager/
// CollectionManager pages — both resources share this since they're
// identical in shape and behavior (see Khayaal_Backend's taxonomyRoutes.js,
// the server-side twin of this factory).
export function useTaxonomyAdmin(resource) {
  const api = RESOURCES[resource];
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setItems(await api.fetchAll());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const create = async (data) => {
    const created = await api.create(data);
    await refetch();
    return created.id;
  };

  const update = async (id, patch) => {
    await api.update(id, patch);
    await refetch();
  };

  const remove = async (id) => {
    await api.remove(id);
    await refetch();
  };

  const toggleHidden = async (id) => {
    const current = items.find((item) => item.id === id);
    if (!current) return;
    await update(id, { hidden: !current.hidden });
  };

  return { items, loading, error, refetch, create, update, remove, toggleHidden };
}
