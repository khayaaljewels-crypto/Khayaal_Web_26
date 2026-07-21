# 10 — Firebase

## Current Status: Configured in Code, Not Yet Connected to a Real Project

The Firebase SDK (`firebase` npm package, v12) is installed and initialized, but `.env` currently has **empty** values for every `VITE_FIREBASE_*` variable. This means:
- `isFirebaseConfigured` evaluates to `false` throughout the app.
- No real Firebase project is being talked to.
- Every auth surface (admin login, Google sign-in) shows a graceful "not configured yet" message instead of attempting a real request.

This is an intentional, in-progress state — the project owner is in the process of creating a Firebase project and providing its config values (see `18_TODO.md`).

## Configuration (`src/firebase/config.js`)

```js
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

const app = isFirebaseConfigured
  ? (getApps().length ? getApps()[0] : initializeApp(firebaseConfig))
  : null;

export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;
export const storage = app ? getStorage(app) : null;
export const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL ?? 'Khayaaljewels@gmail.com';
```

Three Firebase products are initialized (`auth`, `db`/Firestore, `storage`), but **only `auth` is actually used anywhere in the codebase today**. `db` and `storage` are set up ahead of time for Phase 2 (Firestore data migration) and Phase 3 (media library) but have zero reads/writes against them right now — grep confirms no file imports `db` or `storage` from this module except the module itself.

Required environment variables (see `.env.example`):
```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
VITE_ADMIN_EMAIL
```

Vite automatically loads `.env` (gitignored) at dev-server start and build time; changing it requires a dev server restart (env vars are not hot-reloaded).

## Authentication (Live Feature)

The only Firebase product actually wired into the app. Two independent auth flows share the same Firebase project:
- **Email/Password provider** — admin only, restricted post-login to one specific email (`VITE_ADMIN_EMAIL`). See `07_AUTH_SYSTEM.md` for the full flow.
- **Google provider** — customers only, via `signInWithPopup`.

**Setup still required in the Firebase Console** (cannot be done from code): both the Email/Password and Google sign-in providers need to be manually enabled under Authentication → Sign-in method, and the admin's actual user account needs to be created under Authentication → Users (email `Khayaaljewels@gmail.com`, with its real password) — directly in the console, never through this codebase, so the password is never written to a file.

## Firestore (Initialized, Not Used)

`db` is exported and ready, but there are currently **no collections, documents, reads, or writes** anywhere in the app. All "database-shaped" data (products, categories, collections, orders, settings) lives in `localStorage` via React Context (see `08_STATE_MANAGEMENT.md`).

**Planned (Phase 2, not started)**: migrate `ProductsContext`, `CategoriesContext`, `CollectionsContext`, `OrdersContext`, and `SettingsContext` from `localStorage` to Firestore collections, so that:
- Admin edits made on one device are visible on another.
- Customers' orders can be reliably linked to their Firebase UID instead of a best-effort email match.
- The admin dashboard becomes a genuine multi-device CMS rather than a single-browser tool.

See `16_DATABASE_STRUCTURE.md` for the proposed (not yet implemented) Firestore schema, and `18_TODO.md` for the migration task itself.

No Firestore Security Rules have been written yet, because there's no data in Firestore to protect. Rules will need to be authored as part of the Phase 2 migration — at minimum: only the admin UID can write to `products`/`categories`/`collections`/`settings`, any authenticated user can read published products, and order documents should only be readable by the admin and by the customer who owns them (once orders carry a `userId`).

## Storage (Initialized, Not Used)

`storage` is exported and ready for **Phase 3** — a planned media library allowing the admin to upload product images directly instead of pasting external URLs (the current product form only accepts image *URLs*, typically pointing at Unsplash placeholders — see `09_API.md` and `18_TODO.md`). No upload UI, no Storage Security Rules, and no image-optimization pipeline exist yet.

## Summary of What's Real vs. Planned

| Firebase Product | Initialized in Code | Actually Used | Console Setup Done |
|---|---|---|---|
| Authentication | Yes | Yes (code-complete, awaiting real project config) | Not yet (pending) |
| Firestore | Yes | No | Not yet |
| Storage | Yes | No | Not yet |
