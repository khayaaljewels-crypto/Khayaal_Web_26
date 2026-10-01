// import { createContext, useContext, useEffect, useState } from 'react';
// import { fetchCategories } from '@/services/categoriesApi';

// const CategoriesContext = createContext(null);

// // Read-only, storefront-facing: fetched once from the public API (visible
// // categories only) and shared via context so every consumer (mega menu,
// // search overlay, home sections, breadcrumbs) doesn't each fire their own
// // request. Admin management (including hidden categories) lives separately
// // in src/admin/hooks/useTaxonomyAdmin.js, since that needs full CRUD against
// // a different, auth-gated endpoint.
// export function CategoriesProvider({ children }) {
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     let cancelled = false;
//     setLoading(true);
//     fetchCategories()
//       .then((rows) => {
//         if (!cancelled) setCategories(rows);
//       })
//       .catch((err) => {
//         if (!cancelled) setError(err.message);
//       })
//       .finally(() => {
//         if (!cancelled) setLoading(false);
//       });
//     return () => {
//       cancelled = true;
//     };
//   }, []);

//   const getBySlug = (slug) => categories.find((c) => c.slug === slug);

//   const value = { categories, visibleCategories: categories, loading, error, getBySlug };

//   return <CategoriesContext.Provider value={value}>{children}</CategoriesContext.Provider>;
// }

// export function useCategories() {
//   const ctx = useContext(CategoriesContext);
//   if (!ctx) throw new Error('useCategories must be used within a CategoriesProvider');
//   return ctx;
// }


import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import { fetchCategories } from '@/services/categoriesApi';

const CategoriesContext = createContext(null);

const CACHE_TTL_MS = 5 * 60 * 1000;

let cachedCategories = null;
let cachedCategoriesAt = 0;
let inFlightCategories = null;


function loadCategories() {
  // Use cached data for 5 minutes.
  if (
    cachedCategories &&
    Date.now() - cachedCategoriesAt < CACHE_TTL_MS
  ) {
    return Promise.resolve(
      cachedCategories
    );
  }


  // If another component is already requesting
  // categories, share that same request.
  if (!inFlightCategories) {
    inFlightCategories = fetchCategories()
      .then((rows) => {
        cachedCategories = rows;
        cachedCategoriesAt = Date.now();

        return rows;
      })
      .finally(() => {
        inFlightCategories = null;
      });
  }

  return inFlightCategories;
}


export function CategoriesProvider({
  children,
}) {
  const [
    categories,
    setCategories,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState(null);


  useEffect(() => {
    let cancelled = false;

    setLoading(true);

    loadCategories()
      .then((rows) => {
        if (!cancelled) {
          setCategories(rows);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });


    return () => {
      cancelled = true;
    };
  }, []);


  const getBySlug = (slug) =>
    categories.find(
      (c) => c.slug === slug
    );


  const value = {
    categories,
    visibleCategories: categories,
    loading,
    error,
    getBySlug,
  };


  return (
    <CategoriesContext.Provider value={value}>
      {children}
    </CategoriesContext.Provider>
  );
}


export function useCategories() {
  const ctx =
    useContext(CategoriesContext);

  if (!ctx) {
    throw new Error(
      'useCategories must be used within a CategoriesProvider'
    );
  }

  return ctx;
}