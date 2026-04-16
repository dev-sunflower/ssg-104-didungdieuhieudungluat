# SSG104 Design System Refactor — Spec

**Date:** 2026-04-16  
**Scope:** Full codebase refactor — design tokens, component styling, page layouts, Next.js/HeroUI/Supabase best practices  
**Approach:** Tailwind v4 `@theme` as single source of truth, HeroUI semantic color mapping

---

## 1. Goals

1. Apply DESIGN.md (Claude/Anthropic-inspired warm editorial aesthetic) to all pages
2. Restructure landing page with full editorial layout (alternating dark/light sections, serif hero)
3. Keep dark mode, mapped to DESIGN.md dark surface tokens
4. Separate components following Next.js App Router best practices
5. Apply HeroUI v3, Supabase, and React 19 best practices throughout

---

## 2. Token Architecture

Four CSS files under `src/styles/tokens/`, imported in order from `src/app/globals.css`.

### `tokens/primitives.css`
Raw palette — every named DESIGN.md color value. Never referenced directly in components.

```css
@theme {
  /* Backgrounds */
  --color-parchment: #f5f4ed;
  --color-ivory: #faf9f5;
  --color-pure-white: #ffffff;
  --color-warm-sand: #e8e6dc;

  /* Dark surfaces */
  --color-near-black: #141413;
  --color-dark-surface: #30302e;
  --color-dark-warm: #3d3d3a;

  /* Brand */
  --color-terracotta: #c96442;
  --color-coral: #d97757;

  /* Semantic reds */
  --color-error: #b53333;

  /* Neutrals */
  --color-charcoal-warm: #4d4c48;
  --color-olive-gray: #5e5d59;
  --color-stone-gray: #87867f;
  --color-warm-silver: #b0aea5;

  /* Borders */
  --color-border-cream: #f0eee6;
  --color-border-warm: #e8e6dc;
  --color-border-dark: #30302e;

  /* Rings */
  --color-ring-warm: #d1cfc5;
  --color-ring-deep: #c2c0b6;

  /* Accent */
  --color-focus-blue: #3898ec;
}
```

### `tokens/semantic.css`
Role-based tokens that components use. Reference only primitives.

```css
@theme {
  /* Page backgrounds */
  --color-bg-page: var(--color-parchment);
  --color-bg-card: var(--color-ivory);
  --color-bg-elevated: var(--color-pure-white);
  --color-bg-subtle: var(--color-warm-sand);
  --color-bg-dark: var(--color-near-black);
  --color-bg-dark-card: var(--color-dark-surface);

  /* Text */
  --color-text-primary: var(--color-near-black);
  --color-text-secondary: var(--color-olive-gray);
  --color-text-tertiary: var(--color-stone-gray);
  --color-text-inverted: var(--color-ivory);
  --color-text-inverted-secondary: var(--color-warm-silver);
  --color-text-brand: var(--color-terracotta);
  --color-text-link: var(--color-coral);

  /* Borders */
  --color-border: var(--color-border-cream);
  --color-border-strong: var(--color-border-warm);

  /* Brand */
  --color-brand: var(--color-terracotta);
  --color-brand-hover: var(--color-coral);

  /* Interactive */
  --color-ring: var(--color-ring-warm);
  --color-focus: var(--color-focus-blue);

  /* Status */
  --color-status-error: var(--color-error);
}
```

### `tokens/dark.css`
Dark mode overrides — only semantic tokens, under `.dark` selector.

```css
.dark {
  --color-bg-page: var(--color-near-black);
  --color-bg-card: var(--color-dark-surface);
  --color-bg-elevated: var(--color-dark-warm);
  --color-bg-subtle: var(--color-dark-surface);

  --color-text-primary: var(--color-ivory);
  --color-text-secondary: var(--color-warm-silver);
  --color-text-tertiary: var(--color-stone-gray);

  --color-border: var(--color-border-dark);
  --color-border-strong: var(--color-dark-warm);
}
```

### `tokens/typography.css`
Type scale as Tailwind utilities.

```css
@theme {
  --font-serif: Georgia, serif;
  --font-sans: var(--font-inter), system-ui, sans-serif;
  --font-mono: var(--font-geist-mono), monospace;

  /* Text scale */
  --text-display: 4rem;        /* 64px — serif 500, lh 1.10 */
  --text-heading: 3.25rem;     /* 52px — serif 500, lh 1.20 */
  --text-subheading-lg: 2.3rem;  /* 36px — serif 500, lh 1.30 */
  --text-subheading: 2rem;     /* 32px — serif 500, lh 1.10 */
  --text-subheading-sm: 1.6rem;  /* 25px — serif 500, lh 1.20 */
  --text-feature: 1.3rem;      /* 20px — serif 500, lh 1.20 */
  --text-body-lg: 1.25rem;     /* 20px — sans 400, lh 1.60 */
  --text-body: 1rem;           /* 16px — sans 400, lh 1.60 */
  --text-body-sm: 0.94rem;     /* 15px — sans 400 */
  --text-caption: 0.88rem;     /* 14px — sans 400, lh 1.43 */
  --text-label: 0.75rem;       /* 12px — sans 500, ls 0.12px */
  --text-overline: 0.63rem;    /* 10px — sans 400, ls 0.5px */
}
```

---

## 3. Typography

- **`next/font/google`**: Load `Inter` (variable, subsets: latin, vietnamese) in `app/layout.tsx`
- **Georgia**: System font, no loading needed — declared in `--font-serif` fallback
- **Geist Mono**: Keep for code blocks (already loaded)
- **Rule**: Serif (`font-serif`) for all headlines. Sans (`font-sans`) for all UI/body. Mono only for code.
- **Weight rule**: Serif always `font-medium` (500). Never bold.
- **Line-height**: `leading-[1.6]` for body. `leading-tight` (1.10–1.30) for headings.

---

## 4. Component Patterns

### HeroUI Theme Configuration (`app/layout.tsx` HeroUIProvider)

Map HeroUI semantic colors to design tokens:

```ts
{
  primary: { DEFAULT: '#c96442', foreground: '#faf9f5' },  // terracotta
  secondary: { DEFAULT: '#e8e6dc', foreground: '#4d4c48' }, // warm-sand
  default: { DEFAULT: '#faf9f5', foreground: '#141413' },   // ivory
  danger: { DEFAULT: '#b53333', foreground: '#faf9f5' },   // error crimson
  background: '#f5f4ed',
  foreground: '#141413',
}
```

Dark mode variant maps to near-black surfaces.

### Buttons

| Variant | Class pattern |
|---|---|
| Primary (CTA) | `bg-brand text-inverted rounded-lg ring-[0_0_0_1px] ring-terracotta` |
| Secondary | `bg-bg-subtle text-charcoal-warm rounded-lg ring-[0_0_0_1px] ring-ring` |
| Ghost | `bg-pure-white text-text-primary rounded-xl` |
| Dark | `bg-near-black text-inverted-secondary rounded-xl border border-dark-surface` |

### Cards
`bg-bg-card border border-border rounded-lg shadow-[rgba(0,0,0,0.05)_0px_4px_24px]`

Dark sections use `bg-bg-dark-card border-border-dark`.

### Inputs
`rounded-xl border border-border bg-bg-card text-text-primary px-3 focus:border-focus-blue focus:ring-0`

### Shadow scale (Tailwind `@theme` extensions)
```css
--shadow-ring: 0 0 0 1px var(--color-ring);
--shadow-ring-brand: 0 0 0 1px var(--color-terracotta);
--shadow-whisper: rgba(0,0,0,0.05) 0px 4px 24px;
```

---

## 5. Page-by-Page Layout Plan

### Landing Page — Full editorial restructure

Sections (top to bottom):

1. **Navbar** — sticky, `bg-bg-page border-b border-border`, logo left, links center, CTA right (terracotta button)
2. **Hero** — light (parchment), centered. Display headline (64px Georgia), body-lg subtitle (olive-gray), two CTAs. Full-width.
3. **Stats strip** — light, 3-col grid of large serif numbers + captions
4. **Features dark section** — near-black background, ivory serif heading, feature cards grid on dark-card surfaces
5. **License types** — light (parchment), serif subheading, 4-col grid of A1/A2/B1/B2 cards with warm-sand backgrounds
6. **How it works** — dark section, step-by-step with serif headings
7. **CTA banner** — light, large centered serif heading, single terracotta button
8. **Footer** — near-black, ivory text, warm-silver secondary links

All sections: `py-20 md:py-28` vertical spacing. Max container `max-w-6xl mx-auto px-6`.

### Auth Pages (login, signup)
- Center card on parchment background
- Card: `bg-bg-card border border-border rounded-2xl p-10 shadow-whisper`
- Serif heading, sans body text
- Inputs use design token styles
- Terracotta primary button

### Learning Pages (flashcards, exam)
- Parchment background
- Navbar at top (desktop), tab bar bottom (mobile)
- FlashCard: update colors to semantic tokens, keep 3D flip
- QuestionCard: terracotta for selected, warm-sand for unselected options
- Exam results: serif heading for score, cards for breakdown

### Admin Pages
- Sidebar: `bg-bg-card border-r border-border`
- Tables: warm-sand header row, ivory alternating rows, border-cream dividers
- Forms: design token inputs, terracotta submit button
- Same token system but more utilitarian layout

### Mini-games
- Same Navbar wrapper
- Road signs placeholder: dark hero section with serif "Coming Soon" heading

---

## 6. File & Component Structure (Next.js Best Practices)

### Server vs Client split

| Component | Type | Reason |
|---|---|---|
| `app/layout.tsx` | Server | Font loading, metadata, HeroUIProvider (static) |
| `app/landing/page.tsx` | Server | Static content, no interactivity |
| `app/landing/_components/` | Server | Hero, Features, Stats, Footer sections |
| `app/auth/login/page.tsx` | Client | Form state |
| `app/(learning)/flashcards/page.tsx` | Client | Interactive flip, filters |
| `app/(learning)/exam/page.tsx` | Client | Answer tracking |
| `app/(admin)/questions/[id]/page.tsx` | Server wrapper + Client form | Data fetch server, form client |
| `Navbar.tsx` | Client | Auth state subscription |
| `AdminSidebar.tsx` | Client | Active route detection |

### Component co-location
- Page-specific components live in `app/<route>/_components/` (not in `src/components/`)
- Shared reusable components stay in `src/components/ui/` and `src/components/layout/`
- No barrel `index.ts` files — direct named imports only

### New shared components to create
```
src/components/ui/
  Button.tsx         # Thin wrapper around HeroUI Button with variant types
  Card.tsx           # Semantic card with whisper shadow
  Section.tsx        # Light/dark section wrapper with container
  Typography.tsx     # Serif/sans heading components (H1–H4, Body, Caption)
```

### Remove
- `src/components/layout/LearnLayout.tsx` — unused, layout logic lives in route `layout.tsx`
- `src/components/layout/GamesLayout.tsx` — same
- `src/components/ui/AppButton.tsx` — unused placeholder

---

## 7. Supabase Best Practices

### Client initialization
- **Keep** `lib/supabase/client.ts` (browser) and `lib/supabase/server.ts` (server) — correct pattern
- **Add** `lib/supabase/middleware.ts` — extract middleware client creation for clarity
- Never import `server.ts` in Client Components; never import `client.ts` in Server Components

### Data fetching
- Server Components fetch directly: `const supabase = await createClient(); const { data } = await supabase.from(...)`
- No useEffect for initial data in server-renderable pages — pass as props from Server Component
- Client Components only use Supabase client for real-time subscriptions or user-triggered mutations

### Auth
- Keep magic link OTP pattern — it's correct
- Consolidate duplicate callback routes: keep only `app/auth/callback/route.ts`, remove `app/api/auth/callback/`
- Middleware session refresh stays as-is

### Type safety
- `lib/types/database.ts` is correct — keep and expand as needed
- Use `Database` generic on client: `createBrowserClient<Database>(...)` for full type inference

---

## 8. Responsive Behavior

Following DESIGN.md breakpoints:
- `< 480px`: stacked everything, compact typography (display → 2rem)
- `480–768px`: single column, hamburger/bottom nav, (display → 2.3rem)
- `768–992px`: 2-col grids, condensed nav
- `992px+`: full multi-column, max hero 64px

Tailwind responsive prefixes: `sm:` (640), `md:` (768), `lg:` (1024) — close enough to DESIGN.md breakpoints.

---

## 9. Constraints & Non-Goals

- No custom illustration assets — sections without illustrations use whitespace + typography
- No animation beyond existing FlashCard flip and standard HeroUI transitions
- No new features — this is a visual/structural refactor only
- Road signs game stays as placeholder
- Profile pages stay as stubs
