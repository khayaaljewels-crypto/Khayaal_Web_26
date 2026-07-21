# 11 — Animations

## Important Correction First

The project's original tech-stack brief mentioned **GSAP** and **Three.js**. Here is the actual, verified state of the codebase:

- **GSAP** is listed in `package.json` (`"gsap": "^3.15.0"`) but is **never imported anywhere in `src/`**. It is a dead dependency — installed, unused. There are zero GSAP animations in this project.
- **Three.js** is not installed and not used anywhere. There is no 3D content in this project.

All animation is actually built with **Framer Motion** (primary), **Lenis** (smooth scrolling), **Swiper** (carousels), and a handful of hand-written **CSS keyframes** in `src/styles/theme.css`. This file documents what's actually there.

## Framer Motion — Reusable Animation Components

These live in `src/components/animations/` and are the building blocks nearly every page composes from:

| Component | File | What It Does |
|---|---|---|
| `Reveal` | `Reveal.jsx` | The single most-used animation primitive (17 usages). Wraps children in a `motion.div` that fades + slides in when scrolled into view, using `react-intersection-observer` to trigger `animate` once. Supports a `direction` prop (`up`/`down`/`left`/`right`/`none`), `delay`, `duration`, and a `distance` override. Can render as any element via the `as` prop. |
| `StaggerGroup` | `StaggerGroup.jsx` | Parent wrapper that staggers its children's entrance via Framer Motion's `staggerChildren` transition; exports a `staggerItem` variant object for children to use. Used in `FeaturedCategories` and `ShopByOccasion`. |
| `PageLoader` | `PageLoader.jsx` | The full-screen animated splash shown for ~1.9s on first app load: a radial gradient fade, the "Khayaal" script logo scaling/fading in with letter-spacing animation, and a gold progress line that draws left-to-right. Uses `AnimatePresence` to animate itself out. |
| `ScrollProgress` | `ScrollProgress.jsx` | A 2px-tall fixed bar at the very top of the viewport whose `scaleX` is driven by Framer Motion's `useScroll` + `useSpring`, representing overall page scroll progress. |
| `CustomCursor` | `CustomCursor.jsx` | Desktop-only (checks `matchMedia('(pointer: fine)')`) custom ring cursor that follows the mouse via spring-eased `useMotionValue`s, and scales up when hovering any `a`, `button`, or `[data-cursor-hover]` element. |
| `GoldParticles` | `GoldParticles.jsx` | Decorative floating gold dots layered behind the Hero content, animated via the CSS `float-particle` keyframe (see below), not Framer Motion. |

## Framer Motion — Used Directly In Page/Feature Components

Rather than a fixed list, Framer Motion's `motion.*` components and `AnimatePresence` are used ad hoc throughout the app for:
- **Modals/drawers**: `QuickViewModal`, `MobileFilterDrawer`, `AddressModal`, `MobileMenu`, `SearchOverlay`, `FullscreenGallery` — all slide/fade in and out with `AnimatePresence` handling exit animations.
- **Accordions**: `FilterSection` (Shop filters), `InfoTabs`'s FAQ accordion, `ReviewsSection`'s write-review form reveal — all animate `height`/`opacity` from 0 to `auto`.
- **Product card interactions**: hover image-swap opacity, wishlist heart icon scale-in on toggle, add-to-cart bar sliding up from the bottom edge on hover (`ProductCard.jsx`).
- **Micro-interactions**: `GoldButton`'s shine sweep and tap/hover scale, `BackToTop`/`WhatsAppButton` floating-button entrance, `MobileBottomNav`'s active-tab indicator using `layoutId` for a smooth sliding dot between tabs.
- **Checkout step transitions**: `Checkout.jsx` slides between the Customer Info and Order Review steps with `AnimatePresence mode="wait"`.
- **Order success screen**: `OrderSuccess.jsx` hand-animates an SVG checkmark by animating `pathLength` from 0 → 1 on both the circle and check strokes, sequenced with delays.
- **Admin dashboard**: `StatCard` fade/lift-in on mount and hover, `SimpleBarChart` bars animate their `width` in from 0.

## Lenis — Smooth Scrolling

`src/hooks/useLenis.js` initializes a Lenis instance once (storefront only, called from `StorefrontShell` in `App.jsx`) and drives it via `requestAnimationFrame`. This replaces native scroll physics site-wide with Lenis's eased scrolling. Not used in the admin dashboard (native browser scroll there).

## Swiper — Carousels

Used (not Framer Motion) for horizontally-scrolling content that needs touch/drag/autoplay support:
- `TrendingCollections` (Home) — category carousel with `FreeMode` + `Autoplay` modules.
- `Testimonials` (Home) — testimonial carousel.
- `ProductRail` (Cart recommendations, Product Details' three recommendation rails) — responsive `slidesPerView` breakpoints.
- `FullscreenGallery` (Product Details lightbox) — swipeable full-screen image viewer with the `Keyboard` module for arrow-key navigation.

## Hand-Written CSS Keyframes (`src/styles/theme.css`)

| Keyframe | Used By | Effect |
|---|---|---|
| `shimmer` | `ProductCard`'s price text | A light sweep across the price on hover (`group-hover:animate-[shimmer_1.2s_ease]`), giving a subtle "premium" shine effect. |
| `float-particle` | `GoldParticles` | Slow drifting up/down + opacity pulse for the hero's decorative dots. |
| `marquee` | **Not currently referenced anywhere in `src/`** | Defined for a continuous horizontal scroll loop but dead CSS today — see `17_CODE_QUALITY.md`. |

## Other Motion-Adjacent Details

- **Custom range slider thumb styling** (`.range-thumb::-webkit-slider-thumb` etc. in `theme.css`) — not an animation, but styles the native `<input type="range">` thumbs used by `PriceRangeSlider` to look like a custom gold-dot slider.
- **`react-intersection-observer`** is a separate package from Framer Motion, used specifically to detect when an element enters the viewport (powers `Reveal`, `StaggerGroup`, and the Shop page's infinite-scroll sentinel in `LoadMoreControl.jsx`).

## File Locations Quick Reference

- Reusable animation components: `src/components/animations/*.jsx`
- Smooth scroll hook: `src/hooks/useLenis.js`
- Keyframes + custom animation-adjacent CSS: `src/styles/theme.css`
- Everything else: inline `motion.*` usage inside the relevant feature component (no central "animations" registry beyond the `components/animations/` folder — most animation is co-located with the component it belongs to, which is the intended pattern for this codebase).
