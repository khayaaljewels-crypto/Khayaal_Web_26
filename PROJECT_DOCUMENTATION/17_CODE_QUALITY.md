# 17 — Code Quality

This audit was produced by grepping actual import/usage across the codebase, not by inspection alone — findings below are verified, not guessed.

## Unused Dependencies

| Package | Status |
|---|---|
| `gsap` | Installed (`package.json`), **zero imports anywhere in `src/`**. Either remove it (`npm uninstall gsap`) or start actually using it — right now it's dead weight in `node_modules` with no build-size impact (it's never bundled since it's never imported) but it's misleading in the dependency list. |

## Unused Components

| Component | File | Status |
|---|---|---|
| `MagneticButton` | `src/components/buttons/MagneticButton.jsx` | Built (cursor-follow magnetic hover effect) but **never imported anywhere**. Either wire it into a CTA button somewhere (it was likely intended for the Hero or a similar high-emphasis button) or delete it. |

## Unused/Under-Consumed State

| Context | File | Issue |
|---|---|---|
| `UIContext` | `src/context/UIContext.jsx` | Provided in `App.jsx` (`<UIProvider>`) but **`useUI()` is never called anywhere** — nothing reads `isMenuOpen`/`isSearchOpen`/`isCartOpen`/`isLoading` from it. Every component that needs similar open/close state (`Navbar`'s mobile menu, search overlay, etc.) manages its own local `useState` instead. This context is currently pure dead weight — either start routing that state through it for real cross-component coordination, or remove the provider. |
| `CompareContext` | `src/context/CompareContext.jsx` | **Written to** (toggle icons in `ProductCard` and `PurchasePanel` both call `toggleCompare`), but **nothing reads the resulting list** — there's no "Compare Products" page/drawer that displays the up-to-4 selected items. The affordance is visible and functional (you can click the icon, it highlights) but leads nowhere. This is a genuine half-built feature, not dead code to delete — see `18_TODO.md`. |
| `WishlistContext` | `src/context/WishlistContext.jsx` | Fully functional and actively used (heart icons, badge counts) — but the dedicated `/wishlist` **page** that should list these items is still `PlaceholderPage`. Same pattern as Compare: working state, missing UI to view it. |

## Dead CSS

| Item | File | Status |
|---|---|---|
| `marquee` keyframe | `src/styles/theme.css` | Defined, never referenced by any `animate-marquee`/inline style anywhere in `src/`. |

## Duplicate / Repeated Code Patterns

1. **Hand-rolled radio button markup repeated 3× in one file.** `src/components/shop/FilterPanelContent.jsx` implements the Availability, Rating, and Discount filter groups as three separate, nearly-identical blocks of custom radio-button JSX (a styled circle + `<input type="radio" className="sr-only">`). The checkbox equivalent (`FilterSection`/category/material/stone/color/occasion) was correctly extracted into a shared `FilterCheckbox` component, but the equivalent `RadioOption` extraction was never done for these three groups. **Recommended fix**: extract a `FilterRadio` component mirroring `FilterCheckbox`, reducing ~90 lines of near-duplicate JSX to ~25.

2. **`getItemPrice` variant-price-lookup logic** appears conceptually in three places that all need "resolve a cart/order line item's actual unit price accounting for its variant": `CartContext.getItemPrice` (the canonical exported version), `OrdersContext.createOrder` (imports and reuses it correctly), and originally a near-duplicate had to be fixed in `buildWhatsAppOrderMessage.js` during development (now correctly consumes the *already-resolved* `lineTotal` stored on the order record instead of re-deriving it — this one is **not** current duplication, just worth knowing the historical bug so it isn't reintroduced if this code is refactored).

3. **Admin CRUD pages follow a consistent, repeated shape** (search state + filtered `useMemo` + table + row actions) across `ProductList`, `OrderList`, `CustomerList` — this is *reasonable* repetition (each has different columns/actions) rather than harmful duplication, but a shared `<DataTable>` component could reduce boilerplate if a 4th/5th admin list page is added later.

## Placeholder Pages Masquerading as "Done" Routes

Six routes exist and are reachable, but render only `PlaceholderPage` with no real feature behind them: `/wishlist`, `/about`, `/contact`, `/faq`, `/track-order`, and the `*` 404 (the last one is fine by design). See `18_TODO.md` for the full list — flagged here specifically because a route existing can create a false impression of completeness during a quick click-through of the site.

## Architectural Observations (Not Bugs, Worth Knowing)

- **No automated tests exist.** All verification during development has been manual, browser-based testing. Any future refactor carries more risk than it would with a test suite in place.
- **`localStorage` as the only persistence layer** means the entire admin dashboard's data (products, orders, customers, settings) is scoped to one browser on one device. This isn't a "bug" — it was an explicit, documented phased decision — but it's the single biggest architectural limitation to keep in mind before treating this as production-ready for a real multi-person operation. See `10_FIREBASE.md` / `16_DATABASE_STRUCTURE.md`.
- **Orders aren't linked to product records by reference** — each order line item stores a *snapshot* (`name`, `image`, `price` at time of purchase), not a live reference to the product. This is actually the *correct* design for order history (so editing a product's price later doesn't rewrite history), just worth knowing it's intentional, not an oversight.
- **No error boundaries.** If any component throws during render, React will unmount the whole tree with no graceful fallback UI (beyond whatever the browser's default error overlay shows in dev). Adding a top-level `<ErrorBoundary>` around `AppRoutes`/`AdminApp` would improve resilience.
- **No loading/error states for Firebase operations beyond what's built** — e.g., `signInWithPopup` failures other than "popup closed" are collapsed into one generic "Could not sign in" message, which is fine for now but will want more granular handling as real usage grows.

## Naming/Consistency

No significant naming inconsistencies were found — component names, file names, and hook names follow a consistent convention throughout (`PascalCase.jsx` for components, `useCamelCase.js` for hooks, `camelCase.js` for plain utility modules). Import aliasing (`@/` → `src/`) is used consistently everywhere via the Vite/`vite.config.js` alias — no relative `../../../` import chains were found.
