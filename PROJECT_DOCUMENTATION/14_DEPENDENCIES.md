# 14 — Dependencies

Source: `package.json`.

## Production Dependencies

| Package | Version | Why It's Used |
|---|---|---|
| `react` | ^19.2.7 | The UI framework this entire app is built with. |
| `react-dom` | ^19.2.7 | Renders React components to the DOM (`main.jsx`'s `createRoot`). |
| `react-router-dom` | ^7.18.1 | All client-side routing — both the storefront route table (`routes/AppRoutes.jsx`) and the admin route table (`admin/AdminApp.jsx`), plus `<Link>`/`useNavigate`/`useParams`/`useSearchParams`/`useLocation` used throughout. |
| `@tailwindcss/vite` | ^4.3.2 | Tailwind v4's Vite plugin — compiles the utility classes used in every component's `className`. See `12_STYLING.md`. |
| `tailwindcss` | ^4.3.2 | The Tailwind engine itself (peer of the Vite plugin above). |
| `framer-motion` | ^12.42.2 | The primary animation library — powers nearly every transition, hover effect, modal/drawer open-close, and scroll-reveal in the app. See `11_ANIMATIONS.md`. |
| `lenis` | ^1.3.25 | Smooth-scroll physics for the storefront (`hooks/useLenis.js`). |
| `swiper` | ^14.0.5 | Touch-friendly carousels: Home's Trending Collections and Testimonials, Product Details' recommendation rails, the fullscreen image gallery lightbox. |
| `react-icons` | ^5.7.0 | Every icon in the app. Mostly the `hi2` (Heroicons v2) set, plus `fa` (Font Awesome, used for WhatsApp/Instagram/Facebook/Pinterest brand icons) and `fc` (Flat Color, used for the Google "G" logo on the sign-in button). |
| `react-intersection-observer` | ^10.1.0 | Detects when elements scroll into view — powers `Reveal`, `StaggerGroup`, and the Shop page's infinite-scroll trigger. |
| `firebase` | ^12.16.0 | Firebase Authentication (admin email/password + customer Google sign-in) is live; Firestore and Storage SDKs are initialized but not yet used for any data — see `10_FIREBASE.md`. |
| `gsap` | ^3.15.0 | **Installed but not imported or used anywhere in the codebase.** Dead dependency — see `17_CODE_QUALITY.md`. |

## Development Dependencies

| Package | Version | Why It's Used |
|---|---|---|
| `vite` | ^8.1.1 | The build tool / dev server for the entire project. |
| `@vitejs/plugin-react` | ^6.0.3 | Enables React JSX transformation and Fast Refresh in Vite. |
| `oxlint` | ^1.71.0 | Fast Rust-based linter, run via `npm run lint`. Config: `.oxlintrc.json`. |
| `@types/react` / `@types/react-dom` | ^19.2.17 / ^19.2.3 | TypeScript type definitions for editor autocomplete/IntelliSense — this is a plain `.jsx` project (no `.tsx`, no TypeScript compilation), so these only assist tooling, not the build. |

## What's Notably *Not* Installed

- **No state management library** (Redux, Zustand, Jotai, Recoil) — see `08_STATE_MANAGEMENT.md` for why plain Context is sufficient here.
- **No data-fetching library** (React Query, SWR, Apollo) — there's no real API to fetch from yet (see `09_API.md`).
- **No form library** (React Hook Form, Formik) — every form (checkout, product form, address modal, login) is hand-rolled `useState` + manual validation.
- **No component library** (MUI, Chakra, shadcn/ui) — every UI element is custom-built with Tailwind utilities.
- **No testing framework** (Vitest, Jest, React Testing Library, Playwright as a project dependency) — there are currently no automated tests in this repository (verification during development has been done via manual browser testing, not a committed test suite).
- **No TypeScript** — the entire codebase is `.jsx`/`.js`.
- **No Three.js** — despite being mentioned in early project planning, it was never installed or used.
- **No charting library** (Recharts, Chart.js, visx) — the admin dashboard's bar charts are hand-built with `div`s and Framer Motion (`admin/components/SimpleBarChart.jsx`), not a charting dependency.
