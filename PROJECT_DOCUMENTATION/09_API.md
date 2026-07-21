# 09 — API

## There Is No Custom REST/GraphQL API

This project has **no backend server of its own** and therefore no custom API routes, controllers, or endpoints to document. All "data access" happens in one of two ways:

1. **Local Context state backed by `localStorage`** (products, categories, collections, orders, settings, cart, wishlist, compare, saved addresses) — this is plain in-memory JavaScript object manipulation, not network requests. See `08_STATE_MANAGEMENT.md` for the full list of what's stored where.
2. **Firebase Authentication SDK calls** — the only real network calls the app makes to a backend service, documented below.

If a future phase migrates product/order/category data to Firestore (see `10_FIREBASE.md`, `16_DATABASE_STRUCTURE.md`), *that* will introduce real network calls (Firestore reads/writes/listeners) — this file should be revisited at that point.

## Firebase Authentication Calls (the closest thing to an "API" today)

All calls go through the `firebase/auth` SDK, targeting Google's Firebase Authentication service (not a custom endpoint). None of these are called directly from UI components — they're always wrapped by `AdminAuthContext` or `CustomerAuthContext`.

| SDK Function | Called From | Purpose | Request | Response |
|---|---|---|---|---|
| `signInWithEmailAndPassword(auth, email, password)` | `AdminAuthContext.login()` | Admin sign-in | Email + password | Firebase `UserCredential` on success, throws with an `err.code` (e.g. `auth/wrong-password`) on failure |
| `signOut(auth)` | `AdminAuthContext.logout()`, `CustomerAuthContext.logout()` | Sign out the current user | — | Resolves when the local session is cleared |
| `onAuthStateChanged(auth, callback)` | Both auth contexts, subscribed once on mount | Real-time session listener — fires immediately with the current user (or `null`), then again on every sign-in/sign-out | — | Firebase `User` object or `null` |
| `reauthenticateWithCredential(user, credential)` | `AdminAuthContext.changePassword()` | Firebase requires a fresh login before allowing sensitive changes | `EmailAuthProvider.credential(email, currentPassword)` | Resolves or throws (e.g. wrong current password) |
| `updatePassword(user, newPassword)` | `AdminAuthContext.changePassword()` | Actually changes the password | New password string | Resolves or throws |
| `signInWithPopup(auth, new GoogleAuthProvider())` | `CustomerAuthContext.signInWithGoogle()` | Customer Google sign-in | — (opens a Google popup) | Firebase `UserCredential` with Google profile data (name, email, photo URL), or throws `auth/popup-closed-by-user` if cancelled |

All six are guarded by `isFirebaseConfigured` — if the Firebase project isn't configured (current state, empty `.env`), none of these are actually invoked; callers get an immediate `{ ok: false, error: '...' }` instead.

## External Resources That Are *Not* APIs (Static Assets)

Worth distinguishing from real API calls — these are just `<img src>`/`<link>` URLs, fetched by the browser like any other asset, not JavaScript-initiated requests with request/response handling:
- **Unsplash image URLs** — every product/category/testimonial image in the seed data (`data/productSeed.js`, `data/categorySeed.js`, `data/testimonials.js`, `data/instagram.js`) points to `images.unsplash.com/...` URLs. These are placeholder images, not a real product photography pipeline.
- **Google Fonts** — `index.html` links `fonts.googleapis.com` to load Playfair Display, Poppins, and Great Vibes.

## WhatsApp "Integration"

Also not an API in the traditional sense — the app never calls a WhatsApp API. It constructs a `https://wa.me/<number>?text=<encoded message>` URL (via `utils/buildWhatsAppOrderMessage.js`) and opens it with `window.open(...)`, which hands off to WhatsApp's own web/app client. There is no WhatsApp Business API integration, no delivery confirmation, no read receipts visible to the app — once the link opens, the app has no further visibility into what happens.

## Summary Table

| "API Surface" | Real Network Calls? | Notes |
|---|---|---|
| Products/Categories/Collections/Orders/Settings/Cart/Wishlist/Compare | No | Pure `localStorage`, see `08_STATE_MANAGEMENT.md` |
| Admin Auth | Yes (Firebase) | Not yet live — Firebase unconfigured |
| Customer Auth (Google) | Yes (Firebase) | Not yet live — Firebase unconfigured |
| WhatsApp ordering | No (deep link only) | `wa.me` URL, no API |
| Product/category images | Yes (static asset fetch) | Unsplash placeholder URLs, not app-controlled |
| Fonts | Yes (static asset fetch) | Google Fonts CDN |
