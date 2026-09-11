# Khayaal Jewels — Frontend

React (Vite) storefront + admin dashboard for Khayaal Jewels, a premium imitation jewellery
e-commerce site. This repository is the **frontend only** — it deploys independently to Vercel
and talks to a separate backend repository over HTTP.

> Looking for the backend? It lives in its own repository (Express + PostgreSQL), deployed
> separately. In production, Vercel proxies browser API requests through the
> storefront's own `/api` origin so the customer session cookie stays first-party.

## Tech Stack

- React 19 + Vite
- Tailwind CSS v4
- React Router DOM
- Framer Motion / GSAP (animations)
- Firebase (Auth + Firestore/Storage SDK — used only by the `/admin` dashboard's own login)

## What lives here vs. the backend

Most of this app is self-contained and needs **no backend at all**:

- Product/category/collection catalog, cart, wishlist, compare — all `localStorage`-backed
  (see `src/context/`), seeded from `src/data/*.js`.
- `/admin` dashboard auth — Firebase email/password, independent of the backend repo.

Only these features call the separate backend (via `src/utils/apiClient.js`). In production,
the client uses relative `/api` URLs, which Vercel rewrites to the backend; in local development
it uses `VITE_API_URL`:

- Customer-facing Google sign-in (`src/context/CustomerAuthContext.jsx`)
- Customer orders, addresses, profile (`/my-account/*`, `src/hooks/useMyOrders.js`,
  `src/hooks/useAddressBook.js`)
- Checkout order submission (`src/pages/Checkout/Checkout.jsx`)
- Admin product image uploads (`src/admin/components/ImageUploader.jsx`,
  `SingleImageUpload.jsx`, `src/admin/pages/media/MediaLibrary.jsx`)

If the backend is unreachable, everything above will show errors, but browsing the catalog,
cart, and wishlist keeps working.

## Getting Started

```bash
npm install
cp .env.example .env
npm run dev
```

## Environment Variables

See `.env.example` for the full list with explanations. Summary:

| Variable | Purpose |
|---|---|
| `VITE_FIREBASE_*` | Firebase web app config, used by `/admin` login |
| `VITE_ADMIN_EMAIL` | The only account allowed into `/admin` |
| `VITE_API_URL` | Local-development backend origin, normally `http://localhost:4000`. It is intentionally ignored by the production browser bundle. |

**Production:** do not configure a frontend API origin that points browsers directly at Render.
`vercel.json` proxies `/api/:path*` to the backend while preserving cookies and redirects. This
keeps `khayaal_token` first-party for `www.khayaalofficial.in`, including Safari and mobile Chrome.
Do not commit real values to `.env` — it's gitignored.

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Production build (outputs to `dist/`) |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run Oxlint |

## Deployment (Vercel)

1. Import this repository into Vercel.
2. Framework preset: **Vite**.
3. Set the environment variables listed above (all `VITE_*` ones) in the Vercel dashboard.
4. `vercel.json` rewrites `/api/*` to the Render backend before its final SPA rewrite to
   `index.html`. Keep that order: OAuth callbacks, cookie headers, and redirects must travel
   through `/api` on the storefront origin.

## Routes

Storefront: `/`, `/shop`, `/product/:slug`, `/cart`, `/wishlist`, `/checkout`, `/order-success`,
`/about`, `/contact`, `/faq`, `/track-order`, `/my-account` (+ `profile`, `orders`, `addresses`
sub-routes; `/profile` and `/orders` redirect here for backward compatibility).

Admin: `/admin/*` — see `src/admin/AdminApp.jsx`.

## Further Documentation

`PROJECT_DOCUMENTATION/` has an in-depth breakdown of the folder structure, component map,
pages, admin system, auth, state management, API usage, styling, and a running TODO list.
Note it predates this frontend/backend split, so treat anything it says about `server/`
living inside this repo as historical.
