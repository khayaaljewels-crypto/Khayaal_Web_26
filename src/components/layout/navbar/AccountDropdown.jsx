import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { HiOutlineUser, HiOutlineUserCircle, HiOutlineShoppingBag, HiOutlineArrowRightOnRectangle } from 'react-icons/hi2';
import { useCustomerAuth } from '@/context/CustomerAuthContext';
import { useOnClickOutside } from '@/hooks/useOnClickOutside';

export default function AccountDropdown({ textColor }) {
  const { user, loggingOut, logout } = useCustomerAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useOnClickOutside(ref, () => setOpen(false));

  const handleLogout = () => {
    setOpen(false);
    logout();
  };

  if (!user) {
    return (
      <Link to="/my-account" aria-label="Account" className={`hidden transition-transform hover:scale-110 lg:block ${textColor}`}>
        <HiOutlineUser className="text-xl" />
      </Link>
    );
  }

  return (
    <div ref={ref} className="relative hidden lg:block">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Account menu"
        aria-expanded={open}
        className="block transition-transform hover:scale-110"
      >
        {user.profileImage ? (
          <img src={user.profileImage} alt="" className="h-7 w-7 rounded-full object-cover ring-2 ring-transparent" referrerPolicy="no-referrer" />
        ) : (
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gold text-xs font-semibold text-white">
            {user.fullName?.[0]?.toUpperCase() ?? 'U'}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 top-full mt-3 w-64 overflow-hidden rounded-2xl border border-border bg-white text-text shadow-soft"
          >
            <div className="flex items-center gap-3 border-b border-border p-4">
              {user.profileImage ? (
                <img src={user.profileImage} alt="" className="h-11 w-11 rounded-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-beige font-heading text-lg text-gold">
                  {user.fullName?.[0]?.toUpperCase() ?? 'U'}
                </span>
              )}
              <div className="min-w-0">
                <p className="truncate font-heading text-sm text-brown">{user.fullName}</p>
                <p className="truncate text-xs text-text/50">{user.email}</p>
              </div>
            </div>

            <div className="p-2">
              <Link
                to="/my-account"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-brown transition-colors hover:bg-beige"
              >
                <HiOutlineUserCircle className="text-base text-gold" /> My Account
              </Link>
              <Link
                to="/my-account/orders"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-brown transition-colors hover:bg-beige"
              >
                <HiOutlineShoppingBag className="text-base text-gold" /> My Orders
              </Link>
            </div>

            <div className="border-t border-border p-2">
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-red-500 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loggingOut ? (
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-red-300 border-t-red-500" />
                ) : (
                  <HiOutlineArrowRightOnRectangle className="text-base" />
                )}
                {loggingOut ? 'Logging out...' : 'Logout'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
