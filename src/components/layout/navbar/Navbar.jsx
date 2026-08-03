import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HiOutlineMagnifyingGlass,
  HiOutlineHeart,
  HiOutlineShoppingBag,
  HiOutlineBars3,
} from 'react-icons/hi2';
import { navLinks } from './navLinks';
import MegaMenu from './MegaMenu';
import SearchOverlay from './SearchOverlay';
import MobileMenu from './MobileMenu';
import AccountDropdown from './AccountDropdown';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import Logo from '@/components/ui/Logo';

const HERO_ROUTES = ['/'];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { count: cartCount } = useCart();
  const { count: wishlistCount } = useWishlist();

  const isTransparentRoute = HERO_ROUTES.includes(location.pathname);
  const transparent = isTransparentRoute && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  const textColor = transparent ? 'text-white' : 'text-brown';

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          transparent ? 'bg-transparent' : 'bg-white/90 backdrop-blur-xl shadow-[0_1px_0_0_rgba(236,231,226,1)]'
        }`}
        onMouseLeave={() => setMegaOpen(false)}
      >
        <div className="container-luxury flex h-20 items-center justify-between lg:h-24">
          <button
            className="flex items-center gap-2 lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <HiOutlineBars3 className={`text-2xl ${textColor}`} />
          </button>

          <Link to="/" className="flex shrink-0 items-center">
            <Logo className="h-10 w-auto lg:h-12" invert={transparent} />
          </Link>

          <nav className="hidden items-center gap-10 lg:flex">
            {navLinks.map((link) => (
              <div
                key={link.label}
                onMouseEnter={() => link.mega && setMegaOpen(true)}
                className="relative"
              >
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    `relative py-2 text-sm font-medium tracking-wide transition-colors ${textColor} ${
                      isActive ? 'opacity-100' : 'opacity-90 hover:opacity-100'
                    } after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-0 after:bg-gold after:transition-all after:duration-300 hover:after:w-full`
                  }
                >
                  {link.label}
                </NavLink>
              </div>
            ))}
          </nav>

          <div className={`flex shrink-0 items-center gap-4 sm:gap-5 ${textColor}`}>
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              className="hidden transition-transform hover:scale-110 sm:block"
            >
              <HiOutlineMagnifyingGlass className="text-xl" />
            </button>
            <AccountDropdown textColor={textColor} />
            <Link to="/wishlist" aria-label="Wishlist" className="relative transition-transform hover:scale-110">
              <HiOutlineHeart className="text-xl" />
              {wishlistCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[9px] font-semibold text-white">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <Link to="/cart" aria-label="Cart" className="relative transition-transform hover:scale-110">
              <HiOutlineShoppingBag className="text-xl" />
              {cartCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[9px] font-semibold text-white">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        <MegaMenu open={megaOpen} onClose={() => setMegaOpen(false)} />
      </motion.header>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
