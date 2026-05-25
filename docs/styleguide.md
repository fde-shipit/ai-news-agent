# Style Guide — martina-edwards.vercel.app

Extracted from `martina-portfolio` source files. Use this as the reference when aligning `ai-news-agent` to the portfolio's visual language.

---

## Colour tokens

All colours are declared as CSS custom properties in `app/globals.css`. There is no Tailwind config — the project uses **Tailwind v4 CSS-first** (`@import "tailwindcss"`), so tokens live exclusively in `:root`.

| Token | Hex / value | Role |
|---|---|---|
| `--paper` | `#EFF0F2` | Page background |
| `--paper-2` | `#F7F7F5` | Subtle inset card / panel background |
| `--ink` | `#1C2024` | Primary text |
| `--ink-soft` | `#3A424B` | Secondary text (between `--ink` and `--warm`) |
| `--warm` | `#5A6470` | Labels, tertiary text |
| `--pale` | `#E2E4E8` | Hover state, soft surfaces |
| `--rule` | `rgba(28, 32, 36, 0.12)` | Dividers (hairlines) |
| `--rule-strong` | `rgba(28, 32, 36, 0.24)` | Emphasised dividers |
| `--accent` | `#308695` | Teal — dominant accent. Used for interactive elements, highlights, the progress bar, status dot |
| `--accent-rare` | `#D45769` | Raspberry — reserved for the Oracle only. Used sparingly to preserve impact |

**Legacy aliases** (kept for backwards compat, don't use in new code):

| Alias | Points to |
|---|---|
| `--cream` | `--paper` |
| `--rust` | `--accent` |
| `--teal` | `--accent-rare` |

---

## Typography

### Fonts

Three Google fonts loaded via `next/font/google` and exposed as CSS variables on `<html>`:

| Variable | Family | Weights | Styles |
|---|---|---|---|
| `--font-cormorant` | Cormorant Garamond | 300, 400, 600 | normal, italic |
| `--font-dm-sans` | DM Sans | 300, 400, 500 | normal |
| `--font-dm-mono` | DM Mono | 400 | normal |

**Body default:** `font-family: 'DM Sans', sans-serif; font-weight: 300; line-height: 1.6`

### Usage rule

> Cormorant is for **display sizes only — 2rem (32px) and above**. Anything smaller stays in DM Sans so it reads crisp.

| Font | Use for |
|---|---|
| `--font-cormorant` | Display headings (h1, h2), pull quotes, large numerics |
| `--font-dm-sans` | Body copy, UI text, anything below 2rem |
| `--font-dm-mono` | Labels, navigation, metadata, tags, timestamps, mono code |

### Type scale (in use across components)

| Usage | Size | Family | Weight | Other |
|---|---|---|---|---|
| Hero h1 | `clamp(1.9rem, 3.2vw, 2.8rem)` | Cormorant | 300 | `line-height: 1.15`, `letter-spacing: -0.015em` |
| Section heading (Contact) | `clamp(1.4rem, 3vw, 2rem)` | Cormorant | 300 | `line-height: 1.35` |
| Career role title | `1.15rem` | Cormorant | 300 | — |
| Work card title | `1.4rem` | Cormorant | 300 | `line-height: 1.2` |
| Body / deck copy | `1rem` | DM Sans | 300 | `line-height: 1.6` |
| Secondary body | `0.85–0.95rem` | DM Sans | 300–400 | `line-height: 1.5–1.75` |
| Mono label (nav, section labels, tags) | `0.65–0.7rem` | DM Mono | 400 | `text-transform: uppercase`, `letter-spacing: 0.12–0.16em` |
| Tiny mono label | `0.58–0.62rem` | DM Mono | 400 | `text-transform: uppercase`, `letter-spacing: 0.12em` |

The `.font-mono-label` utility class encodes the label pattern:
```css
font-family: 'DM Mono', monospace;
font-weight: 400;
text-transform: uppercase;
letter-spacing: 0.12em;
font-size: 0.7rem;
```

---

## Spacing scale

The portfolio uses a **rem-based, manually chosen scale** — not a Tailwind spacing scale. Values seen across components:

| Step | Value | Typical use |
|---|---|---|
| xs | `0.25rem` (4px) | Tight internal gap (badge padding, row gaps) |
| sm | `0.35–0.4rem` (5–6px) | Label-to-value gap in contact links |
| md | `0.6rem` (10px) | Icon-to-text gap, inline spacing |
| base | `0.75rem` (12px) | Internal element gap |
| lg | `1rem` (16px) | Standard gap, section meta gap |
| xl | `1.2–1.25rem` (19–20px) | Hero eyebrow padding, mobile padding |
| 2xl | `1.5rem` (24px) | Card padding (vertical), grid gap |
| 3xl | `1.6–1.75rem` (26–28px) | Card padding (horizontal) |
| 4xl | `2rem` (32px) | Section label padding right, CTA gap |
| 5xl | `2.4rem` (38px) | Hero stack padding, CTA gap |
| 6xl | `3rem` (48px) | Section horizontal padding, nav padding |
| 7xl | `3rem` (48px) | Section content top/bottom padding |
| hero | `3rem` (48px) | Contact body margin-bottom |

**Max-widths in use:**
- `1500px` — outermost section wrapper (Work, Contact)
- `1400px` — Career section wrapper
- `1180px` — Hero inner
- `880px` — Hero text stack
- `680px` — Contact content block
- `60ch` / `56ch` / `28ch` — prose line-length caps

---

## Borders & dividers

The portfolio uses **hairline borders exclusively** — never rounded corners on structural elements, no box shadows on layout components.

| Pattern | Value |
|---|---|
| Standard divider | `1px solid var(--rule)` = `1px solid rgba(28, 32, 36, 0.12)` |
| Emphasised divider | `1px solid var(--rule-strong)` = `1px solid rgba(28, 32, 36, 0.24)` |
| Card / panel border | `1px solid var(--rule)` |
| Badge (e.g. "Current" tag) | `1px solid var(--accent)` (or `var(--rust)`) |
| Accent underline on CTAs | `1px solid var(--ink)` / `var(--accent)` / `var(--accent-rare)` |
| Section grid separator | `background: var(--rule)` on parent, `gap: 1px` — creates line via gap |
| Scrolled nav border | `1px solid var(--rule)` added by `.nav-scrolled` class |
| Border radius | **None** on structural elements. `50%` on the status dot (6×6px circle) only. |
| Progress bar | `height: 2px`, no radius |

---

## Layout patterns

### Section grid (the dominant layout pattern)
```css
.section-grid {
  display: grid;
  grid-template-columns: 200px 1fr;  /* label col | content col */
  border-top: 1px solid var(--rule);
}
.section-label {
  padding: 3rem 2rem 3rem 0;
  border-right: 1px solid var(--rule);
  position: sticky;
  top: 60px;          /* clears the fixed nav */
}
.section-content {
  padding: 3rem 0 3rem 3rem;
}
```
Collapses to single column at `max-width: 768px`.

### Nav
- Fixed, `height: 60px`, full-width, `z-index: 100`
- Transparent until scrolled; `.nav-scrolled` adds border + `backdrop-filter: blur(12px)` + `background: rgba(239, 240, 242, 0.85)`
- Desktop links: DM Mono, `0.65rem`, uppercase, `letter-spacing: 0.12em`
- Mobile: hidden desktop nav, fixed bottom bar (`height: 56px`)

### Breakpoint
Single breakpoint: `max-width: 768px` used throughout.

---

## Motion

Easing: `cubic-bezier(0.16, 1, 0.3, 1)` — fast-out, used for hover underlines and card lifts.

Standard transitions:
- Hover underline sweep: `width 0.4s cubic-bezier(0.16, 1, 0.3, 1)`
- Card hover lift: `transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)` → `translateY(-3px)`
- Nav background: `0.3s ease`
- Arrow nudge on hover: `translateX(3–4px)`, `0.2–0.3s ease`

Page-entry animations via GSAP (imported dynamically to avoid SSR). Honoured by `prefers-reduced-motion`.

---

## `NewsDigestAgent.jsx` — audit against this style guide

Every visual decision in the digest agent diverges from the portfolio. This is the full diff.

### Colour

| Element | Agent value | Portfolio equivalent | Gap |
|---|---|---|---|
| Background | `#0c0c0f` (near-black) | `#EFF0F2` (`--paper`) | Inverted scheme — dark vs light |
| Primary text | `#ede9e3` (off-white) | `#1C2024` (`--ink`) | Inverted |
| Secondary text | `#6a6a82`, `#484860` | `#3A424B` (`--ink-soft`) / `#5A6470` (`--warm`) | Different palette family |
| Label / dim text | `#3a3a50`, `#2a2a3a`, `#242434` | `#5A6470` (`--warm`) | Different greys, no CSS var |
| Borders | `#1e1e28`, `#14141c`, `#17172050` | `rgba(28,32,36,0.12)` (`--rule`) | Dark-scheme equivalent, not portable |
| Accent (news) | `#e8c547` (yellow) | `#308695` (`--accent`) | No correspondence |
| Accent (pulse) | `#4a9eff` (blue) | — | No correspondence |
| Accent (research) | `#22c55e` (green) | — | No correspondence |
| Accent (longform) | `#a855f7` (purple) | — | No correspondence |
| Accent (connect) | `#ec4899` (pink) | — | No correspondence |
| Error | `#ef4444` | — | Not in portfolio palette |

**Root cause:** The agent uses a bespoke dark-mode palette with per-signal accent colours. The portfolio is light-mode with two fixed accents. These are intentionally different products; the question is whether to align them or keep the agent dark.

### Typography

| Element | Agent value | Portfolio standard | Gap |
|---|---|---|---|
| Display font | `'Playfair Display'` (Google Fonts `@import`) | Cormorant Garamond via `--font-cormorant` | Wrong serif — different personality. Playfair is heavier and more editorial-magazine; Cormorant is lighter and more refined |
| UI / body font | `'Lato'` (Google Fonts `@import`) | DM Sans via `--font-dm-sans` | Wrong sans — Lato is lighter/more generic |
| Mono font | `'IBM Plex Mono'` (Google Fonts `@import`) | DM Mono via `--font-dm-mono` | Different mono family |
| Font loading | `@import url('https://fonts.googleapis.com/...')` inside `<style>` tag — loaded on every render | `next/font/google` — optimised, preloaded, zero CLS | Wrong loading method — will cause FOUT and extra network requests |
| Masthead size | `28px` | `clamp(1.9rem, 3.2vw, 2.8rem)` | Static px vs fluid clamp |
| Label text | `font-size: 9–11px` | `0.65–0.7rem` | Hard px vs rem |
| Body copy | Lato 300, `14px` | DM Sans 300, `1rem` | Wrong family; hard px |

### Borders & radius

| Element | Agent value | Portfolio standard | Gap |
|---|---|---|---|
| Card border-radius | `6px` (step cards), `5px` (code blocks), `3px` (chip), `2px` (buttons) | `0` — no border radius on structural elements | Portfolio uses no rounded corners at all |
| Dividers | `1px solid #14141c` | `1px solid var(--rule)` | Hard hex vs CSS var; dark colour |
| Button style | Rounded `border-radius: 2–3px`, background-filled | Portfolio uses text links / hairline-bordered elements | Portfolio has no solid background buttons |

### Spacing

| Element | Agent value | Portfolio approach | Gap |
|---|---|---|---|
| Horizontal page padding | `24px` | `3rem` (48px) | Under-padded |
| Max content width | `700px` | `1180–1500px` (varies by section) | Much narrower |
| Section gaps | Mix of hard `px` values | `rem`-based scale | Inconsistent units |

### Structure

| Aspect | Agent | Portfolio | Gap |
|---|---|---|---|
| CSS variables | None — all values are inline hex | Full `--token` system | No design token layer |
| CSS location | Inline `<style>` tag inside component | `globals.css` + scoped `<style>` in component when needed | Style bleeding risk; harder to maintain |
| Font loading | Runtime `@import` | Build-time `next/font` | Performance gap |
| Scheme | Dark | Light | Fundamental difference |
