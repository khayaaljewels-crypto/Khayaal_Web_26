import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineLockClosed, HiOutlineEnvelope, HiOutlineEye, HiOutlineEyeSlash, HiOutlineExclamationTriangle } from 'react-icons/hi2';
import { useAdminAuth } from '@/admin/context/AdminAuthContext';
import Logo from '@/components/ui/Logo';

export default function Login() {
  const { login, isAuthenticated, isFirebaseConfigured } = useAdminAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) return <Navigate to="/admin" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.ok) {
      navigate('/admin');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-brown px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-soft"
      >
        <div className="text-center">
          <Logo className="mx-auto h-12 w-auto" />
          <p className="mt-1 text-[10px] uppercase tracking-[0.35em] text-text/50">Admin Dashboard</p>
        </div>

        {!isFirebaseConfigured && (
          <div className="mt-6 flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-xs text-amber-700">
            <HiOutlineExclamationTriangle className="mt-0.5 shrink-0" />
            Firebase isn't configured yet — add your project config to <code>.env</code> and restart the dev server.
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div className="relative">
            <HiOutlineEnvelope className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-text/40" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Admin email"
              autoFocus
              className="w-full rounded-xl border border-border py-3 pl-11 pr-4 text-sm focus:border-gold focus:outline-none"
            />
          </div>

          <div className="relative">
            <HiOutlineLockClosed className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-text/40" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full rounded-xl border border-border py-3 pl-11 pr-11 text-sm focus:border-gold focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-text/40"
              aria-label="Toggle password visibility"
            >
              {showPassword ? <HiOutlineEyeSlash /> : <HiOutlineEye />}
            </button>
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-brown py-3.5 text-sm font-medium text-white transition-colors hover:bg-gold disabled:opacity-60"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="mt-6 text-center text-[11px] leading-relaxed text-text/40">
          This is a private dashboard for the store owner only, secured by Firebase Authentication.
        </p>
      </motion.div>
    </div>
  );
}
