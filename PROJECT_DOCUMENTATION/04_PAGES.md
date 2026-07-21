# 04 — Pages

## Storefront Pages

| Page Component | File | Route | Purpose | Key Components Used |
|---|---|---|---|---|
| `Home` | `pages/Home/Home.jsx` | `/` | Landing page — full luxury brand experience | `Hero`, `TrendingCollections`, `FeaturedCategories`, `ProductGridSection` ×2, `ShopByOccasion`, `Testimonials`, `InstagramGallery`, `Newsletter` |
| `Shop` | `pages/Shop/Shop.jsx` | `/shop` | Full catalogue browsing: filter, search, sort, paginate | `FilterSidebar`, `MobileFilterDrawer`, `ActiveFilterChips`, `ShopToolbar`, `ProductCard`, `ProductGridSkeleton`, `EmptyState`, `LoadMoreControl`, `QuickViewModal` |
| `ProductDetail` | `pages/Product/ProductDetail.jsx` | `/product/:slug` | Single product page | `ImageGallery`, `PurchasePanel`, `InfoTabs`, `ReviewsSection`, `ProductRail` ×3, `StickyMobileBar` |
| `Cart` | `pages/Cart/Cart.jsx` | `/cart` | Shopping bag | `CartLineItem`, `OrderSummary`, `EmptyCart`, `ProductRail` |
| `Wishlist` | `pages/Wishlist/Wishlist.jsx` | `/wishlist` | **Placeholder only** — `WishlistContext` is fully functional (used by the heart icons across the site) but this page hasn't been built yet | `PlaceholderPage` |
| `Checkout` | `pages/Checkout/Checkout.jsx` | `/checkout` | Two-step checkout ending in a WhatsApp order | `CheckoutSteps`, `CustomerInfoForm`, `OrderReview` |
| `OrderSuccess` | `pages/OrderSuccess/OrderSuccess.jsx` | `/order-success` | Thank-you page after WhatsApp order is placed. Redirects to `/` if visited directly without order state. | Inline animated SVG checkmark, `GoldButton` |
| `About` | `pages/About/About.jsx` | `/about` | **Placeholder only** | `PlaceholderPage` |
| `Contact` | `pages/Contact/Contact.jsx` | `/contact` | **Placeholder only** | `PlaceholderPage` |
| `FAQ` | `pages/FAQ/FAQ.jsx` | `/faq` | **Placeholder only** | `PlaceholderPage` |
| `Profile` | `pages/Profile/Profile.jsx` | `/profile` | Customer account hub: profile card, recent orders, saved addresses | `GoogleSignInPrompt` (if signed out), `AddressModal`, `Reveal` |
| `Orders` | `pages/Orders/Orders.jsx` | `/orders` | Full order history for the signed-in customer | `GoogleSignInPrompt` (if signed out), `StatusBadge` |
| `TrackOrder` | `pages/Track/TrackOrder.jsx` | `/track-order` | **Placeholder only** | `PlaceholderPage` |
| `NotFound` | `pages/NotFound.jsx` | `*` (catch-all) | 404 page | `PlaceholderPage` |

## Admin Pages

| Page Component | File | Route | Purpose |
|---|---|---|---|
| `Login` | `admin/pages/Login.jsx` | `/admin/login` | Admin sign-in (email + password, Firebase) |
| `Dashboard` | `admin/pages/Dashboard.jsx` | `/admin` | Stat cards, charts, recent orders/customers, quick actions |
| `ProductList` | `admin/pages/products/ProductList.jsx` | `/admin/products` | Product table: search, filter, bulk actions |
| `ProductForm` | `admin/pages/products/ProductForm.jsx` | `/admin/products/new` and `/admin/products/:id/edit` | Create or edit a product (same component, branches on presence of `:id`) |
| `CategoryManager` | `admin/pages/categories/CategoryManager.jsx` | `/admin/categories` | Category CRUD |
| `CollectionManager` | `admin/pages/categories/CollectionManager.jsx` | `/admin/collections` | Collection CRUD |
| `OrderList` | `admin/pages/orders/OrderList.jsx` | `/admin/orders` | Order table: search, status filter |
| `OrderDetail` | `admin/pages/orders/OrderDetail.jsx` | `/admin/orders/:id` | Single order: items, totals, status changer, notes, WhatsApp/print/copy actions |
| `CustomerList` | `admin/pages/customers/CustomerList.jsx` | `/admin/customers` | Customer table (derived from orders), CSV export |
| `CustomerDetail` | `admin/pages/customers/CustomerDetail.jsx` | `/admin/customers/:phone` | Single customer's contact info + order history |
| `Settings` | `admin/pages/settings/Settings.jsx` | `/admin/settings` | Store info form + admin password change |

## Pages That Are Fully Built vs. Placeholder

**Fully built (13):** Home, Shop, ProductDetail, Cart, Checkout, OrderSuccess, Profile, Orders, and all 11 admin pages.

**Placeholder only (6):** Wishlist, About, Contact, FAQ, TrackOrder, NotFound (NotFound's simplicity is intentional — a plain 404 is normal; the other five are genuinely unfinished features).
