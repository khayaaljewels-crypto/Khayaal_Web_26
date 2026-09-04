import { createContext, useContext, useEffect, useState } from 'react';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword,
} from 'firebase/auth';
import { auth, ADMIN_EMAIL, isFirebaseConfigured } from '@/firebase/config';
import { setAdminTokenProvider } from '@/utils/apiClient';

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Register this during render, before any protected child can mount and
  // make an API request. Registering it in useEffect left a small window
  // where an authenticated admin page could request a protected endpoint
  // without its Firebase Bearer token.
  setAdminTokenProvider(() => auth.currentUser?.getIdToken());

  useEffect(() => {
    // Reads auth.currentUser live at call time (not the `user` state above),
    // so it's never stale regardless of when a request fires relative to
    // the last onAuthStateChanged event. Every /api/admin/* call in
    // apiClient.js attaches whatever this returns as a Bearer header.
    if (!isFirebaseConfigured) {
      setCheckingAuth(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setCheckingAuth(false);
    });
    return unsubscribe;
  }, []);

  const isAdmin = Boolean(user && user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase());
  const isAccessDenied = Boolean(user && !isAdmin);

  const login = async (email, password) => {
    if (!isFirebaseConfigured) return { ok: false, error: 'Firebase is not configured yet. Add your project config to .env.' };
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      if (cred.user.email?.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
        await signOut(auth);
        return { ok: false, error: 'This account is not authorized to access the admin panel.' };
      }
      return { ok: true };
    } catch (err) {
      return { ok: false, error: mapAuthError(err) };
    }
  };

  const logout = () => signOut(auth);

  const changePassword = async (currentPassword, newPassword) => {
    if (!user) return { ok: false, error: 'Not signed in.' };
    if (!newPassword || newPassword.length < 6) return { ok: false, error: 'New password must be at least 6 characters.' };
    try {
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      return { ok: true };
    } catch (err) {
      return { ok: false, error: mapAuthError(err) };
    }
  };

  const value = {
    user,
    isAuthenticated: isAdmin,
    isAccessDenied,
    checkingAuth,
    isFirebaseConfigured,
    login,
    logout,
    changePassword,
  };

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

function mapAuthError(err) {
  switch (err.code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Incorrect email or password.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please wait a moment and try again.';
    case 'auth/invalid-email':
      return 'Enter a valid email address.';
    default:
      return err.message ?? 'Something went wrong. Please try again.';
  }
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  return ctx;
}
