<div align="center">

# 💓 PULSE

### Every beat counts.

**Track workouts, fuel your body, and watch yourself transform — in one beautiful app.**

[![Live Demo](https://img.shields.io/badge/Live_Demo-fitness--tracker--wheat--eta.vercel.app-6C5CE7?style=for-the-badge&logo=vercel&logoColor=white)](https://fitness-tracker-wheat-eta.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-16.3.5-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-22C55E?style=for-the-badge)](./LICENSE)

</div>

---

## 📖 About

**PULSE** is a modern, premium fitness tracking web app that helps you log workouts, track nutrition, monitor hydration, set goals, and visualize your progress — all in one beautiful, responsive interface.

Built with a **local-first** philosophy: your data stays on your device. No servers, no tracking, no nonsense.

**Live:** [fitness-tracker-wheat-eta.vercel.app](https://fitness-tracker-wheat-eta.vercel.app/)

---

## ✨ Features

### 🏋️ Workout Tracking
- Log sets, reps, and weights across 30+ exercises
- Full CRUD with date range, muscle group, and text filters
- Workout templates & quick-start
- Rest timer between sets
- Estimated 1RM calculator (Epley formula)
- Duplicate past workouts
- Personal Record (PR) detection & badges
- Total volume per muscle group

### 🍎 Nutrition Logging
- Calories, protein, carbs, and fat tracking
- Meal types (breakfast / lunch / dinner / snack)
- Daily macro summary with progress bars
- Meal templates & recent meals quick-add
- Macro split pie chart
- Copy yesterday's meals to today
- Serving size multipliers (0.5x, 1x, 1.5x, 2x)

### 💧 Water Tracking
- Quick-add buttons (+250ml, +500ml, +1L)
- Animated circular progress indicator
- Custom cup sizes
- Time-of-day breakdown
- Hydration streak tracking
- Weekly water bar chart
- Reminder notifications

### 📈 Progress & Analytics
- Weight tracking with 30d / 90d chart views
- Body measurements (waist, chest, arms, thighs)
- BMI calculator & body fat estimate
- Rate of change indicator (kg/week)
- Goal projection ("You'll hit target by …")
- Milestone celebrations
- Full analytics dashboard with heatmaps
- Calories in vs out, macro trends, PR timeline

### 🎯 Goals
- 5 goal types (weight, workout count, streak, water, custom)
- Milestones (25% / 50% / 75% / 100%)
- Auto-progress calculation
- Celebration animation on completion
- Archive & history timeline

### 👤 Profile & Settings
- Profile with body stats
- Avatar upload
- Achievement badges
- Data export / import (JSON)
- Storage usage indicator
- Units toggle (kg/lb, ml/oz)
- Theme: System / Light / Dark

### 🎨 Premium UI
- Dual theme — light + dark with system preference support
- Glass morphism cards & gradients
- Framer Motion animations throughout
- Stagger reveals, number counters, page transitions
- Fully responsive (320px → 1920px)
- Accessible — ARIA labels, keyboard nav, focus rings

### ⚡ Other Highlights
- **Local-first** — 100% client-side, no backend
- **Offline-ready** — works without internet
- **30-day demo data** generator
- **Global search** (⌘K / Ctrl+K command palette)
- **Level & XP system**
- **Activity feed** with real-time updates

---

## 🛠️ Tech Stack

| Category | Tech |
|---|---|
| **Framework** | [Next.js 16.3.5](https://nextjs.org/) (App Router) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) (strict mode) |
| **UI Library** | [React 19.2.8](https://react.dev/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) |
| **Animations** | [Framer Motion](https://www.framer.com/motion/) |
| **Theming** | [next-themes](https://github.com/pacocoursey/next-themes) |
| **Charts** | [Recharts 3.10](https://recharts.org/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Fonts** | [Geist Sans / Geist Mono](https://vercel.com/font) |
| **Storage** | localStorage (SSR-guarded) |
| **Deployment** | [Vercel](https://vercel.com/) |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- npm / pnpm / yarn / bun

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/fitness-tracker.git
cd fitness-tracker

# Install dependencies
npm install

# Run the development server
npm run dev
