# 03 — Component Map

Every component is a function component using hooks (no class components anywhere). "Used In" lists direct parents/importers found in the current source; "Children" lists the notable custom components it renders (native HTML and icon components are omitted for readability).

## Layout Components (global chrome — storefront only)

| Component | Used In | Renders (children) |
|---|---|---|
| `Navbar` (`layout/navbar/Navbar.jsx`) | `App.jsx` → `StorefrontShell` | `MegaMenu`, `SearchOverlay`, `MobileMenu` |
| `MegaMenu` (`layout/navbar/MegaMenu.jsx`) | `Navbar` | — (renders category links from `CategoriesContext`) |
| `SearchOverlay` (`layout/navbar/SearchOverlay.jsx`) | `Navbar` | — |
| `MobileMenu` (`layout/navbar/MobileMenu.jsx`) | `Navbar` | — |
| `Footer` (`layout/footer/Footer.jsx`) | `App.jsx` → `StorefrontShell` | `Reveal` |
| `MobileBottomNav` (`layout/MobileBottomNav.jsx`) | `App.jsx` → `StorefrontShell` | — |
| `BackToTop` (`ui/BackToTop.jsx`) | `App.jsx` → `StorefrontShell` | — |
| `WhatsAppButton` (`ui/WhatsAppButton.jsx`) | `App.jsx` → `StorefrontShell` | — |
| `PageLoader` (`animations/PageLoader.jsx`) | `App.jsx` → `StorefrontShell` | — |
| `ScrollProgress` (`animations/ScrollProgress.jsx`) | `App.jsx` → `StorefrontShell` | — |
| `CustomCursor` (`animations/CustomCursor.jsx`) | `App.jsx` → `StorefrontShell` | — |
| `ScrollToTop` (`routes/ScrollToTop.jsx`) | `App.jsx` → `StorefrontShell` | — (no visual output; side-effect only) |

## Animation Primitives (used throughout, not page-specific)

| Component | Used In | Notes |
|---|---|---|
| `Reveal` (`animations/Reveal.jsx`) | 17 files across Home sections, Footer, Shop, Product Details, Cart, Checkout, admin-adjacent account pages | Generic scroll-triggered fade/slide wrapper. Most-reused animation component in the app. |
| `StaggerGroup` (`animations/StaggerGroup.jsx`) | `FeaturedCategories`, `ShopByOccasion` | Staggers its children's entrance. |
| `GoldParticles` (`animations/GoldParticles.jsx`) | `Hero` | Decorative floating dots in the hero background. |

## Buttons

| Component | Used In | Notes |
|---|---|---|
| `GoldButton` (`buttons/GoldButton.jsx`) | 7 files: `Hero`, `Footer`, `EmptyCart`, `EmptyState` (shop), `PlaceholderPage`, `CustomerInfoForm`, `OrderSuccess` | Primary CTA everywhere. Supports `to` (Link), `href` (anchor), or `onClick` (button), plus `solid`/`outline`/`ghost` variants. |
| `MagneticButton` (`buttons/MagneticButton.jsx`) | **Not currently imported anywhere** | Built during Phase 1 but never wired in — see `17_CODE_QUALITY.md`. |

## Product Card (the single most-reused component)

`ProductCard` (`cards/ProductCard.jsx`) — used in:
- `ProductGridSection` (Home page Best Sellers / New Arrivals)
- `ProductRail` (Cart's "Recommended For You", Product Details' three recommendation rails)
- `Shop.jsx` (main product grid, both grid and list view via a `view` prop)

Renders: wishlist heart (via `WishlistContext`), compare icon (via `CompareContext`), quick-view trigger (calls an `onQuickView` prop passed down from the page, which opens `QuickViewModal`), add-to-cart/buy-now (via `CartContext`).

## Home Page Section Components

All live in `src/components/sections/`, all used exclusively by `pages/Home/Home.jsx`, in this render order:

`Hero` → `TrendingCollections` → `FeaturedCategories` → `ProductGridSection` (Best Sellers) → `ShopByOccasion` → `ProductGridSection` (New Arrivals) → `Testimonials` → `InstagramGallery` → `Newsletter`

| Component | Children |
|---|---|
| `Hero` | `GoldParticles`, `GoldButton` |
| `TrendingCollections` | Swiper carousel of category cards (data from `CategoriesContext`) |
| `FeaturedCategories` | `Reveal`, `StaggerGroup` |
| `ProductGridSection` | `Reveal`, `ProductCard` (×8), `QuickViewModal` — reused twice on Home with different `products`/`title` props |
| `ShopByOccasion` | `Reveal`, `StaggerGroup` (data from `data/constants.js`) |
| `Testimonials` | Swiper carousel |
| `InstagramGallery` | static grid (data from `data/instagram.js`) |
| `Newsletter` | email capture form |

## Shop Page Component Tree

`pages/Shop/Shop.jsx` renders:
- `Reveal` (heading)
- `FilterSidebar` (desktop) → `FilterPanelContent` → `FilterSection` (×9, one per filter group) → `FilterCheckbox` / `PriceRangeSlider`
- `MobileFilterDrawer` (mobile) → same `FilterPanelContent` (shared, avoids duplicating filter UI)
- `ActiveFilterChips`
- `ShopToolbar` (search input, sort `<select>`, grid/list toggle)
- `ProductGridSkeleton` (loading state) **or** `EmptyState` (no results) **or** a grid/list of `ProductCard`
- `LoadMoreControl` → `Pagination` (numbered mode) or an intersection-observer sentinel (infinite mode)
- `QuickViewModal`

## Product Details Page Component Tree

`pages/Product/ProductDetail.jsx` renders:
- `Reveal` (breadcrumb, gallery column, purchase panel column)
- `ImageGallery` → `FullscreenGallery` (opened from within the gallery)
- `PurchasePanel` → `ColorVariantSelector` + `RingSizeSelector` (both from `product/VariantSelector.jsx`) + `PincodeChecker`
- `InfoTabs` (self-contained tabbed content, no further custom children)
- `ReviewsSection` (self-contained: rating summary, distribution bars, review list, write-review form)
- `ProductRail` ×3 (Complete the Look, Related Products, Recently Viewed) → each renders `ProductCard` + `QuickViewModal`
- `StickyMobileBar` (mobile-only fixed purchase bar)

## Cart Page Component Tree

`pages/Cart/Cart.jsx` renders:
- `Reveal`
- `CartLineItem` (×N, once per cart item, `mode="cart"`)
- `CartLineItem` (×N, once per saved-for-later item, `mode="saved"`)
- `OrderSummary` (coupon form + totals)
- `EmptyCart` (when both cart and saved-for-later are empty)
- `ProductRail` (recommended products)

## Checkout Page Component Tree

`pages/Checkout/Checkout.jsx` renders:
- `Reveal`
- `CheckoutSteps` (2-step progress indicator)
- `CustomerInfoForm` (step 1)
- `OrderReview` (step 2)

`pages/OrderSuccess/OrderSuccess.jsx` is a separate page (not part of the `Checkout` tree) reached via `navigate('/order-success', { state: { order } })` — it reads the order from router state, not from a shared component.

## Customer Account Components

| Component | Used In |
|---|---|
| `GoogleSignInPrompt` (`account/GoogleSignInPrompt.jsx`) | `pages/Profile/Profile.jsx`, `pages/Orders/Orders.jsx` (shown when `user` is null) |
| `AddressModal` (`account/AddressModal.jsx`) | `pages/Profile/Profile.jsx` |

## Admin Component Tree

`admin/AdminApp.jsx` → `ProtectedRoute` → `AdminLayout` (`AdminSidebar` + `AdminTopbar` + `<Outlet />`) → one of the admin pages.

| Component | Used In |
|---|---|
| `AdminSidebar` | `AdminLayout` |
| `AdminTopbar` | `AdminLayout` |
| `ProtectedRoute` | `AdminApp.jsx` (wraps every non-login admin route) |
| `StatCard` | `admin/pages/Dashboard.jsx` |
| `SimpleBarChart` | `admin/pages/Dashboard.jsx` |
| `StatusBadge` | `admin/pages/Dashboard.jsx`, `admin/pages/orders/OrderList.jsx`, `admin/pages/orders/OrderDetail.jsx`, `admin/pages/customers/CustomerDetail.jsx`, `pages/Orders/Orders.jsx` (customer-facing, reused from admin) |
| `Field`, `inputClass`, `Toggle` (`admin/components/AdminField.jsx`) | `ProductForm`, `Settings`, `CategoryManager` (modal), `account/AddressModal.jsx` (reused on the storefront side too) |

### Admin Pages (route-level, one file each — see `04_PAGES.md` for routes)

`Login`, `Dashboard`, `products/ProductList`, `products/ProductForm`, `categories/CategoryManager`, `categories/CollectionManager`, `orders/OrderList`, `orders/OrderDetail`, `customers/CustomerList`, `customers/CustomerDetail`, `settings/Settings`.

## Components With No Current Usage

- `MagneticButton` — built, never imported.
- `PlaceholderPage` — used by 6 route pages (`About`, `Contact`, `FAQ`, `TrackOrder`, `Wishlist`, `NotFound`), so it is used, just not by any *finished* feature page.

See `17_CODE_QUALITY.md` for the full unused-code audit.
