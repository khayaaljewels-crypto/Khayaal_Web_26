# 01 — Project Overview

## What This Project Is

**Khayaal Jewels** is a premium, luxury-styled imitation jewellery eCommerce website built as a single React application. It has two halves that live in the same codebase and the same build, but are functionally and visually separate:

1. **The Storefront** — the public-facing luxury shopping site: browse collections, view products, add to cart, and check out.
2. **The Admin Dashboard** (`/admin/*`) — a private, authenticated back-office for the store owner to manage products, categories, collections, orders, customers, and site settings.

The business context that shapes many technical decisions:
- The store currently sells a small number of real products (four, at last count), but the catalogue architecture is built to scale to hundreds/thousands.
- **There is no online payment gateway.** Checkout ends by generating a formatted order message and opening WhatsApp — the store owner confirms orders and payment manually over WhatsApp.
- The admin dashboard was deliberately scoped down from a much larger spec (no homepage CMS, no media library, no full analytics yet) to match the current size of the business, with the explicit intent to grow it later.

## Complete Architecture

### Tech Stack
| Layer | Technology |
|---|---|
| Framework | React 19 (function components + hooks only) |
| Build tool | Vite 8 |
| Routing | React Router DOM v7 (`BrowserRouter`, nested `<Routes>`) |
| Styling | Tailwind CSS v4 (CSS-first `@theme` config, no `tailwind.config.js`) |
| Animation | Framer Motion (primary), Lenis (smooth scroll), Swiper (carousels) |
| State | React Context API only — no Redux, no Zustand |
| Data persistence (current) | Browser `localStorage`, wrapped by Context providers |
| Auth | Firebase Authentication (Email/Password for admin, Google Sign-In for customers) — **being rolled out; not yet fully configured with a live Firebase project as of this writing** |
| Icons | react-icons (`hi2` Heroicons2 set primarily, plus `fa`/`fc` for brand icons) |

Note: `gsap` is listed in `package.json` as a dependency but is **not imported or used anywhere in the source code**. All animation is currently done with Framer Motion, CSS, and Lenis. There is no Three.js anywhere in this project despite it being mentioned in early planning conversations.

### High-Level Architecture Diagram

```
                         ┌─────────────────────┐
                         │   main.jsx (entry)   │
                         └──────────┬───────────┘
                                    │
                              ┌─────▼─────┐
                              │  App.jsx  │  ← BrowserRouter + global providers
                              └─────┬─────┘
                                    │
                    ┌───────────────▼────────────────┐
                    │   Root()  (branches on path)     │
                    └───────┬───────────────┬─────────┘
                            │               │
              path starts  │               │  everything else
              with /admin  │               │
                            ▼               ▼
                    ┌───────────────┐  ┌──────────────────┐
                    │ AdminAuthProv. │  │ CustomerAuthProv. │
                    │  + AdminApp    │  │ + storefront      │
                    │  (own routes,  │  │  providers (Cart, │
                    │  own layout)   │  │  Wishlist, etc.)  │
                    └───────────────┘  │  + StorefrontShell │
                                        │  + AppRoutes       │
                                        └───────────────────┘
```

Both branches sit *inside* a shared set of "catalogue" providers that wrap the whole app regardless of route: `SettingsProvider → ProductsProvider → CategoriesProvider → CollectionsProvider → OrdersProvider`. This is deliberate — it's what makes admin edits to products/categories/orders instantly visible on the live storefront (see `08_STATE_MANAGEMENT.md`).

### The Admin/Storefront Split

`App.jsx`'s `Root()` component checks `location.pathname.startsWith('/admin')` and renders one of two completely different component trees:
- **Admin branch**: no storefront chrome at all (no `Navbar`, `Footer`, `MobileBottomNav`, page loader, custom cursor, WhatsApp float button). Instead it renders `AdminApp`, which has its own `<Routes>`, its own sidebar+topbar layout (`AdminLayout`), and its own auth gate (`AdminAuthProvider` + `ProtectedRoute`).
- **Storefront branch**: the full luxury site experience — animated page loader, custom cursor, sticky navbar with mega menu, footer, mobile bottom nav, floating WhatsApp/back-to-top buttons — wrapping `AppRoutes` (all the public pages).

This means the two halves can evolve independently without one accidentally depending on the other's layout.

## Every Major Feature

### Storefront
- **Home page**: hero banner, trending collections carousel, featured categories, best-seller/new-arrival product grids, shop-by-occasion, testimonials, Instagram gallery, newsletter signup.
- **Shop page**: full filtering (category, collection, material, stone, color, occasion, availability, rating, discount, price range), search, sort, grid/list view toggle, infinite scroll *or* numbered pagination (user-togglable), quick view modal, loading skeletons, empty state.
- **Product Details page**: image gallery with hover-zoom magnifier and a fullscreen swipeable lightbox, color variant selector (swaps image + price), ring size selector (for rings), purchase panel (price/MRP/discount/GST note, quantity, wishlist, share, compare, pincode delivery checker), tabbed info (description/specs/care/shipping/returns/reviews/FAQs), full reviews section with a working "write a review" form, and three recommendation rails (Complete the Look, Related, Recently Viewed). A sticky purchase bar appears on mobile.
- **Cart**: line items with quantity controls, "Save for Later", coupon codes (two working demo codes), free-shipping threshold messaging, order summary, recommended products.
- **Checkout**: two-step flow — Customer Info (address form) → Order Review (edit or confirm) — that ends by opening a pre-filled WhatsApp message to the store's WhatsApp number and landing on an animated Thank You / Order Success page. No payment step exists by design.
- **Customer Account** (`/profile`, `/orders`): gated behind Google Sign-In. Shows profile info, saved addresses (CRUD), and order history (matched to the signed-in email against the orders store).
- **Compare, Wishlist**: heart/compare icons throughout the storefront are fully wired to Context, though the dedicated `/wishlist` page itself is still a placeholder (see `18_TODO.md`).

### Admin Dashboard (`/admin`)
- **Auth**: Firebase email/password login restricted to one specific admin email; any other authenticated account sees an explicit "Access Denied" screen rather than being silently redirected.
- **Dashboard home**: stat cards (products, categories, collections, orders by status, low/out-of-stock, customers), two hand-built bar charts (orders by month, best sellers), recent orders, recent customers, quick action shortcuts.
- **Products**: searchable/filterable/paginated table, bulk publish/hide/delete, duplicate, and a full create/edit form covering pricing, inventory, attributes, description, visibility flags (Featured/Trending/New/Best Seller/Coming Soon/Published), and a reorderable image-URL gallery.
- **Categories & Collections**: full CRUD with a visibility (hide/show) toggle each.
- **Orders**: status pipeline (New → Confirmed → Packing → Ready to Ship → Shipped → Delivered → Cancelled → Returned), internal notes, one-click WhatsApp message to the customer, print, copy address.
- **Customers**: automatically derived from order history (grouped by phone number) — no separate customer registration table exists yet. CSV export.
- **Settings**: store name, contact number, WhatsApp number, email, address, social links, and an admin password-change form.

## What Is *Not* Yet Built

This is deliberately honest, not aspirational — see `18_TODO.md` for the full list, but the highlights:
- Firebase is wired into the code but **not yet configured with a real project** (empty `.env`) — auth is currently non-functional in production terms, though it fails gracefully.
- No Firestore/cloud data yet — everything (products, orders, settings, categories, collections) lives in `localStorage`, per-browser/per-device. This was an explicit phased decision (Phase 2 of the Firebase rollout).
- `/wishlist`, `/about`, `/contact`, `/faq`, `/track-order` are placeholder pages.
- No homepage CMS, no media library (image upload), no coupons beyond two hardcoded codes, no real payment gateway (by design), no automated tests.
