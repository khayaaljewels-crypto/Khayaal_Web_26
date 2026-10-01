// import { createContext, useContext, useEffect, useState } from 'react';
// import { fetchOccasions } from '@/services/occasionsApi';

// const OccasionsContext = createContext(null);

// // Read-only storefront taxonomy. The public endpoint only returns active,
// // visible rows, so consumers cannot accidentally render hidden occasions.
// export function OccasionsProvider({ children }) {
//   const [occasions, setOccasions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     let cancelled = false;
//     fetchOccasions()
//       .then((rows) => {
//         if (!cancelled) setOccasions(rows);
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

//   return (
//     <OccasionsContext.Provider value={{ occasions, visibleOccasions: occasions, loading, error }}>
//       {children}
//     </OccasionsContext.Provider>
//   );
// }

// export function useOccasions() {
//   const ctx = useContext(OccasionsContext);
//   if (!ctx) throw new Error('useOccasions must be used within an OccasionsProvider');
//   return ctx;
// }


import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import { fetchOccasions } from '@/services/occasionsApi';

const OccasionsContext = createContext(null);

const CACHE_TTL_MS = 5 * 60 * 1000;

let cachedOccasions = null;
let cachedOccasionsAt = 0;
let inFlightOccasions = null;


function loadOccasions() {
  if (
    cachedOccasions &&
    Date.now() - cachedOccasionsAt < CACHE_TTL_MS
  ) {
    return Promise.resolve(
      cachedOccasions
    );
  }


  if (!inFlightOccasions) {
    inFlightOccasions = fetchOccasions()
      .then((rows) => {
        cachedOccasions = rows;
        cachedOccasionsAt = Date.now();

        return rows;
      })
      .finally(() => {
        inFlightOccasions = null;
      });
  }


  return inFlightOccasions;
}


export function OccasionsProvider({
  children,
}) {
  const [
    occasions,
    setOccasions,
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

    loadOccasions()
      .then((rows) => {
        if (!cancelled) {
          setOccasions(rows);
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


  return (
    <OccasionsContext.Provider
      value={{
        occasions,
        visibleOccasions: occasions,
        loading,
        error,
      }}
    >
      {children}
    </OccasionsContext.Provider>
  );
}


export function useOccasions() {
  const ctx =
    useContext(OccasionsContext);

  if (!ctx) {
    throw new Error(
      'useOccasions must be used within an OccasionsProvider'
    );
  }

  return ctx;
}