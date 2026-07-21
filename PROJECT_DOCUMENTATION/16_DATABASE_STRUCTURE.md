# 16 — Database Structure

## Important: There Is No Live Database Yet

This project does **not currently use Firestore, or any other database**, for its data. Firestore is initialized in code (`src/firebase/config.js`, exported as `db`) but nothing reads from or writes to it. Every piece of "database-shaped" data described below actually lives in the **browser's `localStorage`**, structured and accessed through React Context providers (see `08_STATE_MANAGEMENT.md`).

This file documents two things, clearly separated:
1. **The current `localStorage` schema** — what genuinely exists today.
2. **A proposed Firestore schema** for the planned Phase 2 migration — not yet implemented, included here as a reference for whoever builds that migration.

---

## Part 1 — Current Schema (`localStorage`, via Context)

Each "collection" below is one `localStorage` key holding a JSON-stringified array (or object, for Settings) of "documents."

### `khayaal_products_v1` — Products
Array of product records. Managed by `src/context/ProductsContext.jsx`.

| Field | Type | Notes |
|---|---|---|
| `id` | string | `kj-<timestamp36>` for admin-created products, `kj-001`..`kj-054` for seed data |
| `sku` | string | e.g. `KJ-0001` |
| `slug` | string | URL slug, auto-generated from `name` if not set, used in `/product/:slug` |
| `name`, `brand` | string | |
| `category` | string | **Relationship**: matches a Category's `slug` (not `id`) — see below |
| `collection` | string | **Relationship**: matches a Collection's `name` (not `id`) |
| `occasion` | string | One of `constants.js`'s `OCCASION_OPTIONS` |
| `material`, `stone`, `color` | string | One of `constants.js`'s fixed enums |
| `price`, `oldPrice`, `costPrice` | number | `oldPrice` optional (null = no discount); `costPrice` is admin/internal only, never shown to customers |
| `stockQty` | number | Source of truth for stock — `inStock`/`lowStock`/`discount` are *derived*, not stored (computed by `hydrate()` on every read) |
| `rating`, `reviewCount` | number | Static/seed values today — not updated by the (fake, non-persisted) review system |
| `images` | string[] | Array of image URLs, order matters (first = primary) |
| `isBestSeller`, `isNewArrival`, `isFeatured`, `isTrending`, `isComingSoon`, `isPublished` | boolean | Visibility/merchandising flags |
| `description`, `shortDescription`, `careInstructions` | string | |
| `tags` | string[] | |
| `specs` | object | `{ metal, stone, finish, weight, dimensions, occasion, packageIncludes, warranty, countryOfOrigin }` |
| `deliveryDays`, `returnDays`, `codAvailable` | number/number/boolean | |
| `videos` | array | Reserved field, always empty — no video support built yet |
| `variants` | array | `{ id, label, hex, image, priceDelta }[]` — color variants that swap the displayed image and adjust price |
| `ringSizes` | array or `null` | `{ size, available }[]`, only populated for products in the `rings` category |

### `khayaal_categories_v1` — Categories
Managed by `src/context/CategoriesContext.jsx`.

| Field | Type | Notes |
|---|---|---|
| `id` | string | `cat-<timestamp36>` for admin-created, fixed slugs for seed data |
| `name`, `slug`, `image`, `description` | string | |
| `hidden` | boolean | |

No stored product count — always computed live as `products.filter(p => p.category === slug).length`.

### `khayaal_collections_v1` — Collections
Managed by `src/context/CollectionsContext.jsx`. Much simpler than categories:

| Field | Type |
|---|---|
| `id` | string |
| `name` | string |
| `hidden` | boolean |

### `khayaal_orders` — Orders (+ `khayaal_order_seq` counter)
Managed by `src/context/OrdersContext.jsx`.

| Field | Type | Notes |
|---|---|---|
| `id` | string | `KH0001`, `KH0002`, ... — sequential, generated from the separate `khayaal_order_seq` counter key |
| `createdAt` | ISO string | |
| `status` | string | One of `constants.js`'s `ORDER_STATUSES` |
| `customer` | object | `{ name, phone, whatsapp, email, address, city, state, pincode, landmark, notes, agreeTerms }` — a full snapshot from the checkout form, **not** a reference/foreign key to any customer table (there isn't one) |
| `items` | array | `{ productId, name, image, quantity, variantLabel, price, lineTotal }[]` — a **price snapshot** at time of order, not a live reference to the product (so later editing a product's price doesn't retroactively change historical orders) |
| `subtotal`, `discount`, `shippingFee`, `grandTotal` | number | |
| `coupon` | string or `null` | Coupon code applied, if any |
| `notes` | string | Customer's order notes |
| `internalNotes` | array | `{ text, at }[]` — admin-only notes, added after order creation |

### `khayaal_settings_v1` — Settings
Managed by `src/context/SettingsContext.jsx`. A **single object**, not an array (there's only ever one settings record):

```json
{
  "storeName": "Khayaal Jewels",
  "contactNumber": "919037246978",
  "whatsappNumber": "919037246978",
  "email": "hello@khayaaljewels.com",
  "address": "Kozhikode, Kerala, India",
  "instagram": "https://instagram.com",
  "facebook": "https://facebook.com",
  "pinterest": "https://pinterest.com"
}
```

### Other `localStorage` Keys (Storefront, Not Admin-Managed)

| Key | Managed By | Shape |
|---|---|---|
| `khayaal_cart` | `CartContext` | `{ key, product, variant, quantity }[]` — `product` is a full embedded copy, not a reference |
| `khayaal_saved_for_later` | `CartContext` | Same shape as cart |
| `khayaal_coupon` | `CartContext` | The applied coupon code string |
| `khayaal_wishlist` | `WishlistContext` | Array of full product objects |
| `khayaal_recently_viewed` | `useRecentlyViewed` hook | Array of product ID strings, max 12 |
| `khayaal_addresses_<firebaseUID>` | `useAddressBook` hook | `{ id, label, name, phone, address, city, state, pincode, landmark, isDefault }[]`, one key per signed-in customer |

`CompareContext`'s state is **not** persisted — it lives only in memory and resets on refresh.

## "Relationships" in the Current Schema

Because this isn't a real relational or document database, every "relationship" is a plain string match evaluated at read time, not an enforced foreign key:

```
Product.category  ──(string equals)──>  Category.slug
Product.collection ──(string equals)──>  Collection.name
Order.customer.phone ──(grouping key)──>  "Customer" (a derived, not stored, entity)
Cart/Wishlist item.product ──(embedded copy)──  NOT a live reference to ProductsContext
```

Notably: **deleting a Category or Collection does not cascade** — products keep their old `category`/`collection` string value, which will simply no longer match anything (they become "orphaned" but don't disappear or error).

---

## Part 2 — Proposed Firestore Schema (Not Yet Built)

This is a **design proposal** for the planned Phase 2 migration (see `10_FIREBASE.md`, `18_TODO.md`), included so a future implementer has a starting point. None of this exists in the project today.

```
firestore/
├── products/{productId}
│     (same fields as the localStorage schema above)
│     + createdAt, updatedAt (server timestamps)
│
├── categories/{categoryId}
├── collections/{collectionId}
│
├── orders/{orderId}
│     (same fields as above)
│     + userId: string | null   ← NEW: links to the Firebase Auth UID of the
│                                   customer who placed the order, if signed in
│                                   (solves the current email-matching workaround)
│
├── customers/{userId}            ← NEW: a real customer profile document,
│     { displayName, email, photoURL, phone, createdAt }   separate from orders,
│                                   created on first sign-in
│
├── addresses/{userId}/items/{addressId}   ← subcollection, replaces the current
│                                             localStorage-per-UID address book
│
└── settings/store                ← single document, replaces the Settings context
```

**Migration considerations for whoever implements this:**
- Existing `localStorage` data (in browsers that already have it) would need either a one-time import tool or would simply be left behind in favor of fresh Firestore data — decide intentionally, don't let it happen by accident.
- Security Rules would need to restrict writes on `products`/`categories`/`collections`/`settings` to the admin UID only, while allowing public reads of published products.
- `orders` reads should be restricted to the admin and to the order's own `userId` (once that field exists).
- The Context provider *interfaces* (`useProducts()`, `useOrders()`, etc.) were deliberately kept stable so this migration should mostly touch each provider's internals (swap `localStorage` reads/writes for Firestore `onSnapshot`/`setDoc`/etc.) without requiring changes to the ~50+ components that consume these hooks.
