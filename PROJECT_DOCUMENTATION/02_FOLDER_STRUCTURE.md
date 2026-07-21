# 02 — Folder Structure

## Full Project Tree (excluding `node_modules`, `.git`)

```
Khayaal_Web/
├── .env                         # Real Firebase config values (gitignored, currently empty)
├── .env.example                 # Template documenting required env vars
├── .gitignore
├── .oxlintrc.json                # Linter config (oxlint)
├── README.md                     # Default Vite README (not project-specific)
├── index.html                    # HTML entry point, loads Google Fonts, sets <title>/meta
├── package.json / package-lock.json
├── vite.config.js                # Vite config: React plugin, Tailwind plugin, "@" → src alias
├── .claude/settings.local.json   # Claude Code local settings (tooling, not app code)
├── public/
│   └── favicon.svg
└── src/
    ├── main.jsx                  # React entry — mounts <App /> into #root
    ├── App.jsx                   # Root component: providers + admin/storefront branch
    ├── index.css                 # Single import of styles/theme.css
    │
    ├── admin/                    # Everything under /admin lives here, isolated from storefront
    │   ├── AdminApp.jsx           # Admin's own <Routes> tree + lazy page imports
    │   ├── components/            # Admin-only reusable UI
    │   ├── context/                # AdminAuthContext (Firebase auth, admin-only)
    │   ├── layout/                 # AdminLayout (sidebar + topbar shell)
    │   └── pages/                  # One folder per admin section
    │       ├── categories/
    │       ├── customers/
    │       ├── orders/
    │       ├── products/
    │       └── settings/
    │
    ├── components/                # Storefront-only reusable UI, grouped by purpose
    │   ├── account/                 # Customer account UI (Google sign-in prompt, address modal)
    │   ├── animations/               # Framer Motion wrapper components used everywhere
    │   ├── buttons/                   # GoldButton, MagneticButton
    │   ├── cards/                      # ProductCard (grid + list variants)
    │   ├── cart/                        # Cart page building blocks
    │   ├── checkout/                     # Checkout flow building blocks
    │   ├── layout/                        # Navbar, Footer, MobileBottomNav
    │   ├── product/                        # Product Details page building blocks
    │   ├── sections/                        # Home page sections
    │   ├── shop/                             # Shop page filter/grid/pagination building blocks
    │   └── ui/                                # Small shared UI (BackToTop, WhatsAppButton, PlaceholderPage)
    │
    ├── context/                    # Global state via React Context — see 08_STATE_MANAGEMENT.md
    ├── data/                        # Seed data + non-editable constant lists
    ├── firebase/                    # Firebase SDK initialization
    ├── hooks/                        # Reusable custom hooks
    ├── pages/                         # Route-level page components (storefront only)
    ├── routes/                         # React Router route table + scroll-restore helper
    ├── styles/                          # Tailwind v4 theme (design tokens)
    └── utils/                            # Pure helper functions (formatting, CSV export, WhatsApp message builder)
```

## Directory-by-Directory Explanation

### `src/admin/`
Everything specific to the admin dashboard. Deliberately kept separate from `src/components`/`src/pages` so the two halves of the app can't accidentally couple to each other's layout or styling assumptions.

| File | Purpose |
|---|---|
| `AdminApp.jsx` | Defines every `/admin/*` route. Public: `/admin/login`. Everything else is wrapped in `ProtectedRoute` + `AdminLayout`. |
| `components/AdminField.jsx` | Shared `<Field>` label wrapper, `inputClass` string, and `<Toggle>` switch used across every admin form. |
| `components/AdminSidebar.jsx` | Left navigation sidebar (Dashboard/Products/Categories/Collections/Orders/Customers/Settings), collapses to a slide-over on mobile. |
| `components/AdminTopbar.jsx` | Top bar: global search (products/orders/customers), "View Site" link, Logout button. |
| `components/ProtectedRoute.jsx` | Auth gate. Shows nothing while checking, an "Access Denied" screen if signed in as the wrong account, or redirects to `/admin/login` if signed out. |
| `components/SimpleBarChart.jsx` | Hand-built horizontal bar chart (no charting library) used on the Dashboard. |
| `components/StatCard.jsx` | The stat tiles on the Dashboard (Total Products, Total Orders, etc.), optionally clickable. |
| `components/StatusBadge.jsx` | Colored pill for order status (New/Confirmed/Delivered/etc.). |
| `context/AdminAuthContext.jsx` | Firebase email/password sign-in, restricted to one admin email; exposes login/logout/changePassword. |
| `layout/AdminLayout.jsx` | The persistent sidebar+topbar shell every authenticated admin page renders inside (`<Outlet />`). |
| `pages/Dashboard.jsx` | Admin home: stat cards, charts, recent orders/customers, quick actions. |
| `pages/Login.jsx` | Admin login form (email + password). |
| `pages/categories/CategoryManager.jsx` | Category CRUD (grid of cards + modal form). |
| `pages/categories/CollectionManager.jsx` | Collection CRUD (table + inline add form). |
| `pages/customers/CustomerList.jsx` | Table of customers derived from order history, with CSV export. |
| `pages/customers/CustomerDetail.jsx` | Single customer's contact info + full order history. |
| `pages/orders/OrderList.jsx` | Searchable/filterable order table. |
| `pages/orders/OrderDetail.jsx` | Full order view: items, totals, status changer, internal notes, WhatsApp/print/copy-address actions. |
| `pages/products/ProductList.jsx` | Searchable/filterable/paginated product table with bulk actions. |
| `pages/products/ProductForm.jsx` | Create/Edit product form (shared for both via the `:id` route param). |
| `pages/settings/Settings.jsx` | Store info form + admin change-password form. |

### `src/components/`
Storefront-only presentational and interactive components, grouped by the part of the site they belong to.

- **`account/`** — `AddressModal.jsx` (add/edit a saved address), `GoogleSignInPrompt.jsx` (shown wherever a customer needs to be signed in — Profile, Orders).
- **`animations/`** — `Reveal.jsx` (fade/slide-in on scroll, used everywhere), `StaggerGroup.jsx` (staggered children reveal), `PageLoader.jsx` (the animated "Khayaal" splash on first load), `ScrollProgress.jsx` (top progress bar), `CustomCursor.jsx` (desktop-only custom cursor), `GoldParticles.jsx` (decorative floating particles, used in the Hero).
- **`buttons/`** — `GoldButton.jsx` (the site's primary CTA button, supports `to`/`href`/`onClick`), `MagneticButton.jsx` (cursor-follow hover effect, currently unused — see `17_CODE_QUALITY.md`).
- **`cards/`** — `ProductCard.jsx`: the single most reused component in the app. Renders both grid and list layouts, handles wishlist/compare/quick-view/add-to-cart/buy-now, stock badges.
- **`cart/`** — `CartLineItem.jsx`, `EmptyCart.jsx`, `OrderSummary.jsx` (subtotal/discount/shipping/total + coupon form).
- **`checkout/`** — `CheckoutSteps.jsx` (step indicator), `CustomerInfoForm.jsx` (address form with validation), `OrderReview.jsx` (final review + WhatsApp confirm button).
- **`layout/`** — `Navbar.jsx` (sticky, transparent-on-hero, mega menu, search overlay trigger, cart/wishlist/account icons), `MobileBottomNav.jsx` (floating glass pill nav), `footer/Footer.jsx`, `navbar/MegaMenu.jsx`, `navbar/MobileMenu.jsx` (fullscreen mobile nav), `navbar/SearchOverlay.jsx` (fullscreen search), `navbar/navLinks.js` (nav link data).
- **`product/`** — everything the Product Details page is built from: `ImageGallery.jsx` + `FullscreenGallery.jsx` (gallery + lightbox), `VariantSelector.jsx` (color + ring size), `PurchasePanel.jsx`, `StickyMobileBar.jsx`, `InfoTabs.jsx`, `ReviewsSection.jsx`, `ProductRail.jsx` (reused for all three recommendation rails), `PincodeChecker.jsx`.
- **`sections/`** — one file per Home page section: `Hero.jsx`, `TrendingCollections.jsx`, `FeaturedCategories.jsx`, `ProductGridSection.jsx` (reused for Best Sellers and New Arrivals), `ShopByOccasion.jsx`, `Testimonials.jsx`, `InstagramGallery.jsx`, `Newsletter.jsx`.
- **`shop/`** — everything the Shop page's filtering/grid system is built from: `FilterSidebar.jsx` / `MobileFilterDrawer.jsx` (share `FilterPanelContent.jsx`), `FilterSection.jsx` + `FilterCheckbox.jsx` (accordion + checkbox primitives), `PriceRangeSlider.jsx`, `ActiveFilterChips.jsx`, `ShopToolbar.jsx` (search/sort/view toggle), `ProductGridSkeleton.jsx`, `EmptyState.jsx`, `Pagination.jsx` + `LoadMoreControl.jsx` (numbered pages vs. infinite scroll), `QuickViewModal.jsx`.
- **`ui/`** — `BackToTop.jsx`, `WhatsAppButton.jsx` (floating chat button, reads the store's WhatsApp number from Settings), `PlaceholderPage.jsx` (the "coming soon" page used by every unbuilt route).

### `src/context/`
See `08_STATE_MANAGEMENT.md` for full detail on each. One file per domain: `CartContext`, `WishlistContext`, `CompareContext`, `ProductsContext`, `CategoriesContext`, `CollectionsContext`, `OrdersContext`, `SettingsContext`, `UIContext`, `CustomerAuthContext`. (`AdminAuthContext` lives under `admin/context/` instead, since it's admin-only.)

### `src/data/`
Static/seed data — **not** live application state (that's what `context/` is for).

| File | Purpose |
|---|---|
| `productSeed.js` | Generates the 54-product demo catalogue (`SEED_PRODUCTS`) used to seed `ProductsContext` on first load. Also exports `CATEGORY_DEFS` (product name templates) and `COLLECTION_SEED`. |
| `categorySeed.js` | The 9 starter categories (`CATEGORY_SEED`) used to seed `CategoriesContext`. |
| `constants.js` | Fixed enum-like lists that are **not** admin-editable in the current scope: `MATERIALS`, `STONES`, `COLORS`, `COLOR_HEX`, `FINISHES`, `RING_SIZES`, `OCCASION_OPTIONS`, `occasions` (display data for the Shop-by-Occasion section), `ORDER_STATUSES`. |
| `reviews.js` | Deterministic fake-review generator (`getReviewsForProduct`) — reviews are generated on the fly from a product's ID, not stored. |
| `testimonials.js` | Static testimonial quotes for the Home page. |
| `instagram.js` | Static Instagram gallery image data for the Home page. |

### `src/firebase/`
`config.js` — initializes the Firebase app from `VITE_FIREBASE_*` env vars and exports `auth`, `db`, `storage`, and an `isFirebaseConfigured` boolean everything else checks before calling any Firebase API. See `10_FIREBASE.md`.

### `src/hooks/`
| File | Purpose |
|---|---|
| `useLenis.js` | Initializes Lenis smooth-scroll on mount (storefront only). |
| `useLockBodyScroll.js` | Locks `document.body` scroll while a modal/drawer is open. |
| `usePaginatedList.js` | Powers the Shop page's dual pagination modes (infinite scroll / numbered pages). |
| `useProductFilters.js` | The Shop page's entire filter/sort/search state machine. |
| `useRecentlyViewed.js` | Reads/writes a `localStorage` list of recently viewed product IDs. |
| `useAddressBook.js` | Reads/writes a `localStorage`-backed address list scoped to a Firebase user ID. |

### `src/pages/`
One folder per storefront route (see `04_PAGES.md` for the full route table). Every folder contains exactly one `.jsx` file matching the folder name.

### `src/routes/`
`AppRoutes.jsx` (storefront route table, lazy-loaded) and `ScrollToTop.jsx` (resets scroll position on route change).

### `src/styles/`
`theme.css` — the entire design system: Tailwind v4 `@theme` block (colors, fonts, easings, shadows), global base styles, a few custom `@layer components` utility classes (`.container-luxury`, `.eyebrow`, `.font-script`, the price-slider thumb styling), and keyframes (`shimmer`, `float-particle`, `marquee`).

### `src/utils/`
Pure functions, no React, no state:
- `format.js` — `formatPrice()` (INR currency formatting).
- `csv.js` — `downloadCSV()` (client-side CSV file generation/download, used by the admin Customers page).
- `buildWhatsAppOrderMessage.js` — builds the formatted order text and the `wa.me` deep link used at checkout and in the admin Order Detail page.
