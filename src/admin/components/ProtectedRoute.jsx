import { Navigate, Link } from 'react-router-dom';
import { useAdminAuth } from '@/admin/context/AdminAuthContext';

function AccessDenied() {
  const { logout, user } = useAdminAuth();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-brown px-4 text-center">
      <span className="font-script text-4xl text-gold">Khayaal</span>
      <h1 className="mt-6 font-heading text-2xl text-white">Access Denied</h1>
      <p className="mt-2 max-w-sm text-sm text-white/60">
        {user?.email} is signed in but is not authorized to access the admin dashboard.
      </p>
      <div className="mt-6 flex gap-3">
        <button
          onClick={logout}
          className="rounded-full bg-gold px-6 py-2.5 text-sm font-medium text-white hover:bg-gold-hover"
        >
          Sign Out
        </button>
        <Link to="/" className="rounded-full border border-white/30 px-6 py-2.5 text-sm font-medium text-white hover:border-white">
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isAccessDenied, checkingAuth } = useAdminAuth();

  if (checkingAuth) return null;
  if (isAccessDenied) return <AccessDenied />;
  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;

  return children;
}
