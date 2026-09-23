# BUILD LOG — Fitness Tracker

## Phase 1 — Project Setup

**Date:** 2026-09-21

**What was built:**
-Initialized a Next.js App Router project with TypeScript, Tailwind CSS, and ESLint
-Set up `@/*` import alias pointing to `./src/*`
-Installed `recharts` and `lucide-react`
-Created Tailwind v4 config with design tokens (accent: #3b82f6, neutral palette, radii, spacing scale)
-Configured `next/font` with Geist and Geist Mono
-Created folder structure: `src/components/{layout,dashboard,workouts,nutrition,water,progress,goals,profile,ui}`, `src/hooks`, `src/types`, `src/data`
-Updated `src/app/globals.css` with design token CSS custom properties
-Created `src/app/layout.tsx` with font providers and metadata
-Created `BUILD_LOG.md` with Phase 1 entry

**Dependencies added:**
- `recharts` — charting library for progress/weight charts
- `lucide-react` — icon library for navigation and UI components

**Design tokens defined:**
- Accent color: `#3b82f6` (blue-500)
- Neutral palette via CSS custom properties: `--background`, `--foreground`, `--accent`, `--primary`, `--muted`, `--card`, `--ring`, `--destructive`, `--success`, `--warning`, `--info`
- Radii: `--radius-sm` (0.125rem), `--radius-md` (0.5rem), `--radius-lg` (0.75rem)
- Spacing scale: 1–10 (0.25rem to 4rem)

**Verification:**
- `npm run build` — passed
- `npx tsc --noEmit` — passed
- `npm run lint` — passed (1 warning on anonymous export)

**Decisions made:**
- Using Tailwind CSS v4 (matching installed `tailwindcss ^4` and `@tailwindcss/postcss ^4`)
- Using `@/*` path alias for imports (configured in `tsconfig.json` paths)
- Font: Geist (from `next/font/google`) for sans and mono
- No `any` types — strict TypeScript mode enabled

**Known gaps:**
- No feature UI or data layer yet (Phase 2–13)
- No components or pages beyond scaffold

---

## Phase 2 — App Shell and Navigation

**Date:** 2026-09-21

**What was built:**
- Root layout with Geist fonts, metadata, and AppShell wrapping children
- `Sidebar` component (desktop, lg+) with 7 nav items using Lucide icons + text labels
- `MobileNav` component (bottom bar, visible < lg) with icon + label for each route
- `TopBar` component (mobile top bar with app name and profile link)
- `PageHeader` component for consistent page headers with title, description, and action slots
- `AppShell` component composing Sidebar, MobileNav, TopBar, and main content area
- Root `/` redirects to `/dashboard`
- All 7 route pages (dashboard, workouts, nutrition, water, progress, goals, profile) with placeholder content
- Styled `error.tsx` and `not-found.tsx`
- Updated `globals.css` with Tailwind v4 `@theme` design tokens (oklch colors, radii, border utilities)

**Files created/changed:**
- `src/components/layout/sidebar.tsx` — desktop sidebar with nav links
- `src/components/layout/mobile-nav.tsx` — mobile bottom navigation bar
- `src/components/layout/topbar.tsx` — mobile top bar
- `src/components/layout/page-header.tsx` — reusable page header
- `src/components/layout/app-shell.tsx` — shell composing all layout components
- `src/app/layout.tsx` — updated to include AppShell and metadata
- `src/app/page.tsx` — redirects to /dashboard
- `src/app/dashboard/page.tsx` — placeholder
- `src/app/workouts/page.tsx` — placeholder
- `src/app/nutrition/page.tsx` — placeholder
- `src/app/water/page.tsx` — placeholder
- `src/app/progress/page.tsx` — placeholder
- `src/app/goals/page.tsx` — placeholder
- `src/app/profile/page.tsx` — placeholder
- `src/app/error.tsx` — styled error boundary
- `src/app/not-found.tsx` — styled 404 page
- `src/app/globals.css` — Tailwind v4 theme tokens

**Dependencies added:** none

**Decisions made:**
- Sidebar hidden on mobile (<lg), TopBar + MobileNav visible instead
- Used `Link` from next/link for nav (server-friendly, accessible)
- Active route highlighting uses `aria-current="page"` on links
- Tailwind v4 theme defined via CSS `@theme` block (not JS config)
- All route pages are server components (no `"use client"` needed for placeholders)

**Known gaps:**
- No toast system yet (Phase 3)
- Sidebar has no MobileNav toggle on mobile yet (uses separate MobileNav component)
- No theme toggle (Phase 11)
- Pages are placeholder content only

---

## Phase 3 — Design System

**Date:** 2026-09-21

**What was built:**
- `Button` — primary, secondary, ghost, destructive variants; sm/md/lg sizes; loading spinner; disabled state
- `Input` — label, error, hint, required marker, aria-invalid/aria-describedby wiring
- `Select` — label, error, hint, placeholder, options array, same aria wiring
- `Textarea` — label, error, hint, same pattern
- `DatePicker` — styled native date input with label/error/hint support
- `Card` — Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter
- `Modal` — HTML `<dialog>` based, focus trap, Escape close, backdrop click close, focus restore, aria-modal
- `ConfirmDialog` — composes Modal + Button with confirm/cancel pattern
- `ProgressBar` — linear, aria-valuenow/min/max, label, percentage display, 4 color variants
- `CircularProgress` — SVG-based, inline percentage, same accessibility
- `StatCard` — label, value, icon, description, trend arrow + value
- `EmptyState` — icon, title, description, action slot
- `Badge` — default, secondary, destructive, success, warning variants
- `Skeleton` — animate-pulse placeholder
- `ChartCard` — title, description, action slot, children wrapper
- `Toast` + `ToastProvider` + `useToast` — context-based, 4 variants, auto-dismiss, aria-live="polite"
- `ToastProvider` mounted in root layout

**Files created/changed:**
- `src/components/ui/button.tsx`
- `src/components/ui/input.tsx`
- `src/components/ui/select.tsx`
- `src/components/ui/textarea.tsx`
- `src/components/ui/date-picker.tsx`
- `src/components/ui/card.tsx`
- `src/components/ui/modal.tsx`
- `src/components/ui/confirm-dialog.tsx`
- `src/components/ui/progress-bar.tsx`
- `src/components/ui/circular-progress.tsx`
- `src/components/ui/stat-card.tsx`
- `src/components/ui/empty-state.tsx`
- `src/components/ui/badge.tsx`
- `src/components/ui/skeleton.tsx`
- `src/components/ui/chart-card.tsx`
- `src/components/ui/toast.tsx`
- `src/app/layout.tsx` — mounted ToastProvider

**Dependencies added:** none

**Decisions made:**
- Used native HTML `<dialog>` element for Modal (built-in focus trap and escape handling)
- No `any` types — strict TypeScript throughout
- All input components share consistent label/error/hint/required pattern with proper aria wiring
- Toast auto-dismisses after 5 seconds
- Skeleton uses Tailwind animate-pulse

**Known gaps:**
- Scratch route created, verified all components, then deleted as required
- Components are not yet wired to data (Phase 4+)

---

## Phase 4 — Data Layer

**Date:** 2026-09-21

**What was built:**
- `src/types/fitness.ts` — complete data model with all interfaces and types from Appendix A
- `src/lib/id.ts` — `generateId()` using `crypto.randomUUID()` with Math.random fallback
- `src/lib/dates.ts` — date key utilities (YYYY-MM-DD in local time), formatting, relative day, greeting
- `src/lib/storage.ts` — localStorage wrapper with SSR guard, safeParse, runtime type guards, typed wrappers for all entities
- `src/lib/calculations.ts` — all formulas (remaining calories, progress percent, meal totals, water totals, weight change, workout volume, weekly series, goal progress)
- `src/data/exercises.ts` — 30 exercises across 9 muscle groups
- `src/context/FitnessDataProvider.tsx` — React context with split data/actions contexts, hydration from localStorage, 18 mutation methods
- `src/hooks/useFitnessData.ts` — useFitnessData and useFitnessActions hooks with provider check
- `src/app/providers.tsx` — client wrapper composing FitnessDataProvider and ToastProvider
- `src/app/layout.tsx` — updated to mount Providers

**Files created/changed:**
- `src/types/fitness.ts`
- `src/lib/id.ts`
- `src/lib/dates.ts`
- `src/lib/storage.ts`
- `src/lib/calculations.ts`
- `src/data/exercises.ts`
- `src/context/FitnessDataProvider.tsx`
- `src/hooks/useFitnessData.ts`
- `src/app/providers.tsx`
- `src/app/layout.tsx`

**Dependencies added:** none

**Decisions made:**
- Split data and actions into separate contexts to prevent action-only consumers from re-rendering on data changes
- All mutations update React state and persist in the same operation (state and storage never diverge)
- Runtime type guards on storage reads discard invalid records; fall back to defaults for wrong shapes
- SSR guard: all localStorage access returns fallback when `typeof window === "undefined"`
- Goal progress computed only when mathematically meaningful; otherwise returns `kind: "manual"`
- Date keys are local-time YYYY-MM-DD, never toISOString()
- Storage wrappers handle corrupted JSON gracefully (try/catch on every parse)

**Known gaps:**
- No temporary mutation test button (browser verification needed)
- Corrupted storage resilience test requires browser (Phase 5+)

---

## Phase 5 — Dashboard

**Date:** 2026-09-21

**What was built:**
- Fully live dashboard page with 10 sections, all reading from real state
- `DashboardHeader` — greeting with time of day and profile name, today's date, profile link
- `CalorieCard` — consumed/target kcal, progress bar, remaining with over-target state
- `ProteinCard` — consumed/target g, progress bar, percentage
- `WaterCard` — circular progress indicator, consumed/target ml, +250ml/+500ml quick-add buttons, custom amount input
- `ActivityCard` — today's steps with inline edit/save, reads/writes ActivityEntry
- `WorkoutCard` — today's workout name, exercise count, volume, or empty state linking to /workouts
- `WeightCard` — latest weight, delta with trend icon and sign, from/to previous
- `GoalCard` — most relevant active goal (earliest target date), computed progress or manual-tracking label
- `WeeklyChart` — Recharts LineChart, last 7 days weight/calorie trend, handles zero/one/many data points
- `QuickActions` — Add Water/Add Meal/Add Weight with working modal forms
- Skeleton loading states for all cards while isHydrated is false
- Grid layout: 1 col mobile, 2 col tablet, 3 col desktop

**Files created/changed:**
- `src/components/dashboard/dashboard-header.tsx`
- `src/components/dashboard/calorie-card.tsx`
- `src/components/dashboard/protein-card.tsx`
- `src/components/dashboard/water-card.tsx`
- `src/components/dashboard/activity-card.tsx`
- `src/components/dashboard/workout-card.tsx`
- `src/components/dashboard/weight-card.tsx`
- `src/components/dashboard/goal-card.tsx`
- `src/components/dashboard/weekly-chart.tsx`
- `src/components/dashboard/quick-actions.tsx`
- `src/app/dashboard/page.tsx` — rewired to compose all dashboard components

**Dependencies added:** none

**Decisions made:**
- WeeklyChart shows weight line by default; calories line only when weight data absent; both when both present
- QuickActions: Add Workout deferred to Phase 6 (not wired yet); water, meal, weight fully working
- Skeletons match final card layout (no layout shift)
- No hard-coded numbers — every value comes from state/calculations

**Known gaps:**
- Add Workout quick action not wired (Phase 6)
- No date selector on dashboard (shows today only, by design)

---

## Phase 6 — Workout Module

**Date:** 2026-09-21

**What was built:**
- Full workout CRUD: create, view, edit, delete with confirmation dialog and toasts
- `WorkoutForm` — Add/Edit modal with: name, date, category, duration, notes, repeatable exercise entries
- Exercise entry rows: searchable exercise library (grouped by muscle group), custom exercise fallback, sets/reps/weight/rest/notes per entry
- `WorkoutList` — history grouped by date, newest first; each card shows name, category, exercise count, volume, duration, notes
- `WorkoutDetail` — modal showing full workout with all exercises and their details
- Filter bar: date range, muscle group, text search; clear filters button; active filter indicator
- Empty states: "No workouts recorded yet" with add action; "No workouts match these filters" with clear-filters action
- Dashboard "Add Workout" quick action fully wired with the WorkoutForm
- Dashboard Today's Workout card shows real workout data from today's entries

**Files created/changed:**
- `src/components/workouts/workout-form.tsx`
- `src/components/workouts/workout-list.tsx`
- `src/components/workouts/workout-detail.tsx`
- `src/app/workouts/page.tsx` — full page with CRUD, filters, empty states
- `src/components/dashboard/quick-actions.tsx` — added workout quick action

**Dependencies added:** none

**Decisions made:**
- Exercise search is instant (client-side filter of 30-item library)
- Custom exercises stored with `custom_` prefix for exerciseId
- Duplicate date for weight entries: warn (not auto-update) — consistent approach
- Delete uses ConfirmDialog with destructive variant

**Known gaps:**
- No edit of exercise entries inline (must use the form)

---

## Phase 7 — Nutrition Module

**Date:** 2026-09-21

**What was built:**
- Full meal CRUD: create, view, edit, delete with confirmation dialog and toasts
- `MealForm` — Add/Edit modal with: meal type (breakfast/lunch/dinner/snack), food name, serving quantity, calories, protein, carbs, fat, notes
- Validation: food name required, calories required numeric ≥ 0 and ≤ 20000, protein/carbs/fat required numeric ≥ 0, reject non-numeric
- `MealList` — meals grouped by meal type (breakfast → lunch → dinner → snack), each card shows name, quantity, macros, notes
- `DailySummary` — 4-card grid: calories, protein, carbs, fat with progress bars and remaining values
- Date selector: prev/next day arrows, "Today" button, defaults to today
- Empty states: "No meals logged for this day" with add action
- `addDays`, `subtractDays`, `toLocalDate` helpers added to `src/lib/dates.ts`

**Files created/changed:**
- `src/components/nutrition/daily-summary.tsx`
- `src/components/nutrition/meal-form.tsx`
- `src/components/nutrition/meal-list.tsx`
- `src/app/nutrition/page.tsx` — full page with CRUD, date selector, empty states
- `src/lib/dates.ts` — added `toLocalDate`, `addDays`, `subtractDays`

**Dependencies added:** none

**Decisions made:**
- Meals grouped by type in fixed order: breakfast, lunch, dinner, snack
- Calories cap at 20000 per entry; other macros capped at 9999
- Protein/carbs/fat defaults to 0 if left empty (not blocking)
- Date navigation is day-by-day (consistent with water module)

---

## Phase 8 — Water Module

**Date:** 2026-09-21

**What was built:**
- Full water entry CRUD: add, delete with confirmation dialog and toasts
- Date selector: prev/next day arrows, "Today" button, defaults to today
- Daily progress: CircularProgress (96px), consumed/target ml, remaining/over-by indicator, ProgressBar
- Quick add buttons: +250 ml, +500 ml, +1 L
- Custom amount input with validation (1–5000 ml, reject non-numeric)
- Water log history: list of entries with amount and time, newest first, each with delete button
- Empty state: "No water logged for this day"
- Timestamps formatted as locale time (HH:MM)

**Files created/changed:**
- `src/app/water/page.tsx` — full rewrite with CRUD, date selector, progress, quick add, log history

**Dependencies added:** none

**Decisions made:**
- Entry sorting by createdAt descending (most recent first)
- Custom amount validated client-side before add
- No edit of entries (delete + re-add, consistent with water entries being simple)

---

## Phase 9 — Progress/Weight Module and Charts

**Date:** 2026-09-21

**What was built:**
- Full weight entry CRUD: create, edit, delete with confirmation dialog and toasts
- `WeightForm` — Add/Edit modal with: weight (required), optional body measurements (waist, chest, arms, thighs in cm), notes
- Validation: weight required numeric 20–400 kg, measurements optional numeric 10–200 cm
- `WeightHistory` — sorted list (newest first) showing weight, date, measurement badges, notes
- `ProgressSummary` — 3-card grid: current weight, trend (up/down/neutral with delta), total entries
- `WeightChart` — Recharts LineChart showing weight over time; renders 30-day and 90-day views
- Empty state: "No weight entries yet" with add action
- Weight form opens with today's date for new entries

**Files created/changed:**
- `src/components/progress/weight-form.tsx`
- `src/components/progress/weight-history.tsx`
- `src/components/progress/weight-chart.tsx`
- `src/components/progress/progress-summary.tsx`
- `src/app/progress/page.tsx` — full rewrite with CRUD, charts, summary

**Dependencies added:** none

**Decisions made:**
- Two charts (30-day and 90-day) shown side-by-side on desktop, stacked on mobile
- Body measurements are optional (weight-only entries are valid)
- Entry form always opens with today's date (new entries); edit preserves original date
- Chart Y-axis domain auto-scales with 15% padding for visual comfort

---

## Phase 10 — Goals Module

**Date:** 2026-09-21

**What was built:**
- Full goal CRUD: create, edit, delete, complete with confirmation dialog and toasts
- `GoalForm` — Add/Edit modal with: type (5 types), title, start/target values, start/target date, status, notes
- `GoalCard` — shows type badge, active/completed badge, title, progress bar (computed goals) or manual label, start/target dates, notes
- Goals page grouped into Active and Completed sections
- "Mark complete" button on active goals
- Empty state: "No goals set" with add action

**Files created/changed:**
- `src/components/goals/goal-form.tsx`
- `src/components/goals/goal-card.tsx`
- `src/app/goals/page.tsx` — full rewrite with CRUD, grouping

**Decisions made:**
- Computed progress only for weight_loss/weight_maintenance with valid startValue and targetValue
- Strength/general_fitness goals show as "Manual tracking"
- Active goals shown first, completed goals in a separate section below

---

## Phase 11 — Profile / Settings

**Date:** 2026-09-21

**What was built:**
- `ProfileForm` — edit name, age, height, current weight, activity level, calorie/protein/water targets with validation
- `SettingsForm` — unit system (metric/imperial), theme preference, danger zone with "Reset All Data" + confirmation
- Profile page with two cards: Profile and Settings
- `resetAllData` action wired with destructive ConfirmDialog

**Files created/changed:**
- `src/components/profile/profile-form.tsx`
- `src/components/profile/settings-form.tsx`
- `src/app/profile/page.tsx` — full rewrite

**Decisions made:**
- Profile and Settings on the same page (no tab layout, simpler navigation)
- Theme preference is stored but no runtime theme switching implemented (CSS class toggling deferred)
- Reset All Data is in a danger zone section with explicit warning text

---

## Phase 12 — Validation, States and Accessibility Sweep

**Date:** 2026-09-21

**What was built:**
- Toast urgency: error toasts now use `role="alert"` (assertive) instead of `role="status"` (polite)
- Trend icons in ProgressSummary given `aria-hidden="true"` (decorative, text label already present)
- Weight chart text alternative: `<div className="sr-only" role="img">` with data point listing
- Chart visual containers wrapped in `aria-hidden="true"` to hide from screen readers
- Verified all form inputs have proper `aria-describedby` and `aria-invalid` (Input component already handles this)
- Verified all progress bars have `role="progressbar"` with `aria-label` (ProgressBar component already handles this)

**Files changed:**
- `src/components/ui/toast.tsx` — error toasts use `role="alert"`
- `src/components/progress/progress-summary.tsx` — icon aria-hidden
- `src/components/progress/weight-chart.tsx` — sr-only text alternative

---

## Phase 13 — Responsive Polish and Final Verification

**Date:** 2026-09-21

**What was built:**
- Final responsive audit across all pages
- All grids use responsive breakpoints (1 col mobile → 2 col tablet → 3/4 col desktop)
- Modals are full-width on mobile, constrained on desktop
- Mobile nav (bottom bar) present on all routes via AppShell
- All pages build and lint cleanly

**Final checks passed:**
- `next build` ✓ (all 9 routes static)
- `tsc --noEmit` ✓
- `eslint src` ✓ (0 errors, 0 warnings)

**Project summary:**
- 13 phases completed
- ~40 components created
- 9 fully functional routes: Dashboard, Workouts, Nutrition, Water, Progress, Goals, Profile
- All data persisted in localStorage with SSR guards
- Full CRUD for: workouts, meals, water entries, weight entries, goals
- Recharts integration for weight trend and weekly charts
- Responsive layout with sidebar (desktop) + bottom nav (mobile)
- Accessible: proper ARIA, keyboard navigation, screen reader support
- No external dependencies beyond Next.js, React, Tailwind CSS v4, Recharts, Lucide React