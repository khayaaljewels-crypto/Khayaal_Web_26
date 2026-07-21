# 07 — Authentication System

## Overview

There are **two completely separate authentication systems** sharing one Firebase project, deliberately kept apart so a customer account can never gain admin access and vice versa:

| | Admin | Customer |
|---|---|---|
| Method | Email + Password | Google Sign-In (popup) only — no email/password option |
| Context | `admin/context/AdminAuthContext.jsx` | `context/CustomerAuthContext.jsx` |
| Who can succeed | Exactly one account: whichever email matches `VITE_ADMIN_EMAIL` | Any Google account |
| Where it's provided | Only inside the `/admin/*` branch of `App.jsx` | Only inside the storefront branch of `App.jsx` |
| Session persistence | Firebase's default (persists across browser sessions until sign-out) | Same |

**Current status: Firebase is not yet configured with real project credentials** (`.env` has empty `VITE_FIREBASE_*` values). Both auth systems detect this via `isFirebaseConfigured` (exported from `src/firebase/config.js`) and degrade gracefully — login forms render with a visible "not configured yet" notice instead of crashing, and any attempted sign-in returns a clear error instead of throwing.

## Firebase Authentication

`src/firebase/config.js` initializes the Firebase app once (`getApps().length ? getApps()[0] : initializeApp(...)`, so it's safe under React StrictMode's double-render) and exports:
- `auth` — the Firebase Auth instance (or `null` if not configured)
- `db` — Firestore instance (initialized but **not currently used for any data** — see `16_DATABASE_STRUCTURE.md`)
- `storage` — Firebase Storage instance (initialized but **not currently used** — reserved for the future media library)
- `isFirebaseConfigured` — `Boolean(apiKey && projectId)`
- `ADMIN_EMAIL` — read from `VITE_ADMIN_EMAIL`, falls back to the literal `'Khayaaljewels@gmail.com'` if the env var is absent

**Important security note documented in the code and communicated to the project owner**: the Firebase web config values (`apiKey`, `authDomain`, etc.) are *not secrets* — they're meant to be visible in a browser bundle. Real access control comes from (a) Firebase only ever handling the password server-side — it is never written into this codebase — and (b) the admin-email check described below. There are currently no custom Firestore/Storage Security Rules in this project because no Firestore/Storage data is used yet; these will need to be written before Phase 2 (data migration) goes live.

## Admin Login Flow

1. Admin visits `/admin/login`, enters email + password.
2. `AdminAuthContext.login(email, password)` calls Firebase's `signInWithEmailAndPassword`.
3. On success, it compares `cred.user.email.toLowerCase()` to `ADMIN_EMAIL.toLowerCase()`.
   - **Match** → returns `{ ok: true }`, the login page navigates to `/admin`.
   - **No match** → immediately calls `signOut(auth)` (so a non-admin Google/email account never stays "signed in" against the admin app) and returns `{ ok: false, error: 'This account is not authorized to access the admin panel.' }`.
4. On failure (wrong password, unknown user, etc.), a mapped, human-readable error is shown (`mapAuthError()` translates Firebase error codes like `auth/wrong-password`, `auth/too-many-requests`).
5. `onAuthStateChanged` keeps `user` in sync globally for the lifetime of the tab; `checkingAuth` is `true` only during the initial resolution (prevents a flash of the login page before Firebase reports whether a session already exists).

### Admin Route Protection
`admin/components/ProtectedRoute.jsx` wraps every admin route except `/admin/login`:
```
checkingAuth       → render nothing
isAccessDenied      → "Access Denied" screen (signed in, wrong account) + Sign Out + Back to Home
!isAuthenticated     → redirect to /admin/login
isAuthenticated       → render the admin page
```

### Change Password
`Settings.jsx`'s `ChangePasswordForm` calls `AdminAuthContext.changePassword(currentPassword, newPassword)`, which:
1. Re-authenticates with Firebase (`reauthenticateWithCredential` + `EmailAuthProvider.credential`) using the current password — Firebase requires a "recent login" before allowing a password change, for security.
2. Calls `updatePassword(user, newPassword)`.
3. Enforces a minimum 6-character new password client-side before even attempting the call.

There is no "Forgot Password" flow implemented yet (see `18_TODO.md`) — Firebase supports `sendPasswordResetEmail` but it isn't wired up.

## Customer Google Sign-In Flow

1. Customer clicks "Continue with Google" (`components/account/GoogleSignInPrompt.jsx`), shown wherever a customer needs to be signed in (`/profile`, `/orders`).
2. `CustomerAuthContext.signInWithGoogle()` calls `signInWithPopup(auth, new GoogleAuthProvider())`.
3. On success, `onAuthStateChanged` picks up the new user automatically; the calling page re-renders with `user` populated.
4. If the user closes the popup, this is treated as a silent non-error (`auth/popup-closed-by-user` → returns `{ ok: false, error: '' }`, no message shown).
5. `logout()` calls Firebase `signOut`.

Once signed in, the customer's Google `photoURL`/`displayName`/`email` are shown directly in the UI (Navbar account icon, Profile page header) — there is no separate "customer profile" data store; Google's own account data *is* the profile.

### How Signed-In Customers See "Their" Orders
Orders placed at checkout are **not** tied to a Firebase user ID (checkout doesn't require sign-in at all, by design, since WhatsApp ordering shouldn't be gated behind an account). Instead, both `Profile.jsx` and `Orders.jsx` filter the full order list by matching `order.customer.email` (collected in the checkout form, optional field) against the signed-in Google account's email, case-insensitively. This is an honest best-effort bridge, not a real relational link — if a customer checks out with a different email than their Google account, their orders won't show up. This is a known limitation to be resolved once orders live in Firestore with a proper `userId` field.

## Environment Variables Involved

See `.env.example` at the project root:
```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
VITE_ADMIN_EMAIL
```
All are read via `import.meta.env.VITE_*` (Vite's standard client-exposed env var convention — anything prefixed `VITE_` is bundled into the client JS and is not private).
