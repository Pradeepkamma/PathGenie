## Goal
Lift PathGenie from "okay but plain" to a premium SaaS feel, add a real user dashboard, and polish the admin monitoring page. We'll ship this in 3 phases so you can review after each.

---

## Phase 1 — Premium design foundation (do first)

Upgrade the look of every page at once by changing tokens, not components.

- **Color system (`index.css` + `tailwind.config.ts`)**
  - Richer indigo→violet→teal gradients (`--gradient-hero`, `--gradient-card`, `--gradient-mesh`)
  - Deeper dark-mode background with subtle noise/mesh
  - Glass surface tokens (`--glass-bg`, `--glass-border`) for cards
  - Glow shadows (`--shadow-glow`, `--shadow-elevated`)
- **Typography**: keep Space Grotesk for display, bump headline sizes (clamp), tighter letter-spacing
- **New reusable bits**: `GradientText`, `GlassCard`, `StatCard`, `SectionHeader`, animated `Aurora` background blob
- **Landing page**: bold hero with animated gradient mesh, large headline + sub, social-proof strip, 3-step "How it works", feature grid with icons, testimonial, final CTA — all with framer-motion stagger
- **Navbar**: sticky glass blur, cleaner active state

---

## Phase 2 — User Dashboard (new)

New route `/dashboard` becomes the home for logged-in users (replaces landing for them).

```text
┌──────────────────────────────────────────────┐
│  Welcome back, {name}              [Avatar]  │
│  Here's where you are on your career path    │
├──────────┬──────────┬──────────┬─────────────┤
│ Latest   │ Steps    │ Total    │ Top match   │
│ Score 87 │ 12/30 ✓  │ Analyses │ AI Engineer │
├──────────┴──────────┴──────────┴─────────────┤
│  📈 Progress over time (sparkline chart)     │
├──────────────────────────────────────────────┤
│  🎯 Continue your journey (next 3 steps)     │
│  📚 Recommended resources                    │
│  🕘 Recent analyses (mini list → /history)   │
│  ⚡  Quick actions: New analysis · Share     │
└──────────────────────────────────────────────┘
```

Files: `src/pages/Dashboard.tsx`, `src/components/dashboard/*` (StatGrid, ProgressChart, ContinueJourney, RecentAnalyses, QuickActions). Data pulled from `user_results` + `career_progress`. Logged-in users hitting `/` redirect to `/dashboard`.

---

## Phase 3 — Polish Admin + key existing pages

- **Admin (`/admin`)**: hero header with live status, 4 colored stat cards with sparkline trends, recharts area chart of calls over last 7 days, recharts donut for status breakdown, filter bar (time range + function), keep tabs but restyle rows with hover, status badges with dot, expandable error row.
- **Results page**: tighten spacing, move CTAs into a sticky bottom bar on mobile, redesign `CareerCard` with gradient border + score ring.
- **Quiz / Analysis screens**: progress bar with gradient, large card, smoother transitions.
- **History page**: card grid instead of plain list, score chip + date.

---

## Technical notes

- All colors stay HSL semantic tokens — no raw `text-white` etc.
- Animations via `framer-motion` (already installed) + tailwind keyframes already defined.
- No backend/schema changes. Pure frontend + one new route.
- Mobile-first preserved; sticky CTA bar on results for small screens.
- Files touched (~Phase 1): `src/index.css`, `tailwind.config.ts`, `src/components/LandingScreen.tsx`, `src/components/Navbar.tsx`, plus 4–5 new presentational components.

---

## Order of execution

1. Phase 1 (foundation + landing) — biggest visual lift, ship & you review
2. Phase 2 (dashboard) — after you approve Phase 1
3. Phase 3 (admin polish + results/quiz/history) — final pass

After each phase I'll stop so you can check before we move on. Sound good?