# 05 — Routes

## React Router Setup

The app uses **React Router DOM v7** with a single `<BrowserRouter>` at the very top of `App.jsx`. Routing is then split into **two independent route trees** that never render at the same time:

1. `src/routes/AppRoutes.jsx` — every public/storefront route.
2. `src/admin/AdminApp.jsx` — every `/admin/*` route.

`App.jsx`'s `Root()` component decides which tree to mount by checking `location.pathname.startsWith('/admin')` via `useLocation()`. This is a manual branch, not a nested `<Route path="/admin/*">` inside one shared `<Routes>` — the two trees are structurally independent so the admin dashboard never accidentally inherits storefront layout/providers, and vice versa.

Both route trees use **lazy loading** (`React.lazy` + `<Suspense>`) for every page component except the ones that must be available immediately (`Login` in the admin tree). This means each page's code is split into its own bundle chunk and only downloaded when the user navigates to it.

`src/routes/ScrollToTop.jsx` is mounted once in the storefront shell and resets `window.scrollTo(0, 0)` on every route change (a `useEffect` keyed on `location.pathname`).

## Storefront Routes (`AppRoutes.jsx`)

| Path | Page | Notes |
|---|---|---|
| `/` | Home | |
| `/shop` | Shop | Reads query params: `?filter=new`, `?filter=bestsellers`, `?category=<slug>`, `?occasion=<id>`, `?search=<text>` — all set by links elsewhere in the app (mega menu, footer, search overlay, "View All" links) |
| `/product/:slug` | ProductDetail | Redirects to `/shop` if the slug doesn't match any product |
| `/cart` | Cart | |
| `/wishlist` | Wishlist | Placeholder |
| `/checkout` | Checkout | Redirects to `/cart` if the cart is empty |
| `/order-success` | OrderSuccess | Redirects to `/` if visited without order data in router state |
| `/about` | About | Placeholder |
| `/contact` | Contact | Placeholder |
| `/faq` | FAQ | Placeholder |
| `/profile` | Profile | Shows a Google sign-in prompt if not authenticated |
| `/orders` | Orders | Shows a Google sign-in prompt if not authenticated |
| `/track-order` | TrackOrder | Placeholder |
| `*` | NotFound | Catch-all 404 |

## Admin Routes (`AdminApp.jsx`)

| Path | Page | Protected? |
|---|---|---|
| `/admin/login` | Login | Public (redirects to `/admin` if already signed in as the admin) |
| `/admin` | Dashboard | Protected |
| `/admin/products` | ProductList | Protected |
| `/admin/products/new` | ProductForm (create mode) | Protected |
| `/admin/products/:id/edit` | ProductForm (edit mode) | Protected |
| `/admin/categories` | CategoryManager | Protected |
| `/admin/collections` | CollectionManager | Protected |
| `/admin/orders` | OrderList | Protected (supports `?status=<Status>` query filter) |
| `/admin/orders/:id` | OrderDetail | Protected |
| `/admin/customers` | CustomerList | Protected |
| `/admin/customers/:phone` | CustomerDetail | Protected |
| `/admin/settings` | Settings | Protected |

"Protected" routes are wrapped by a shared `<Route element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>` parent route in `AdminApp.jsx`, so every child route under it automatically requires auth and renders inside the sidebar+topbar shell.

## Protected Route Logic (`admin/components/ProtectedRoute.jsx`)

```
checkingAuth === true        → render nothing (avoids a login-page flash while Firebase resolves the session)
isAccessDenied === true      → render an "Access Denied" screen (signed in, but not the admin email)
isAuthenticated === false    → <Navigate to="/admin/login" replace />
isAuthenticated === true     → render children (AdminLayout + the matched admin page)
```

This three-way branch (as opposed to a simple boolean) is deliberate: a customer who happens to sign into `/admin/login` with *some* Firebase account should see "Access Denied", not silently bounce to the login page again (which would look like a bug) or to the public homepage without explanation.

## Customer-Facing "Protection"

`/profile` and `/orders` are **not** route-guarded the way admin routes are — there's no redirect. Instead, each page checks `useCustomerAuth().user` internally and renders `GoogleSignInPrompt` in place of the real content when signed out. This is a softer pattern appropriate for a storefront (you can still see the page shell/branding) versus the admin dashboard's hard gate.

## Deep-Linking / Query Params Used Across the Site

The Shop page's filters can be pre-set via URL, which is how several other components link into it:

- Navbar's "New Arrivals" / "Best Sellers" links → `/shop?filter=new` / `/shop?filter=bestsellers`
- Mega menu / mobile menu / footer category links → `/shop?category=<category-slug>`
- Shop-by-Occasion section → `/shop?occasion=<occasion-id>`
- Search overlay submit → `/shop?search=<query>`

These are read once on mount by a `useEffect` in `Shop.jsx` that patches the filter state — see `08_STATE_MANAGEMENT.md` and `hooks/useProductFilters.js`.
