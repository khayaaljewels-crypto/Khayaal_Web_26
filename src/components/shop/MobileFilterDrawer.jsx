import { AnimatePresence, motion } from 'framer-motion';
import { HiOutlineXMark } from 'react-icons/hi2';
import FilterPanelContent from './FilterPanelContent';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';

export default function MobileFilterDrawer({ open, onClose, filtersApi, resultCount }) {
  useLockBodyScroll(open);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[95] bg-brown/40 backdrop-blur-sm lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-x-0 bottom-0 z-[96] flex max-h-[85svh] flex-col rounded-t-3xl bg-white lg:hidden"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <p className="font-heading text-lg text-brown">Filters</p>
              <button
                onClick={onClose}
                aria-label="Close filters"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border"
              >
                <HiOutlineXMark className="text-brown" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6">
              <FilterPanelContent filtersApi={filtersApi} />
            </div>
            <div className="flex items-center gap-3 border-t border-border p-4">
              <button
                onClick={filtersApi.clearAll}
                className="flex-1 rounded-full border border-border py-3 text-sm font-medium text-brown"
              >
                Clear All
              </button>
              <button
                onClick={onClose}
                className="flex-1 rounded-full bg-brown py-3 text-sm font-medium text-white"
              >
                Show {resultCount} Results
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
