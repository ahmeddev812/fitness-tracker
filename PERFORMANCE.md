# Performance Report — PULSE

Date: 2026-09-23  
Stack: Next.js 16.3.5 (Turbopack) · React 19.2.8 · framer-motion 13 · recharts 3.10 · Tailwind v4  
Constraint: no visual/functional changes, no new packages, preserve animations, respect `prefers-reduced-motion`.

## Verification

| Check | Result |
|---|---|
| `npm run build` | ✅ Pass — 16/16 static routes |
| `npm run lint` | ✅ Pass — 0 errors, 0 warnings |
| TypeScript | ✅ Clean |
| `<motion.*>` remaining | 0 |
| `memo` exports | 14 |

## Bundle sizes (after)

Measured from `.next/static` post-build.

| Metric | Value |
|---|---|
| Total JS (all chunks) | **1,883.2 KB** (55 files) |
| CSS | **79.3 KB** (1 file) |
| Largest chunk | 280.7 KB (recharts; not on landing) |

### First-load JS by route

| Route | First-load JS | Scripts |
|---|---:|---:|
| `/` (landing) | **796.6 KB** | 16 |
| `/login` | 752.7 KB | 15 |
| `/signup` | 753.9 KB | 15 |
| `/goals` | 765.0 KB | 15 |
| `/onboarding` | 763.3 KB | 14 |
| `/profile` | 760.6 KB | 14 |
| `/workouts` | 780.9 KB | 15 |
| `/nutrition` | 1,078.8 KB | 17 |
| `/water` | 1,126.1 KB | 17 |
| `/progress` | 1,156.7 KB | 18 |
| `/analytics` | 1,173.0 KB | 20 |
| `/dashboard` | 1,178.8 KB | 20 |

Landing is among the lightest routes: below-fold sections code-split, hero video deferred, AppShell (sidebar/topbar/search) dynamic, framer-motion via `LazyMotion`.

## Baseline vs after

| Metric | Baseline | After | Notes |
|---|---|---|---|
| Total JS (all chunks) | 1,621.4 KB | 1,883.2 KB | Higher raw total from more dynamic chunks (chunk headers + duplication) |
| Landing first-load JS | ~all landing + shared + AppShell | **796.6 KB** | AppShell + 8 sections + search/help out of critical path |
| Landing FCP gate | AuthGuard splash until hydration | Renders immediately on public paths | Auth hydrates without blocking paint |
| Hero media | 1080p ~26 MB + autoplay | 720p/360p on idle + poster-first | Skips on reduced-motion / Save-Data / 2g |
| framer-motion | Full `motion` everywhere | `LazyMotion domMax` + `<m.*>` | 148 tags; 0 `<motion.*>` remain |
| Layout animations | risk without max features | `domMax` | `layoutId` in sidebar / mobile-nav / pricing |
| Below-fold landing JS | Eager in page bundle | `next/dynamic` via `lazy-sections.tsx` | 8 sections split out |
| App chrome on landing | Static `AppShell` import | `next/dynamic` in `route-shell.tsx` | Sidebar/topbar/mobile-nav/search only on app routes |
| GlobalSearch / shortcuts help | Eager | `next/dynamic` | Modal UI loads on demand |
| Scroll parallax | setState per frame | `useTransform` / springs | Hero + timeline |
| Simulator / testimonials timers | Always-on intervals | IntersectionObserver + `document.hidden` | Single 500ms tick |
| Recharts | Always animate | `isAnimationActive={!prefersReducedMotion}` | weekly + weight charts |
| CSS ambient anims | Always on | Gated under `prefers-reduced-motion` | grain, dot-grid, shimmer, float-y |
| Dashboard re-renders | Impure re-render | `memo` on 14 components | Cards, header, quick actions, charts |

## Target scorecard

| Target | Result |
|---|---|
| FCP < 1.2s | Not measured (no Lighthouse in CI) — public path no longer blocked by auth splash; poster-first LCP |
| LCP < 1.5s | Expected from hero poster `fetchPriority=high` + preload |
| TTI < 2.5s | Improved: idle video, code-split sections, deferred AppShell |
| TBT < 100ms | Improved: gated intervals, fewer continuous animations |
| CLS < 0.05 | Poster dimensions reserved; loading placeholders match search button |
| Lighthouse > 90 | Re-run in browser to confirm |
| Landing JS < 200 KB | **Not met (796.6 KB)** — React + framer-motion + providers dominate |
| Dashboard JS < 250 KB | **Not met (1,178.8 KB)** — recharts + shared graph dominate |

Honest note: raw total JS rose because code-splitting multiplies file count (and some async chunks are extra). Wins are **route-level first-load**, **no auth splash on public routes**, and **lower main-thread work** — not total bytes.

## Optimization log

### Optimized hero — `hero-section.tsx`, `layout.tsx`
- 720p default, 360p on 3g/Save-Data/2g; 1080p removed.
- Poster-first (`fetchPriority="high"`); video after `requestIdleCallback` / 2s.
- Skip on reduced-motion / Save-Data / slow-2g/2g.
- Pause on `visibilitychange` + IntersectionObserver.
- preconnect + poster preload; `dns-prefetch` for `assets.mixkit.co`.

### Optimized motion bundle — `providers.tsx` + ~55 files
- `<LazyMotion features={domMax}>` (framer-motion 13: no `async` prop).
- `<MotionConfig reducedMotion="user">`.
- `<motion.*>` → `<m.*>` (148 tags, 0 remaining).
- `domMax` required by `layoutId` in sidebar / mobile-nav / pricing.

### Optimized code splitting — `page.tsx`, `lazy-sections.tsx`, `route-shell.tsx`, `sidebar.tsx`, `topbar.tsx`, `app-shell.tsx`
- Landing: dynamic WorkoutSimulator, Features, Timeline, Testimonials, Pricing, FAQ, CTA, Footer.
- Hero + LandingNav + CursorGlow eager (above fold).
- AppShell dynamic so landing never loads sidebar/topbar/search/help.
- GlobalSearch + KeyboardShortcutsHelp dynamic (on-demand).
- `ssr: false` avoided in Server Components (Next 16 docs).

### Optimized public-route paint — `auth-guard.tsx`
- AuthGuard no longer shows full-screen splash on `/`, `/login`, `/signup`, `/onboarding` while hydrating; children render immediately.
- Protected routes still splash/redirect as before.

### Optimized animation cost — landing + UI
- Timeline parallax via `useTransform`; off under 768px / reduced-motion.
- Simulator: one 500ms interval, in-view + visible only; memoized HR path.
- Testimonials autoplay paused when hidden / out of view.
- Features bars/water → `scaleY`; progress-bar → `scaleX`.
- `globals.css`: grain / dot-grid / shimmer / float-y → `animation: none` under `prefers-reduced-motion`.

### Optimized charts + dashboard re-renders
- Weekly/weight charts: `isAnimationActive={!prefersReducedMotion} animationDuration={300}` on `Area`.
- `memo` via `XImpl` + `displayName` on 14 components (cards, header, quick actions, charts, StatCard, EmptyState).
- Fixed missing `WeeklyChart` memo export.
- Fixed `m` shadowing in `daily-summary.tsx`.

## How to re-measure

```powershell
npm.cmd run build
$js = Get-ChildItem .next\static\chunks -Recurse -File -Filter *.js
"Total JS: {0:N1} KB ({1})" -f (($js | Measure-Object Length -Sum).Sum/1KB), $js.Count
# First-load: sum unique /_next/static/*.js paths from .next\server\app\<route>.html
```

Lighthouse: `npx lighthouse http://localhost:3000/ --view` after `npm start`.

## Remaining opportunities

1. Bundle analyzer: `npx next experimental-analyze` (Next 16) for the 280.7 KB / 151.8 KB / 110 KB chunks.
2. Split lightweight settings provider so `FitnessDataProvider` (775 lines + storage) is not on landing.
3. Real Lighthouse for FCP/LCP/CLS/TBT.
4. No new packages allowed — `react-compiler` / `@next/bundle-analyzer` out of scope unless approved.
