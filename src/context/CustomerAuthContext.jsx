import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { api, GOOGLE_LOGIN_URL, setUnauthorizedHandler } from '@/utils/apiClient';
import { useToast } from '@/context/ToastContext';

const CustomerAuthContext = createContext(null);
const OAUTH_RETURN_TO_KEY = 'khayaal_oauth_return_to';
const OAUTH_SESSION_RETRIES = 4;

const ERROR_MESSAGES = {
  auth_failed: 'Unable to sign in. Please try again.',
  server_error: "We're having trouble signing you in right now. Please try again in a moment.",
  server_unavailable: "We're having trouble signing you in right now. Please try again in a moment.",
};

export function CustomerAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [authError, setAuthError] = useState('');
  const [signingIn, setSigningIn] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const refresh = useCallback(async ({ retries = 0, retryUnauthorized = false } = {}) => {
    setCheckingAuth(true);
    setAuthError('');

    for (let attempt = 0; attempt <= retries; attempt += 1) {
      try {
        const { customer } = await api.get('/auth/me', {
          cache: 'no-store',
          suppressUnauthorizedHandler: true,
        });
        setUser(customer);
        setCheckingAuth(false);
        return customer;
      } catch (err) {
        // A 401/403 is a definitive missing or expired session. A network or
        // 5xx error is not: treating it as logout is what sent successfully
        // authenticated customers back to the sign-in screen after OAuth.
        const shouldRetryUnauthorized = retryUnauthorized && (err.status === 401 || err.status === 403) && attempt < retries;
        if (shouldRetryUnauthorized) {
          await new Promise((resolve) => setTimeout(resolve, 750 * (attempt + 1)));
          continue;
        }

        if (err.status === 401 || err.status === 403) {
          setUser(null);
          setCheckingAuth(false);
          return null;
        }

        if (attempt < retries) {
          await new Promise((resolve) => setTimeout(resolve, 750 * (attempt + 1)));
          continue;
        }

        setAuthError("We couldn't verify your signed-in session. Please check your connection and try again.");
        setCheckingAuth(false);
        return null;
      }
    }
  }, []);

  // Restore session on every load (and on client-side route changes into
  // the storefront, since a full OAuth round trip is a fresh page load
  // anyway) — this is the only place `/auth/me` is called automatically.
  useEffect(() => {
    // The backend sets its httpOnly session cookie during the OAuth callback.
    // On a cold backend/mobile return it can take a moment before /auth/me is
    // reachable, so use a small, bounded restore window only for that return.
    const returningFromGoogle = Boolean(sessionStorage.getItem(OAUTH_RETURN_TO_KEY));
    refresh({
      retries: returningFromGoogle ? OAUTH_SESSION_RETRIES : 0,
      retryUnauthorized: returningFromGoogle,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!user) return;
    const returnTo = sessionStorage.getItem(OAUTH_RETURN_TO_KEY);
    if (!returnTo) return;

    sessionStorage.removeItem(OAUTH_RETURN_TO_KEY);
    // Never accept an external URL or an admin route from browser storage.
    if (returnTo.startsWith('/') && !returnTo.startsWith('//') && !returnTo.startsWith('/admin')) {
      navigate(returnTo, { replace: true });
    }
  }, [user, navigate]);

  // A 401 from *any* API call (not just this initial check) means the
  // session is no longer valid — e.g. the JWT expired while the tab was
  // open. Reacting globally means "auto logout on expiry" works everywhere,
  // not only right after a page load. Anonymous visitors also get 401 from
  // /auth/me constantly — that's expected, not an error, so this only ever
  // clears state, it never shows a toast or redirects.
  useEffect(() => {
    setUnauthorizedHandler(() => setUser(null));
    return () => setUnauthorizedHandler(null);
  }, []);

  // The OAuth callback redirects here with ?error=<reason> for every
  // failure case (see server/src/routes/auth.js) — surface it once, then
  // scrub the query param so refreshing the page doesn't re-show it.
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const errorCode = params.get('error');
    if (!errorCode) return;

    toast.error(ERROR_MESSAGES[errorCode] || ERROR_MESSAGES.server_error);
    params.delete('error');
    navigate({ pathname: location.pathname, search: params.toString() }, { replace: true });
    // Only ever meant to run when a fresh ?error= shows up in the URL.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  // Real OAuth2 authorization-code flow — a full-page redirect to the
  // backend, which redirects to Google, then back to /my-account once the
  // backend has verified the account and set the session cookie. Not a
  // popup (that was the Firebase SDK's pattern; Passport's flow is
  // server-driven, so there's no promise to await here) — `signingIn` just
  // guards the button against being clicked again before the navigation
  // away from this page actually happens.
  const signInWithGoogle = useCallback(() => {
    if (signingIn) return;
    setSigningIn(true);
    // sessionStorage survives the same-origin OAuth round trip without
    // persisting credentials, and lets a successful login resume its route.
    sessionStorage.setItem(OAUTH_RETURN_TO_KEY, `${location.pathname}${location.search}${location.hash}`);
    window.location.href = GOOGLE_LOGIN_URL;
  }, [signingIn, location]);

  const logout = useCallback(async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await api.post('/auth/logout');
    } catch {
      // Clearing local state below is what actually matters to the user;
      // the cookie is httpOnly and short-lived server-side regardless.
    }
    setUser(null);
    setLoggingOut(false);
    toast.success('Logged out successfully');
    navigate('/');
  }, [loggingOut, navigate, toast]);

  const value = useMemo(
    () => ({ user, isAuthenticated: Boolean(user), checkingAuth, authError, signingIn, loggingOut, signInWithGoogle, logout, refresh }),
    [user, checkingAuth, authError, signingIn, loggingOut, signInWithGoogle, logout, refresh]
  );

  return <CustomerAuthContext.Provider value={value}>{children}</CustomerAuthContext.Provider>;
}

export function useCustomerAuth() {
  const ctx = useContext(CustomerAuthContext);
  if (!ctx) throw new Error('useCustomerAuth must be used within a CustomerAuthProvider');
  return ctx;
}
