# 06 — Admin System

## Overview

The admin dashboard is a private CMS-style back office at `/admin`, built entirely as part of this same React app (no separate deployment, no backend server). It currently reads/writes to the same `localStorage`-backed Context providers the storefront uses, which is what makes every admin action **immediately visible on the live storefront** — there is no "publish" delay or sync step.

## Complete Admin Workflow

### 1. Sign In
Owner navigates to `/admin` → not authenticated → redirected to `/admin/login` → enters the admin email/password → Firebase verifies the credentials → the app checks the returned account's email against `VITE_ADMIN_EMAIL` → on match, redirected to `/admin` (Dashboard). See `07_AUTH_SYSTEM.md` for full detail.

### 2. Dashboard (`/admin`)
The landing page after login. Shows, all computed live from the current Context state (nothing pre-aggregated or cached):
- **Stat cards**: Total Products (all products including hidden ones), Categories, Collections, Total Orders, Total Customers, Low Stock count — each links to a pre-filtered view.
- **Secondary stat row**: Pending (status = "New"), Confirmed, Delivered, Cancelled order counts — each links to `/admin/orders?status=<Status>`.
- **Out-of-stock alert banner**: only shown if at least one product has zero stock.
- **Two charts** (`SimpleBarChart`, hand-built with Framer Motion, no charting library): Orders by Month (last 6 months) and Best Selling Products (aggregated from all order line items).
- **Recent Orders** and **Recent Customers** lists (latest 5 each), linking to their detail pages.
- **Quick actions**: Add Product, Add Category, View Orders, Analytics (scrolls to the charts section on the same page).

### 3. Product Management (`/admin/products`)
- **List view**: searchable (name/SKU), filterable by category, supports a `?stock=low` / `?stock=out` query filter (linked from the Dashboard), checkbox multi-select with bulk Publish/Hide/Delete, per-row actions (edit, toggle publish, duplicate, delete), 10-per-page pagination.
- **Add/Edit form** (`/admin/products/new`, `/admin/products/:id/edit` — same component): organized into sections — Basic Information (name, SKU, brand, category, collection, occasion, tags), Pricing & Inventory (selling price, MRP, internal cost price, stock quantity, delivery days, return window, COD toggle), Attributes (material, stone, color, weight, dimensions, package contents, warranty, country of origin), Description (short + full + care instructions), Visibility & Flags (Published/Featured/Trending/New Arrival/Best Seller/Coming Soon toggles), and Images (ordered list of image URLs — add, reorder up/down, remove; first image is primary).
- Deleting or duplicating a product is instant (no confirmation dialog beyond a native `window.confirm`).
- Stock status (`In Stock` / `Low Stock` / `Out of Stock`) and discount percentage are **derived automatically** from `stockQty` and `price`/`oldPrice` — the admin never sets "in stock: yes/no" directly, only the quantity.

### 4. Category & Collection Management (`/admin/categories`, `/admin/collections`)
- Categories: card grid, each with an image, product count (computed live by counting products with that category slug), visibility toggle, edit (opens a modal), delete.
- Collections: simpler — a name-only list (add via inline text input + button), same visibility toggle and delete pattern, table layout instead of cards.
- Both are used as `<select>` options inside the Product form.

### 5. Order Management (`/admin/orders`, `/admin/orders/:id`)
- **List**: search by order ID / customer name / phone, filter by status via `<select>` (also settable via URL from the Dashboard's clickable stat cards).
- **Detail page**: full item breakdown with images/quantities/line totals, subtotal/discount/shipping/grand total, customer notes from checkout, a **status dropdown** that updates instantly (`New → Confirmed → Packing → Ready to Ship → Shipped → Delivered → Cancelled → Returned`), an **internal notes** thread (admin-only, timestamped, never shown to the customer), a **"Message Customer"** button that reopens the same formatted WhatsApp message used at checkout, a **Print** button (`window.print()`, with `print:hidden` classes hiding admin-only chrome), a **copy address** button, and a delete-order action.

### 6. Customer Management (`/admin/customers`, `/admin/customers/:phone`)
There is **no separate customer database** — the "customers" list is computed by grouping all orders by phone number (`OrdersContext`'s `customers` derived value). Each customer record shows name/phone/email/city/state (from their most recent order), total order count, and total amount spent. The list view supports search and CSV export. The detail view adds a "Message on WhatsApp" button and the full order list for that phone number.

**Consequence**: a person only becomes a "customer" in the admin's eyes after placing at least one order. There's no signup/registration flow feeding this list (Google Sign-In accounts and this "customer" list are currently two separate, unlinked concepts — see `18_TODO.md`).

### 7. Homepage Management
**Not implemented.** The original spec asked for a homepage CMS (editable hero banner, featured products, promotional banners, footer content, etc.) — this was explicitly deferred to a later phase when the admin scope was scaled down. Today, all Home page content (hero copy, testimonials, Instagram gallery, etc.) is hardcoded in the relevant `components/sections/*.jsx` files and can only be changed by editing code. Featured Products *is* partially achievable today via each product's "Featured"/"Trending" flags, but there is no dedicated "choose what appears on the homepage" screen.

### 8. Settings (`/admin/settings`)
Two independent forms on one page:
- **Store Information**: store name, contact number, WhatsApp number, email, address, Instagram/Facebook/Pinterest URLs. Saved to `SettingsContext` (`localStorage`), read live by the storefront's `WhatsAppButton`, `Footer`, and the checkout WhatsApp message builder.
- **Change Admin Password**: requires the current password (re-authenticates with Firebase before allowing the change), enforces a minimum 6-character new password.

## What the Admin Cannot Do Yet
- Upload image files directly (products/categories only accept pasted image *URLs* — there is no media library or file upload, see `18_TODO.md`).
- Edit homepage content, SEO/meta tags, or run analytics.
- Manage a real customer roster independent of orders.
- See orders/products from a *different* browser or device — everything is local to whichever browser is signed in as admin (until the planned Firestore migration).
