# 13 — Edit Guide

This is the practical "where do I click/type to change X" reference. For each area of the site, this lists **exactly which file(s)** to open, and whether the change is best made in code or through the Admin Dashboard.

---

## Home Hero

**Where to edit:** `src/components/sections/Hero.jsx`

The headline, subheadline, eyebrow text, CTA button labels/links, and background image are all hardcoded JSX/props in this one file. The floating gold particle effect is a separate component (`src/components/animations/GoldParticles.jsx`) rendered inside `Hero.jsx` — tweak particle count/speed there.

*Not currently admin-editable* — see `18_TODO.md` (homepage CMS is a planned, unbuilt feature).

---

## Navbar

**Where to edit:**
- Nav links (labels, hrefs, which link triggers the mega menu): `src/components/layout/navbar/navLinks.js`
- Layout/behavior (sticky, transparent-on-hero, search/cart/wishlist icons): `src/components/layout/navbar/Navbar.jsx`
- Mega menu content: pulls live from `CategoriesContext` (edit categories via `/admin/categories`, not code) — the mega menu's *layout* is `src/components/layout/navbar/MegaMenu.jsx`
- Mobile fullscreen menu: `src/components/layout/navbar/MobileMenu.jsx`
- Search overlay (trending searches list, popular categories): `src/components/layout/navbar/SearchOverlay.jsx` (the `TRENDING` array near the top is hardcoded)

---

## Footer

**Where to edit:** `src/components/layout/footer/Footer.jsx`

Link columns (`SHOP_LINKS`, `HELP_LINKS`, `COMPANY_LINKS`) and payment icon labels (`PAYMENT_ICONS`) are hardcoded arrays at the top of the file. Social media icon **links** pull live from `SettingsContext` (edit via `/admin/settings`) — but the newsletter signup form, tagline copy, and copyright text are hardcoded in this file.

---

## Collections

**Where to edit:** `/admin/collections` (Admin Dashboard) for name/visibility.

Collections are simple `{ id, name, hidden }` records managed entirely through the admin's Collection Manager — no code editing needed for day-to-day changes. The starter/seed list (used only the very first time the app runs, before any admin edits exist) is in `src/data/productSeed.js` (`COLLECTION_SEED` constant) — editing that file only affects a *fresh* browser that has never loaded the app before.

---

## Products

**Where to edit:** `/admin/products` → Add Product / Edit Product (Admin Dashboard).

Every product field (name, SKU, price, MRP, stock, material, stone, color, images, description, flags like Featured/Best Seller) is editable through the admin form — this is the primary intended workflow, not code.

The **initial demo catalogue** (54 sample products) is generated in `src/data/productSeed.js`. This only matters if you want to change what a *brand-new browser* sees before any admin edits happen — once the admin has added/edited real products, this seed file has no further effect on that browser (its `localStorage` has already diverged from the seed).

---

## Product Details Page

**Where to edit (layout/behavior, not content):**
- Overall page composition: `src/pages/Product/ProductDetail.jsx`
- Image gallery + zoom + fullscreen lightbox: `src/components/product/ImageGallery.jsx`, `FullscreenGallery.jsx`
- Price/stock/wishlist/compare/quantity/pincode panel: `src/components/product/PurchasePanel.jsx`, `PincodeChecker.jsx`
- Color/size selectors: `src/components/product/VariantSelector.jsx`
- Description/Specs/Care/Shipping/Returns/Reviews/FAQ tabs: `src/components/product/InfoTabs.jsx` (the FAQ questions themselves are a hardcoded `FAQS` array in this file)
- Reviews (rating summary, star distribution, write-a-review form): `src/components/product/ReviewsSection.jsx`. Note: reviews shown here are **generated on the fly** from `src/data/reviews.js` (deterministic fake data keyed off the product ID), not stored anywhere — a submitted "write a review" is only kept in that page's local component state and disappears on refresh.
- "Complete the Look" / "Related Products" / "Recently Viewed" rails: `src/components/product/ProductRail.jsx` (shared component; the *data* each rail shows comes from `ProductsContext`'s `getCompleteTheLook`/`getRelatedProducts` or the `useRecentlyViewed` hook)

**Content** (the actual product's description, specs, price, images) is edited via `/admin/products/:id/edit`, not these files.

---

## Order Form (Checkout)

**Where to edit:**
- Step 1 (customer/address form fields, validation rules): `src/components/checkout/CustomerInfoForm.jsx`
- Step 2 (review screen, confirm button): `src/components/checkout/OrderReview.jsx`
- Step indicator: `src/components/checkout/CheckoutSteps.jsx`
- Overall flow/state: `src/pages/Checkout/Checkout.jsx`
- Thank-you page after order: `src/pages/OrderSuccess/OrderSuccess.jsx`
- Coupon codes and amounts: `src/context/CartContext.jsx` (the `COUPONS` object — `KHAYAAL10`, `WELCOME200`)
- Free shipping threshold / flat shipping fee: `src/context/CartContext.jsx` (`FREE_SHIPPING_THRESHOLD`, `SHIPPING_FEE` constants)

---

## WhatsApp

**Where to edit:**
- **The WhatsApp number itself**: `/admin/settings` (Admin Dashboard) — do **not** hardcode it in code; `SettingsContext` is the single source of truth, read by both the floating chat button and the checkout order message.
- Floating WhatsApp button's pre-filled "just chatting" message and position: `src/components/ui/WhatsAppButton.jsx`
- The **order confirmation message format** sent at checkout (what text/fields appear in the WhatsApp message): `src/utils/buildWhatsAppOrderMessage.js`
- Where the checkout flow triggers the WhatsApp handoff: `src/pages/Checkout/Checkout.jsx` (`handleConfirm`)
- Admin's "Message Customer" button on an order: `src/admin/pages/orders/OrderDetail.jsx` (reuses `buildWhatsAppOrderMessage.js`)

---

## Admin Dashboard

**Where to edit:**
- Stat cards / charts / quick actions on the dashboard home: `src/admin/pages/Dashboard.jsx`
- Sidebar nav items: `src/admin/components/AdminSidebar.jsx` (`NAV_ITEMS` array)
- Topbar (global search, view-site/logout buttons): `src/admin/components/AdminTopbar.jsx`
- Any admin page's form fields/table columns: the relevant file under `src/admin/pages/**`
- Which email is allowed into `/admin`: the `VITE_ADMIN_EMAIL` environment variable (see Environment Variables below) — **never hardcode an email/password in a component file**.

---

## Authentication

**Where to edit:**
- Admin login logic (email/password check, access-denied behavior, password change): `src/admin/context/AdminAuthContext.jsx`
- Admin login page UI: `src/admin/pages/Login.jsx`
- Customer Google sign-in logic: `src/context/CustomerAuthContext.jsx`
- Customer sign-in prompt UI (shown on Profile/Orders when signed out): `src/components/account/GoogleSignInPrompt.jsx`
- Firebase project connection: `src/firebase/config.js` + the `.env` file (see below)
- **The actual admin password**: set/changed only via the Firebase Console (Authentication → Users) initially, and via `/admin/settings` → Change Password thereafter. It is never stored in any file in this repository.

---

## Animations

**Where to edit:**
- Reusable scroll-reveal/stagger effects: `src/components/animations/Reveal.jsx`, `StaggerGroup.jsx`
- Page loader splash: `src/components/animations/PageLoader.jsx`
- Smooth-scroll feel/speed: `src/hooks/useLenis.js` (Lenis `duration`/`easing` options)
- Custom cursor behavior: `src/components/animations/CustomCursor.jsx`
- Any specific component's hover/entrance animation: edit the `motion.*` props directly inside that component's file (animations are co-located with the component, not centralized — see `11_ANIMATIONS.md`)
- CSS keyframes (shimmer, floating particles): `src/styles/theme.css`

---

## Colors

**Where to edit:** `src/styles/theme.css` — the `@theme` block's `--color-*` variables. Changing `--color-gold` here, for example, retints every `bg-gold`/`text-gold`/`border-gold` usage across the entire site (storefront **and** admin) in one place, since there's no separate config file.

---

## Fonts

**Where to edit:**
1. To change *which* fonts load: `index.html`'s Google Fonts `<link>` tag.
2. To change *which font each role uses*: `src/styles/theme.css`'s `--font-heading` / `--font-body` / `--font-accent` variables.

---

## Images

**Where to edit:**
- Product images: `/admin/products/:id/edit` → Images section (paste an image URL; there is no file upload yet — see `18_TODO.md`).
- Category images: `/admin/categories` → edit a category.
- Home page section images (Hero background, Instagram gallery, testimonial avatars): hardcoded in their respective component/data files — `src/components/sections/Hero.jsx`, `src/data/instagram.js`, `src/data/testimonials.js`.
- Favicon: `public/favicon.svg`.

All current seed/placeholder images are Unsplash URLs — see `09_API.md`.

---

## Logo

**Where to edit:** The "Khayaal" wordmark is **text**, not an image file — it's rendered as `<span className="font-script">Khayaal</span>` (Great Vibes font) wherever it appears: `Navbar.jsx`, `Footer.jsx`, `MobileMenu.jsx`, `PageLoader.jsx`, `admin/pages/Login.jsx`, `admin/components/AdminSidebar.jsx`. To change the wordmark, either edit the text in each of those files, or replace the pattern with an `<img>` tag pointing at a real logo file placed in `public/`.

Favicon (browser tab icon): `public/favicon.svg`.

---

## SEO

**Where to edit:** `index.html` — `<title>`, `<meta name="description">`, `<meta name="theme-color">`.

**Not yet implemented**: per-page `<title>`/meta tags (every route currently shares the one static `index.html` title/description — there is no `react-helmet` or equivalent), structured data, Open Graph tags, sitemap, or an admin-editable SEO settings screen. See `18_TODO.md`.

---

## Environment Variables

**Where to edit:** `.env` at the project root (create it by copying `.env.example` if it doesn't exist — it's gitignored so it won't already be tracked).

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_ADMIN_EMAIL=Khayaaljewels@gmail.com
```

After editing `.env`, you must **restart the dev server** (`npm run dev`) — Vite does not hot-reload environment variable changes. These values are read in `src/firebase/config.js`.
