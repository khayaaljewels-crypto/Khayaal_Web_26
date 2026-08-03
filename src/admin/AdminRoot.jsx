import { AdminAuthProvider } from './context/AdminAuthContext';
import AdminApp from './AdminApp';

// Single entry point for everything /admin needs — lazy-loaded as one unit
// from App.jsx. AdminAuthContext pulls in the full firebase/auth SDK, which
// used to ship in the main bundle for every storefront visitor even though
// only /admin ever uses it; this file is the one dynamic-import boundary
// that keeps it out of that shared chunk.
export default function AdminRoot() {
  return (
    <AdminAuthProvider>
      <AdminApp />
    </AdminAuthProvider>
  );
}
