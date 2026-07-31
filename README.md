# Khayaal Jewels — Frontend

React (Vite) storefront + admin dashboard for Khayaal Jewels, a premium imitation jewellery
e-commerce site. This repository is the **frontend only** — it deploys independently to Vercel
and talks to a separate backend repository over HTTP.

> Looking for the backend? It lives in its own repository (Express + PostgreSQL), deployed
> separately. See `VITE_API_URL` below for how the two are connected.

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

Only these features call the separate backend (via `src/utils/apiClient.js`, base URL from
`VITE_API_URL`):

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
| `VITE_API_URL` | Base URL of the backend repo — `http://localhost:4000` locally, your backend's deployed URL in production |

**Production:** set `VITE_API_URL` in Vercel → Project Settings → Environment Variables to the
backend's deployed URL (e.g. `https://your-backend-host.example.com`). Do not commit real
values to `.env` — it's gitignored.

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
4. `vercel.json` already rewrites all routes to `index.html` (this is a client-rendered SPA —
   both the storefront and `/admin` are handled by React Router, not server routing).

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
