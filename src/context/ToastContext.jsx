import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { HiCheckCircle, HiXCircle, HiOutlineXMark } from 'react-icons/hi2';

const ToastContext = createContext(null);

// Storefront counterpart to admin/context/ToastContext.jsx — kept as a
// separate provider since the admin and storefront render trees are
// entirely separate (see App.jsx's Root()), not because the design differs.
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback((type, message) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => remove(id), 3500);
  }, [remove]);

  const value = useMemo(
    () => ({
      success: (message) => push('success', message),
      error: (message) => push('error', message),
    }),
    [push]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-6 z-200 flex flex-col items-center gap-2 px-4 sm:inset-x-auto sm:right-6 sm:items-end">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.25 }}
              className={`pointer-events-auto flex w-full max-w-sm items-center gap-2.5 rounded-2xl px-4 py-3 text-sm shadow-soft ${
                t.type === 'success' ? 'bg-brown text-white' : 'bg-red-600 text-white'
              }`}
            >
              {t.type === 'success' ? (
                <HiCheckCircle className="shrink-0 text-lg text-gold-hover" />
              ) : (
                <HiXCircle className="shrink-0 text-lg" />
              )}
              <span className="flex-1">{t.message}</span>
              <button onClick={() => remove(t.id)} aria-label="Dismiss" className="shrink-0 text-white/70 hover:text-white">
                <HiOutlineXMark />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
}
