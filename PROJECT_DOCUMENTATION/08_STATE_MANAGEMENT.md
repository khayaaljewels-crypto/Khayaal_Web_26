# 08 — State Management

## Approach: React Context API Only

This project uses **plain React Context + `useState`/`useReducer`-style local state inside providers** for all global state. There is no Redux, no Zustand, no Jotai, no React Query/SWR. Every provider follows the same shape:

```js
const XContext = createContext(null);
export function XProvider({ children }) { /* state + effects */ return <XContext.Provider value={...}>{children}</XContext.Provider>; }
export function useX() {
  const ctx = useContext(XContext);
  if (!ctx) throw new Error('useX must be used within an XProvider');
  return ctx;
}
```

The `if (!ctx) throw` guard means every custom hook fails loudly (not silently returning `undefined`) if a component using it is accidentally rendered outside its provider — this has been a useful safety net given how many providers this app nests.

## Persistence Pattern

Almost every provider persists to **`localStorage`**, following the same pattern: read once in a `useState(() => readStored())` initializer, then a `useEffect` that writes back to `localStorage` whenever the state changes. This means:
- State survives page refreshes and browser restarts.
- State is **per-browser, per-device** — it does not sync across devices or between the admin's browser and a customer's browser. This is the central limitation described throughout this documentation set and is the reason a Firestore migration is planned (see `10_FIREBASE.md`, `16_DATABASE_STRUCTURE.md`).

## The Provider Tree

Defined in `App.jsx`. Two branches share a common "catalogue" root:

```
BrowserRouter
└─ SettingsProvider
   └─ ProductsProvider
      └─ CategoriesProvider
         └─ CollectionsProvider
            └─ OrdersProvider
               └─ Root()  ← branches here on pathname
                  │
                  ├─ (if /admin/*) AdminAuthProvider → AdminApp
                  │
                  └─ (else) CustomerAuthProvider
                             └─ UIProvider
                                └─ CartProvider
                                   └─ WishlistProvider
                                      └─ CompareProvider
                                         └─ StorefrontShell (Navbar/Footer/AppRoutes/etc.)
```

**Why this shape matters**: `Settings`, `Products`, `Categories`, `Collections`, and `Orders` are available to *both* the storefront and the admin dashboard, because both need to read (and, for admin, write) the same catalogue/order data. `Cart`, `Wishlist`, `Compare`, and `UI` are storefront-only concepts with no admin equivalent, so they're scoped inside the storefront branch only — the admin dashboard never pays the cost of initializing them, and admin code can never accidentally read a customer's cart.

## Every Global State, Domain by Domain

### `ProductsContext` (`src/context/ProductsContext.jsx`) — the most complex provider
- **Storage key**: `khayaal_products_v1`. Seeded from `data/productSeed.js`'s `SEED_PRODUCTS` (54 generated demo products) on first load.
- **Core idea**: raw records (as edited by the admin form) are "hydrated" on every read — `stockQty` drives derived `inStock`/`lowStock` booleans, and `price`/`oldPrice` drive a derived `discount` percentage. The admin never edits `inStock` directly, only `stockQty`.
- **Two read views**: `products` (published only — what the storefront sees) vs. `allProducts` (everything, including hidden/unpublished — what the admin sees).
- **Mutators**: `addProduct`, `updateProduct`, `deleteProduct`, `deleteProducts` (bulk), `bulkUpdate` (bulk field patch, used for bulk publish/hide), `duplicateProduct`, `resetToSeed`.
- **Derived getters**: `bestSellers`, `newArrivals`, `featured`, `trending`, `comingSoon` (all simple filters over `products`), `getRelatedProducts(product)` (same category), `getCompleteTheLook(product)` (same collection, different category), `getBySlug`, `getById`, `priceBounds` (min/max price across all published products, drives the Shop page's price slider), `collectionsInUse`.
- **Consumed by**: nearly everything — Home sections, Shop, Product Details, Cart recommendations, search, the entire admin Products section, Dashboard stats.

### `CategoriesContext` (`src/context/CategoriesContext.jsx`)
- **Storage key**: `khayaal_categories_v1`. Seeded from `data/categorySeed.js` (9 categories).
- Shape: `{ id, name, slug, image, description, hidden }`. No stored product count — count is always computed live wherever needed by filtering `ProductsContext`'s products by `category === slug`.
- **Mutators**: `addCategory`, `updateCategory`, `deleteCategory`, `toggleHidden`.
- **Consumed by**: mega menu, mobile menu, footer, Shop filters, Product Details breadcrumb, Home's `FeaturedCategories`/`TrendingCollections`, admin `CategoryManager`.

### `CollectionsContext` (`src/context/CollectionsContext.jsx`)
- **Storage key**: `khayaal_collections_v1`. Seeded from `productSeed.js`'s `COLLECTION_SEED` (6 names).
- Shape: `{ id, name, hidden }` — simpler than categories (no image/slug/description).
- **Consumed by**: Shop filters, Product form's Collection `<select>`, admin `CollectionManager`.

### `OrdersContext` (`src/context/OrdersContext.jsx`)
- **Storage key**: `khayaal_orders` (order records) + `khayaal_order_seq` (a simple incrementing counter used to generate `KH0001`, `KH0002`, ... order IDs).
- **`createOrder(...)`**: called once, from `Checkout.jsx`, at the moment the customer confirms their order. Builds the full order record (customer info, itemized line items with price snapshots, subtotal/discount/shipping/grand total, empty `internalNotes` array) and prepends it to the list.
- **Mutators**: `updateOrderStatus`, `addInternalNote`, `deleteOrder`.
- **Derived**: `customers` — groups all orders by `customer.phone`, producing `{ phone, name, email, city, state, orders: [...], totalSpent, lastOrderAt }` for each unique phone number. This *is* the entire "customer database" in the current architecture (see `06_ADMIN_SYSTEM.md`).
- **Consumed by**: Checkout (write), OrderSuccess (read the just-created order via router state, not this context), Profile/Orders pages (read, filtered by email), and the entire admin Orders + Customers sections.

### `SettingsContext` (`src/context/SettingsContext.jsx`)
- **Storage key**: `khayaal_settings_v1`. Defaults defined inline (`DEFAULT_SETTINGS`) rather than a separate seed file, since it's a single object, not a list.
- Shape: `storeName`, `contactNumber`, `whatsappNumber`, `email`, `address`, `instagram`, `facebook`, `pinterest`.
- **Consumed by**: `WhatsAppButton` (float button + checkout deep link both read `whatsappNumber`), `Footer` (social links).

### `CartContext` (`src/context/CartContext.jsx`)
- **Storage keys**: `khayaal_cart` (active items), `khayaal_saved_for_later`, `khayaal_coupon`.
- Cart items: `{ key, product, variant, quantity }` where `key` is `${product.id}-${variant ?? 'default'}` (so the same product in two different colors is tracked as two distinct line items).
- Exports a standalone helper `getItemPrice(item)` (not just an internal function) — it accounts for the selected variant's `priceDelta` — reused outside the context by `OrdersContext.createOrder` and `buildWhatsAppOrderMessage.js`.
- **Coupons**: hardcoded in-code (`COUPONS = { KHAYAAL10: 10% off, WELCOME200: ₹200 off }`) — not admin-editable.
- **Shipping**: free above `FREE_SHIPPING_THRESHOLD = ₹2999`, else a flat `₹99` (also hardcoded, not admin-editable).
- **Mutators**: `addItem`, `removeItem`, `updateQuantity`, `clearCart`, `saveForLater`, `moveToCart`, `removeSaved`, `applyCoupon`, `removeCoupon`.
- **Derived**: `count`, `subtotal`, `discount`, `shippingFee`, `grandTotal`.

### `WishlistContext` (`src/context/WishlistContext.jsx`)
- **Storage key**: `khayaal_wishlist`. Simple array of full product objects (not just IDs).
- `isWishlisted(id)`, `toggleWishlist(product)`, `removeItem(id)`, `count`.
- **Consumed by**: `ProductCard`'s heart icon (used everywhere products are listed), Navbar's wishlist badge count. The dedicated `/wishlist` *page* is a placeholder that doesn't yet render this list (see `18_TODO.md` — a real gap between a fully-working piece of state and its missing UI).

### `CompareContext` (`src/context/CompareContext.jsx`)
- In-memory only (no `localStorage` persistence — resets on refresh).
- Caps at `MAX_COMPARE = 4` products.
- **Consumed by**: `ProductCard`'s compare icon. There is currently no page that *displays* the comparison table — the affordance exists on cards but nothing consumes the resulting list yet (another real gap, see `18_TODO.md`).

### `UIContext` (`src/context/UIContext.jsx`)
- Small grab-bag of UI flags: `isMenuOpen`, `isSearchOpen`, `isCartOpen`, `isLoading`. In practice, most components that need similar open/close state (Navbar's mobile menu, search overlay) manage their own local `useState` instead of using this context — so `UIContext` is under-utilized relative to its original intent (see `17_CODE_QUALITY.md`).

### `AdminAuthContext` (`src/admin/context/AdminAuthContext.jsx`)
Firebase-backed, admin-only. See `07_AUTH_SYSTEM.md` for full detail. State: `user` (Firebase user object or `null`), `checkingAuth`, derived `isAuthenticated`/`isAccessDenied`.

### `CustomerAuthContext` (`src/context/CustomerAuthContext.jsx`)
Firebase-backed, storefront-only. See `07_AUTH_SYSTEM.md`. State: `user`, `checkingAuth`.

## Local (Non-Global) State Worth Knowing About

Not everything is in Context — plenty of state is intentionally kept local to the component that needs it:
- `useProductFilters` (a hook, not a context) — Shop page's entire filter/sort/search state. Deliberately *not* global, since only the Shop page needs it and making it global would force every other page to pay its cost.
- `usePaginatedList` — pagination mode/page/visible-count state, same reasoning.
- `useAddressBook(uid)` — saved addresses, scoped per Firebase UID in `localStorage` (`khayaal_addresses_${uid}`), read fresh by `Profile.jsx` rather than being app-global.
- `useRecentlyViewed` — reads/writes a `localStorage` list directly (not context-wrapped), because only Product Details needs to write to it and several places need to read it as a one-off list, not reactive global state.

## Why No Redux/Zustand

Given the app's actual complexity (a handful of independent domains, each with straightforward CRUD-shaped state, no complex cross-cutting derived state requiring memoized selectors), Context + `useState` covers every current need without extra dependency weight. If the Firestore migration (Phase 2) happens, some of this local `useState`/`localStorage` logic inside providers will likely be replaced by Firestore's own real-time listeners (`onSnapshot`), but the *provider/hook shape* consuming components rely on (`useProducts()`, `useOrders()`, etc.) is designed to stay the same, so that migration shouldn't require touching every component that calls these hooks — only the providers' internals.
