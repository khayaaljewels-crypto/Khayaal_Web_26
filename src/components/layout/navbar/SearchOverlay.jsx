import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { HiOutlineXMark, HiOutlineMagnifyingGlass } from 'react-icons/hi2';
import { useNavigate } from 'react-router-dom';
import { fetchProducts } from '@/services/productsApi';
import { useCategories } from '@/context/CategoriesContext';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';

const TRENDING = ['Kundan Necklace', 'Bridal Set', 'Temple Jewellery', 'Maang Tikka', 'Jhumkas'];

export default function SearchOverlay({ open, onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const navigate = useNavigate();
  const { visibleCategories: categories } = useCategories();
  useLockBodyScroll(open);

  useEffect(() => {
    if (!open) setQuery('');
  }, [open]);

  useEffect(() => {
    const q = query.trim();
    if (!q) {
      setResults([]);
      return;
    }
    setSearching(true);
    const timer = setTimeout(() => {
      fetchProducts({ search: q, pageSize: 6 })
        .then(({ products }) => setResults(products))
        .catch(() => setResults([]))
        .finally(() => setSearching(false));
    }, 250);
    return () => clearTimeout(timer);
  }, [query]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/shop?search=${encodeURIComponent(query.trim())}`);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-start justify-center bg-brown/40 backdrop-blur-sm px-4 pt-24 sm:pt-32"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="w-full max-w-2xl rounded-3xl bg-white p-6 sm:p-8 shadow-soft"
            initial={{ opacity: 0, y: -30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.96 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-4">
              <form onSubmit={handleSubmit} className="flex flex-1 items-center gap-3 border-b border-border pb-3">
                <HiOutlineMagnifyingGlass className="text-xl text-gold" />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  type="text"
                  placeholder="Search for necklaces, earrings, bangles..."
                  className="w-full bg-transparent font-body text-base text-text placeholder:text-text/40 focus:outline-none"
                />
              </form>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close search"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-brown transition-colors hover:bg-beige"
              >
                <HiOutlineXMark className="text-xl" />
              </button>
            </div>

            <div className="mt-6">
              {query.trim() ? (
                searching ? (
                  <p className="p-2 text-xs text-text/50">Searching…</p>
                ) : results.length > 0 ? (
                  <ul className="space-y-3">
                    {results.map((p) => (
                      <li key={p.id}>
                        <button
                          onClick={() => {
                            navigate(`/product/${p.slug}`);
                            onClose();
                          }}
                          className="flex w-full items-center gap-4 rounded-xl p-2 text-left transition-colors hover:bg-beige"
                        >
                          <img src={p.images[0]} alt={p.name} className="h-14 w-14 rounded-lg object-cover bg-beige" />
                          <div>
                            <p className="font-heading text-sm text-brown">{p.name}</p>
                            <p className="text-xs text-gold">₹{p.price.toLocaleString('en-IN')}</p>
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="p-2 text-xs text-text/50">No products match "{query.trim()}".</p>
                )
              ) : (
                <>
                  <div>
                    <p className="eyebrow mb-3">Trending Searches</p>
                    <div className="flex flex-wrap gap-2">
                      {TRENDING.map((t) => (
                        <button
                          key={t}
                          onClick={() => setQuery(t)}
                          className="rounded-full border border-border px-4 py-1.5 text-xs text-brown transition-colors hover:border-gold hover:text-gold"
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="mt-6">
                    <p className="eyebrow mb-3">Popular Categories</p>
                    <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                      {categories.slice(0, 4).map((c) => (
                        <button
                          key={c.id}
                          onClick={() => {
                            navigate(`/shop?category=${c.slug}`);
                            onClose();
                          }}
                          className="group overflow-hidden rounded-xl"
                        >
                          <div className="aspect-square overflow-hidden rounded-xl bg-beige">
                            <img
                              src={c.image}
                              alt={c.name}
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                          </div>
                          <p className="mt-1.5 text-center text-xs text-brown">{c.name}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
