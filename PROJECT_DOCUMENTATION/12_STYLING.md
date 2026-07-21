# 12 — Styling

## Tailwind CSS v4 — CSS-First Configuration

This project uses **Tailwind CSS v4**, which introduces a CSS-native configuration approach — there is **no `tailwind.config.js` file in this project**. Instead, everything is declared inside `src/styles/theme.css` using the `@theme` at-rule, and Tailwind is wired into the build via the `@tailwindcss/vite` plugin in `vite.config.js` (not the older PostCSS-plugin approach).

```js
// vite.config.js
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
})
```

## The Single Source of Truth: `src/styles/theme.css`

Loaded via `src/index.css`, which is just:
```css
@import "./styles/theme.css";
```
`main.jsx` imports `./index.css` once, globally.

### Design Tokens (`@theme` block)

```css
@theme {
  --color-bg: #faf8f5;
  --color-white: #ffffff;
  --color-gold: #b8864a;
  --color-gold-hover: #c69c6d;
  --color-brown: #3e2c23;
  --color-beige: #efe7dd;
  --color-text: #2e2e2e;
  --color-border: #ece7e2;

  --font-heading: "Playfair Display", ui-serif, Georgia, serif;
  --font-body: "Poppins", ui-sans-serif, system-ui, sans-serif;
  --font-accent: "Great Vibes", cursive;

  --ease-luxury: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-silk: cubic-bezier(0.65, 0, 0.35, 1);

  --shadow-gold-glow: 0 8px 40px -8px rgba(184, 134, 74, 0.35);
  --shadow-soft: 0 20px 60px -15px rgba(62, 44, 35, 0.15);
  --shadow-card: 0 4px 24px -4px rgba(62, 44, 35, 0.08);

  --breakpoint-xs: 375px;
}
```

Tailwind v4 automatically generates utility classes from every `--color-*`/`--font-*`/`--shadow-*` token here — e.g. `--color-gold` gives you `bg-gold`, `text-gold`, `border-gold`, `ring-gold`, etc. for free, with no manual `tailwind.config.js` `extend` block needed. This is why you'll see classes like `bg-gold`, `text-brown`, `shadow-soft`, `font-heading` used directly throughout every component — they map 1:1 to the tokens above.

### Color Palette Reference

| Token | Hex | Utility Classes | Used For |
|---|---|---|---|
| `--color-bg` | `#FAF8F5` | `bg-bg` | Page background |
| `--color-white` | `#FFFFFF` | `bg-white`, `text-white` | Cards, navbar background |
| `--color-gold` | `#B8864A` | `bg-gold`, `text-gold`, `border-gold` | Primary accent — CTAs, prices, active states, icons |
| `--color-gold-hover` | `#C69C6D` | `bg-gold-hover`, `text-gold-hover` | Hover states for gold elements |
| `--color-brown` | `#3E2C23` | `bg-brown`, `text-brown` | Headings, dark surfaces (footer, buttons), admin sidebar |
| `--color-beige` | `#EFE7DD` | `bg-beige` | Secondary/tinted section backgrounds, skeleton loaders |
| `--color-text` | `#2E2E2E` | `text-text` | Body copy |
| `--color-border` | `#ECE7E2` | `border-border` | Hairline borders everywhere |

### Typography

| Token | Font | Utility | Used For |
|---|---|---|---|
| `--font-heading` | Playfair Display (serif) | `font-heading` | All headings, product names, prices |
| `--font-body` | Poppins (sans) | `font-body` (also the `<body>` default) | Body copy, UI labels |
| `--font-accent` | Great Vibes (script) | `font-script` (custom utility, see below) | The "Khayaal" wordmark/logo everywhere it appears |

Fonts are loaded from Google Fonts via a `<link>` tag in `index.html` (not self-hosted, not `@font-face` in CSS) — see `09_API.md` for the external-resource note.

### Custom Utility Classes (`@layer components`)

| Class | Definition | Purpose |
|---|---|---|
| `.container-luxury` | `mx-auto w-full max-w-[1440px] px-6 sm:px-8 lg:px-16` | The site's standard content-width wrapper, used on nearly every section instead of raw Tailwind container utilities |
| `.font-script` | `font-family: var(--font-accent)` | Shorthand for the Great Vibes logo font |
| `.text-gradient-gold` | Gold gradient text clip | Available but rarely used decorative text treatment |
| `.eyebrow` | Small uppercase gold label style (`text-xs sm:text-sm tracking-[0.35em] uppercase text-gold font-medium`) | The small label above nearly every section heading site-wide ("CURATED FOR YOU", "OVERVIEW", etc.) |
| `.divider-gold` | `h-px w-16 bg-gold` | Thin gold divider line |
| `.range-thumb::-webkit-slider-thumb` / `::-moz-range-thumb` / `::-webkit-slider-runnable-track` | Custom native `<input type="range">` thumb styling | Powers `PriceRangeSlider`'s gold dual-handle look |

### Global Base Styles (`@layer base`)
- `* { border-color: var(--color-border) }` — every element's default border color is the theme border color, so a bare `border` utility "just works" without needing `border-border` everywhere.
- Selection color (`::selection`) is gold background / white text.
- A custom slim gold scrollbar (`::-webkit-scrollbar*`).
- `h1`–`h6` default to `font-heading` with slight letter-spacing.

### Utilities Layer
- `.no-scrollbar` — hides scrollbars while keeping scroll functional (used on horizontally-scrolling filter/thumbnail strips on mobile).

## Admin Dashboard Styling

The admin dashboard **reuses the exact same theme tokens** (gold/brown/beige palette, same fonts) for brand consistency, but with a distinct layout language: a light gray-beige page background (`bg-[#F7F4F0]`, a one-off arbitrary value rather than a theme token), a dark brown sidebar, and dense data-table/form-heavy layouts rather than the storefront's spacious editorial sections. There is no separate "admin theme" file — it's all still Tailwind utilities against the same `theme.css` tokens, just composed differently per component.

## Dark Mode

`@custom-variant dark (&:where(.dark, .dark *));` is declared in `theme.css`, meaning Tailwind's `dark:` variant is available and configured — but **no component in the codebase currently applies a `.dark` class or uses any `dark:` utility**. Dark mode is wired up at the config level but not implemented in any UI.

## Responsive Approach

Standard Tailwind mobile-first breakpoints (`sm:`, `md:`, `lg:`, `xl:`) are used throughout, plus one custom breakpoint (`--breakpoint-xs: 375px`) for very small phones, though it's used sparingly. There is no separate mobile stylesheet or CSS-in-JS — every component handles its own responsive behavior inline via Tailwind's responsive utility prefixes.

## No CSS Modules, No Styled-Components, No Sass

All styling is Tailwind utility classes written directly in JSX `className` strings, plus the one hand-written CSS file (`theme.css`) for tokens/keyframes/the few custom component classes listed above. There is no other `.css`/`.scss`/`.module.css` file anywhere in `src/`.
