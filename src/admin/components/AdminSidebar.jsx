import { NavLink } from 'react-router-dom';
import {
  HiOutlineSquares2X2,
  HiOutlineSparkles,
  HiOutlineTag,
  HiOutlineRectangleStack,
  HiOutlinePhoto,
  HiOutlineShoppingBag,
  HiOutlineUsers,
  HiOutlineCog6Tooth,
  HiOutlineXMark,
  HiOutlineCloudArrowUp,
} from 'react-icons/hi2';
import Logo from '@/components/ui/Logo';

const NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard', icon: HiOutlineSquares2X2, end: true },
  { to: '/admin/products', label: 'Products', icon: HiOutlineSparkles },
  { to: '/admin/categories', label: 'Categories', icon: HiOutlineTag },
  { to: '/admin/collections', label: 'Collections', icon: HiOutlineRectangleStack },
  { to: '/admin/media', label: 'Media Library', icon: HiOutlinePhoto },
  { to: '/admin/orders', label: 'Orders', icon: HiOutlineShoppingBag },
  { to: '/admin/customers', label: 'Customers', icon: HiOutlineUsers },
  { to: '/admin/settings', label: 'Settings', icon: HiOutlineCog6Tooth },
  // Temporary — remove this nav item once the one-time sync is confirmed
  // done (see src/admin/pages/MigrateData.jsx).
  { to: '/admin/migrate-data', label: 'Sync to Database', icon: HiOutlineCloudArrowUp },
];

export default function AdminSidebar({ mobileOpen, onCloseMobile }) {
  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={onCloseMobile} />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 shrink-0 transform bg-brown text-white transition-transform duration-300 lg:static lg:z-auto lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-20 items-center justify-between px-6">
          <Logo className="h-8 w-auto" invert />
          <button onClick={onCloseMobile} className="text-white/70 lg:hidden" aria-label="Close menu">
            <HiOutlineXMark className="text-xl" />
          </button>
        </div>
        <p className="px-6 text-[10px] uppercase tracking-[0.3em] text-white/40">Admin Dashboard</p>

        <nav className="mt-8 flex flex-col gap-1 px-4">
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                  isActive ? 'bg-gold text-white' : 'text-white/70 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <Icon className="text-lg" />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
