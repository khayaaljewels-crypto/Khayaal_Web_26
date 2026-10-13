import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { HiOutlineXMark, HiOutlineMagnifyingGlass } from 'react-icons/hi2';
import { Link, useNavigate } from 'react-router-dom';
import { fetchProducts } from '@/services/productsApi';
import { STOREFRONT_CATEGORIES } from '@/data/storefrontCategories';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';

const TRENDING = ['Kundan Necklace', 'Bridal Set', 'Temple Jewellery', 'Maang Tikka', 'Jhumkas'];

export default function SearchOverlay({ open, onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const navigate = useNavigate();
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
              <form onSubmit={handleSubmit} className="flex min-w-0 flex-1 items-center gap-3 border-b border-border pb-3">
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
                          <ImageWithFallback src={p.images[0]} alt={p.name} loading="lazy" className="h-14 w-14 rounded-lg object-cover bg-beige" />
                          <div className="min-w-0">
                            <p className="truncate font-heading text-sm text-brown">{p.name}</p>
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
                    <p className="eyebrow mb-3">Shop by Category</p>
                    <nav
                      aria-label="Jewellery categories"
                      className="no-scrollbar -mx-2 flex touch-pan-x flex-nowrap gap-2 overflow-x-auto overscroll-x-contain px-2 pb-1"
                    >
                      {STOREFRONT_CATEGORIES.map((category) => (
                        <Link
                          key={category.slug}
                          to={`/collections/${category.slug}`}
                          onClick={onClose}
                          className="flex h-9 shrink-0 items-center justify-center rounded-full border border-border bg-bg px-3 text-[9px] font-medium uppercase leading-none tracking-[0.12em] text-brown transition-colors duration-200 ease-out hover:border-gold hover:bg-beige/50 hover:text-gold sm:px-3.5 sm:text-[10px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                        >
                          {category.name}
                        </Link>
                      ))}
                    </nav>
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
