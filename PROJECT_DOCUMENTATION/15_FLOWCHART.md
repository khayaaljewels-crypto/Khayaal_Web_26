# 15 — Flowcharts

Diagrams use Mermaid syntax (renders natively in GitHub, VS Code with a Mermaid extension, and most modern markdown viewers).

## Customer Flow

```mermaid
flowchart TD
    A[Land on Home /] --> B[Browse: Shop / Category links / Search]
    B --> C[Shop page: filter, sort, search]
    C --> D[Product Details page]
    B --> D
    D --> E{Add to Cart or Buy Now?}
    E -->|Add to Cart| F[Cart page]
    E -->|Buy Now| G[Adds to cart, skips to Checkout]
    F --> H[Proceed to Checkout]
    G --> I[Checkout Step 1: Customer Info]
    H --> I
    I --> J[Checkout Step 2: Order Review]
    J -->|Edit| I
    J -->|Confirm Order on WhatsApp| K[WhatsApp opens with formatted order message]
    K --> L[Order Success / Thank You page]
    L --> M[Continue Shopping] --> B

    D --> N{Wishlist / Compare}
    N --> N1[Wishlist icon toggles WishlistContext]
    N --> N2[Compare icon toggles CompareContext]

    B --> O[Sign in with Google]
    O --> P[/profile: profile, saved addresses, recent orders/]
    O --> Q[/orders: full order history, matched by email/]
```

## Admin Flow

```mermaid
flowchart TD
    A[Visit /admin] --> B{Signed in as admin?}
    B -->|No| C[/admin/login]
    C --> D[Enter email + password]
    D --> E{Firebase verifies}
    E -->|Wrong credentials| C
    E -->|Correct, but not the admin email| F[Signed out immediately + error shown]
    E -->|Correct + is admin email| G[/admin Dashboard]
    B -->|Yes| G

    G --> H[Products: list, add, edit, hide, publish, duplicate, delete, bulk actions]
    G --> I[Categories: CRUD + visibility]
    G --> J[Collections: CRUD + visibility]
    G --> K[Orders: list, filter by status]
    K --> L[Order Detail: change status, add internal note, message customer on WhatsApp, print]
    G --> M[Customers: derived from orders, view detail, export CSV]
    G --> N[Settings: store info, WhatsApp number, socials, change admin password]

    H --> O[Changes saved to ProductsContext / localStorage]
    O --> P[Instantly visible on live storefront]
```

## Authentication Flow

```mermaid
flowchart TD
    subgraph Admin Auth
        A1[Admin enters email + password] --> A2[signInWithEmailAndPassword via Firebase]
        A2 -->|fail| A3[Mapped error message shown]
        A2 -->|success| A4{email === VITE_ADMIN_EMAIL?}
        A4 -->|No| A5[signOut immediately + Access Denied]
        A4 -->|Yes| A6[isAuthenticated = true → /admin]
        A6 --> A7[onAuthStateChanged keeps session live]
        A7 --> A8[Logout → signOut]
    end

    subgraph Customer Auth
        B1[Customer clicks Continue with Google] --> B2[signInWithPopup GoogleAuthProvider]
        B2 -->|popup closed| B3[Silently ignored, no error shown]
        B2 -->|success| B4[user populated: name, email, photo]
        B4 --> B5[Profile / Orders pages render real content]
        B5 --> B6[Logout → signOut]
    end

    C1[isFirebaseConfigured check] -.gates both flows.-> A1
    C1 -.gates both flows.-> B1
```

## Order Flow

```mermaid
flowchart TD
    A[Customer confirms order in Checkout Step 2] --> B[OrdersContext.createOrder]
    B --> C[Generate sequential ID: KH0001, KH0002, ...]
    C --> D[Snapshot: customer info, line items with price/variant, subtotal, discount, shipping, grand total]
    D --> E[Prepend to orders list → saved to localStorage]
    E --> F[buildWhatsAppOrderMessage formats the order as text]
    F --> G[window.open wa.me deep link with the message]
    G --> H[Navigate to /order-success with the order in router state]

    E --> I[Order now visible in /admin/orders]
    I --> J[Admin changes status: New → Confirmed → Packing → Ready to Ship → Shipped → Delivered]
    I --> K[Admin adds internal notes]
    I --> L[Admin re-sends WhatsApp message anytime from Order Detail]

    E --> M[Order also appears in OrdersContext.customers grouped by phone]
    M --> N[/admin/customers shows this as a customer/]

    E --> O{Customer signed in with Google using same email?}
    O -->|Yes| P[Order appears in their /orders and /profile]
    O -->|No / different email| Q[Order not linked to any account — visible to admin only]
```

## Product Flow

```mermaid
flowchart TD
    A[App first loads in a browser] --> B{localStorage has khayaal_products_v1?}
    B -->|No, fresh browser| C[Seed from data/productSeed.js — 54 demo products]
    B -->|Yes| D[Load existing products from localStorage]
    C --> E[ProductsContext holds the live product list]
    D --> E

    E --> F[Storefront reads: products filtered to isPublished only]
    F --> G[Home page: bestSellers / newArrivals]
    F --> H[Shop page: full catalogue + filters]
    F --> I[Product Details: getBySlug, getRelatedProducts, getCompleteTheLook]

    E --> J[Admin reads: allProducts, including hidden/unpublished]
    J --> K[/admin/products list]
    K --> L{Admin action}
    L -->|Add| M[addProduct → new record, id generated]
    L -->|Edit| N[updateProduct → patches record]
    L -->|Delete| O[deleteProduct / bulk deleteProducts]
    L -->|Duplicate| P[duplicateProduct → copy, unpublished by default]
    L -->|Toggle publish/hide| Q[bulkUpdate isPublished]
    M --> R[Write back to localStorage]
    N --> R
    O --> R
    P --> R
    Q --> R
    R --> E
```
