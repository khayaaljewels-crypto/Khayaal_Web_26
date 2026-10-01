// import { createContext, useContext, useEffect, useState } from 'react';
// import { fetchCollections } from '@/services/collectionsApi';

// const CollectionsContext = createContext(null);

// // Read-only, storefront-facing — see CategoriesContext.jsx for the full
// // rationale (same pattern: public visible-only fetch, shared via context;
// // admin CRUD lives in src/admin/hooks/useTaxonomyAdmin.js instead).
// export function CollectionsProvider({ children }) {
//   const [collections, setCollections] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     let cancelled = false;
//     setLoading(true);
//     fetchCollections()
//       .then((rows) => {
//         if (!cancelled) setCollections(rows);
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

//   const value = { collections, visibleCollections: collections, loading, error };

//   return <CollectionsContext.Provider value={value}>{children}</CollectionsContext.Provider>;
// }

// export function useCollections() {
//   const ctx = useContext(CollectionsContext);
//   if (!ctx) throw new Error('useCollections must be used within a CollectionsProvider');
//   return ctx;
// }



import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import { fetchCollections } from '@/services/collectionsApi';

const CollectionsContext = createContext(null);

const CACHE_TTL_MS = 5 * 60 * 1000;

let cachedCollections = null;
let cachedCollectionsAt = 0;
let inFlightCollections = null;


function loadCollections() {
  if (
    cachedCollections &&
    Date.now() - cachedCollectionsAt < CACHE_TTL_MS
  ) {
    return Promise.resolve(
      cachedCollections
    );
  }


  if (!inFlightCollections) {
    inFlightCollections = fetchCollections()
      .then((rows) => {
        cachedCollections = rows;
        cachedCollectionsAt = Date.now();

        return rows;
      })
      .finally(() => {
        inFlightCollections = null;
      });
  }


  return inFlightCollections;
}


export function CollectionsProvider({
  children,
}) {
  const [
    collections,
    setCollections,
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

    loadCollections()
      .then((rows) => {
        if (!cancelled) {
          setCollections(rows);
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


  const value = {
    collections,
    visibleCollections: collections,
    loading,
    error,
  };


  return (
    <CollectionsContext.Provider value={value}>
      {children}
    </CollectionsContext.Provider>
  );
}


export function useCollections() {
  const ctx =
    useContext(CollectionsContext);

  if (!ctx) {
    throw new Error(
      'useCollections must be used within a CollectionsProvider'
    );
  }

  return ctx;
}