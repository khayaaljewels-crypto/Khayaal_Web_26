# 18 — TODO

A consolidated punch list of everything still outstanding, gathered from across this documentation set. Grouped by priority/theme, not by file.

## Blocking / In-Progress

- [ ] **Finish Firebase Console setup**: create the Firebase project, enable Email/Password + Google sign-in providers, create the admin user (`Khayaaljewels@gmail.com`) directly in the console, set up Firestore + Storage.
- [ ] **Fill in `.env`** with the real Firebase web app config once the project exists, then restart the dev server and verify both auth flows end-to-end with real credentials (currently only verified in the "gracefully unconfigured" state).

## Placeholder Pages That Need Real Implementations

- [ ] `/wishlist` — `WishlistContext` is fully functional (hearts, badge counts) but there's no page rendering the actual list. This is the highest-priority placeholder since the underlying state already works.
- [ ] `/about` — brand story, timeline, mission/vision, stats (per original design brief).
- [ ] `/contact` — contact form, map, business hours, social links.
- [ ] `/faq` — accordion FAQ + size guide.
- [ ] `/track-order` — order status tracker (note: `OrdersContext` already has everything needed — status, dates — to build a real version of this).

## Half-Built Features (State Exists, UI Doesn't)

- [ ] **Compare Products page/drawer** — `CompareContext` tracks up to 4 selected products (toggle icons already work on `ProductCard` and `PurchasePanel`) but there's no page that displays the comparison table.
- [ ] **`UIContext` is provided but never consumed** — either wire it into real cross-component UI state coordination or remove it.

## Admin Dashboard — Deliberately Deferred Scope

- [ ] **Homepage CMS** — editable hero banner/headline/images, featured products picker, promotional banners, footer content, announcements. Currently everything on the Home page is hardcoded in `src/components/sections/*.jsx`.
- [ ] **Media Library** — direct image upload (Firebase Storage is initialized but unused). Currently the product/category image fields only accept pasted URLs.
- [ ] **Full Analytics suite** — monthly revenue, top categories/collections, most-viewed products. The Dashboard currently has two basic charts (orders by month, best sellers) only.
- [ ] **SEO/Meta management** — no admin-editable meta title/description/keywords per page; no per-route `<title>` at all currently (the whole site shares one static `index.html` title).
- [ ] **Google Analytics integration** — not present anywhere.
- [ ] **Coupon management UI** — coupons are hardcoded (`KHAYAAL10`, `WELCOME200` in `CartContext.jsx`), not admin-creatable.
- [ ] **"Forgot Password" flow for admin** — Firebase supports `sendPasswordResetEmail`; not wired up yet.
- [ ] **CSV export for Orders and Products** (Customers export already exists) — only Customers currently has a working CSV export button.
- [ ] **Bulk category reassignment** for products (only bulk publish/hide/delete exist today).
- [ ] **Multiple admin users** — the system is hardcoded to exactly one admin email via `VITE_ADMIN_EMAIL`; no role/permission system exists for a second admin or limited-permission staff account.

## Data Layer — Phase 2 (Firestore Migration)

- [ ] Migrate `ProductsContext`, `CategoriesContext`, `CollectionsContext`, `OrdersContext`, `SettingsContext` from `localStorage` to Firestore (see the proposed schema in `16_DATABASE_STRUCTURE.md`).
- [ ] Add a real `userId` field to orders, linking them to the customer's Firebase UID instead of the current best-effort email-matching in `Profile.jsx`/`Orders.jsx`.
- [ ] Create a real `customers` collection (currently "customers" are entirely derived from grouping orders by phone number — there's no standalone customer registration/profile record).
- [ ] Migrate the address book (`useAddressBook`, currently `localStorage` per Firebase UID) to a Firestore subcollection.
- [ ] Write Firestore & Storage Security Rules (none exist yet, since no Firestore/Storage data exists yet).

## Commerce Features Not Yet Built

- [ ] Real payment gateway integration — explicitly out of scope for now by business decision (WhatsApp-based ordering is the intended permanent flow, not a stopgap), but worth listing since it was mentioned as a "future" item.
- [ ] Inventory movement log / stock history (only current `stockQty` is tracked, no history of changes).
- [ ] Product reviews that actually persist — today's reviews are deterministically *generated* fake data (`data/reviews.js`) plus a "write a review" form whose submissions only live in that page's local state and vanish on refresh.
- [ ] Order invoicing (PDF or similar) — the admin's "Print" button uses the browser's native print dialog on the Order Detail page; there's no generated invoice document.

## Code Quality Cleanup (see `17_CODE_QUALITY.md` for full detail)

- [ ] Remove or actually use the `gsap` dependency.
- [ ] Wire in or delete `MagneticButton.jsx`.
- [ ] Remove the unused `marquee` keyframe from `theme.css`, or use it.
- [ ] Extract a shared `FilterRadio` component to de-duplicate the 3 near-identical radio-button blocks in `FilterPanelContent.jsx`.
- [ ] Add error boundaries around the two route trees.
- [ ] Add an automated test suite (none exists today).

## Housekeeping

- [ ] `README.md` is still the default Vite-generated readme — has no project-specific setup instructions, environment variable documentation, or description of the two-app (storefront/admin) structure.
- [ ] This project has no git repository as of this documentation pass (per project history, the owner has repeatedly declined setting one up) — strongly recommended given the amount of custom code, independent of anything else on this list.

## Explicitly Out of Scope (Not TODOs — Documented Decisions, Not Gaps)

Listed here only to prevent them being mistaken for oversights:
- No payment gateway (WhatsApp ordering is the intentional, permanent checkout method).
- No server-rendered SEO (this is a client-rendered SPA by design).
- No real security around the current admin login beyond Firebase Auth itself (a client-side app inherently can't hide more than that; documented plainly to the project owner).
