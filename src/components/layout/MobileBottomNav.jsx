import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HiHome,
  HiOutlineHome,
  HiSquares2X2,
  HiOutlineSquares2X2,
  HiHeart,
  HiOutlineHeart,
  HiShoppingBag,
  HiOutlineShoppingBag,
  HiUser,
  HiOutlineUser,
} from 'react-icons/hi2';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

export default function MobileBottomNav() {
  const { count: cartCount } = useCart();
  const { count: wishlistCount } = useWishlist();

  const items = [
    { to: '/', label: 'Home', icon: HiOutlineHome, activeIcon: HiHome, end: true },
    { to: '/shop', label: 'Shop', icon: HiOutlineSquares2X2, activeIcon: HiSquares2X2 },
    { to: '/wishlist', label: 'Wishlist', icon: HiOutlineHeart, activeIcon: HiHeart, badge: wishlistCount },
    { to: '/cart', label: 'Cart', icon: HiOutlineShoppingBag, activeIcon: HiShoppingBag, badge: cartCount },
    { to: '/my-account', label: 'Profile', icon: HiOutlineUser, activeIcon: HiUser },
  ];

  return (
    <motion.nav
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
      className="fixed inset-x-3 bottom-3 z-50 flex items-center justify-around rounded-full border border-white/40 bg-white/70 px-2 py-2.5 shadow-soft backdrop-blur-xl lg:hidden"
    >
      {items.map(({ to, label, icon: Icon, activeIcon: ActiveIcon, end, badge }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className="relative flex flex-1 flex-col items-center gap-0.5 py-1"
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <motion.span
                  layoutId="bottomNavIndicator"
                  className="absolute -top-2 h-1 w-1 rounded-full bg-gold"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative">
                {isActive ? (
                  <ActiveIcon className="text-xl text-gold" />
                ) : (
                  <Icon className="text-xl text-brown/70" />
                )}
                {badge > 0 && (
                  <span className="absolute -right-2 -top-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-gold text-[8px] font-semibold text-white">
                    {badge}
                  </span>
                )}
              </span>
              <span className={`text-[10px] ${isActive ? 'text-gold' : 'text-brown/60'}`}>{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </motion.nav>
  );
}
