import { NavLink, Outlet } from 'react-router-dom';
import {
  HiOutlineSquares2X2,
  HiOutlineUserCircle,
  HiOutlineShoppingBag,
  HiOutlineMapPin,
  HiOutlineHeart,
  HiOutlineArrowRightOnRectangle,
} from 'react-icons/hi2';
import { useCustomerAuth } from '@/context/CustomerAuthContext';
import GoogleSignInPrompt from '@/components/account/GoogleSignInPrompt';
import Reveal from '@/components/animations/Reveal';

const NAV_ITEMS = [
  { to: '/my-account', label: 'Dashboard', icon: HiOutlineSquares2X2, end: true },
  { to: '/my-account/profile', label: 'My Profile', icon: HiOutlineUserCircle },
  { to: '/my-account/orders', label: 'Order History', icon: HiOutlineShoppingBag },
  { to: '/my-account/addresses', label: 'Saved Addresses', icon: HiOutlineMapPin },
  { to: '/wishlist', label: 'Wishlist', icon: HiOutlineHeart },
];

export default function AccountLayout() {
  const { user, checkingAuth, loggingOut, logout } = useCustomerAuth();

  if (checkingAuth) {
    return (
      <div className="flex min-h-[70svh] flex-col items-center justify-center gap-3 bg-bg pt-32">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-gold/30 border-t-gold" />
        <p className="text-xs uppercase tracking-[0.3em] text-text/40">Loading your account</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-bg pb-24 pt-28 lg:pt-32">
        <div className="container-luxury">
          <GoogleSignInPrompt title="Sign in to your account" description="Manage your profile, orders, and saved addresses." />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-bg pb-24 pt-28 lg:pt-32">
      <div className="container-luxury">
        <Reveal className="flex items-center gap-4 rounded-3xl border border-border bg-white p-6 sm:p-8">
          {user.profileImage ? (
            <img src={user.profileImage} alt={user.fullName} className="h-14 w-14 rounded-full object-cover" referrerPolicy="no-referrer" />
          ) : (
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-beige font-heading text-xl text-gold">
              {user.fullName?.[0] ?? 'U'}
            </span>
          )}
          <div>
            <p className="font-heading text-lg text-brown">{user.fullName}</p>
            <p className="text-sm text-text/50">{user.email}</p>
          </div>
        </Reveal>

        <div className="mt-8 flex flex-col gap-8 lg:flex-row">
          <aside className="lg:w-64 lg:shrink-0">
            <nav className="flex gap-2 overflow-x-auto rounded-2xl border border-border bg-white p-2 no-scrollbar lg:flex-col lg:overflow-visible">
              {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    `flex shrink-0 items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                      isActive ? 'bg-gold text-white' : 'text-brown/70 hover:bg-beige'
                    }`
                  }
                >
                  <Icon className="text-base" />
                  {label}
                </NavLink>
              ))}
              <button
                onClick={logout}
                disabled={loggingOut}
                className="flex shrink-0 items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-medium text-brown/70 hover:bg-beige disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loggingOut ? (
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-border border-t-brown" />
                ) : (
                  <HiOutlineArrowRightOnRectangle className="text-base" />
                )}
                {loggingOut ? 'Logging out...' : 'Logout'}
              </button>
            </nav>
          </aside>

          <div className="min-w-0 flex-1">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
