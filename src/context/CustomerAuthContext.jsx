import { createContext, useContext, useEffect, useState } from 'react';
import { api, GOOGLE_LOGIN_URL } from '@/utils/apiClient';

const CustomerAuthContext = createContext(null);

export function CustomerAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const refresh = async () => {
    try {
      const { customer } = await api.get('/auth/me');
      setUser(customer);
    } catch {
      setUser(null);
    } finally {
      setCheckingAuth(false);
    }
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Real OAuth2 authorization-code flow — a full-page redirect to the
  // backend, which redirects to Google, then back to /my-account once the
  // backend has verified the account and set the session cookie. Not a
  // popup (that was the Firebase SDK's pattern; Passport's flow is
  // server-driven, so there's no promise to await here).
  const signInWithGoogle = () => {
    window.location.href = GOOGLE_LOGIN_URL;
  };

  const logout = async () => {
    await api.post('/auth/logout');
    setUser(null);
  };

  const value = { user, isAuthenticated: Boolean(user), checkingAuth, signInWithGoogle, logout, refresh };

  return <CustomerAuthContext.Provider value={value}>{children}</CustomerAuthContext.Provider>;
}

export function useCustomerAuth() {
  const ctx = useContext(CustomerAuthContext);
  if (!ctx) throw new Error('useCustomerAuth must be used within a CustomerAuthProvider');
  return ctx;
}
