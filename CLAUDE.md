# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # Start development server (localhost:3000)
npm run build    # Production build
npm run lint     # ESLint
```

There are no tests. There is no separate type-check script (JavaScript, not TypeScript).

## Environment

Requires `.env.local` at the root:
```
ANTHROPIC_API_KEY=sk-ant-...
NEXT_PUBLIC_MULTI_USER=false
```

## Architecture

Single-page app with two API routes. Almost all logic lives in one large client component.

**Request flow:**
1. `app/page.js` renders `components/NewsDigestAgent.jsx` (client component, `"use client"`)
2. User selects topics + signal type, clicks Generate
3. Component POSTs to `/api/digest` → Claude Sonnet 4.6 with `web_search_20250305` tool → returns raw `response.content` array
4. Component parses the content array with `parseDigest()` (regex-based) into sections/stories
5. "Explain simply" clicks POST to `/api/explain` → Claude Haiku 4.5 → plain-text explanation

**API routes** (`app/api/`):
- `digest/route.js` — validates topics (1–5 items, ≤30 chars each), builds system/user prompt per signal type, calls Sonnet 4.6, returns raw content blocks
- `explain/route.js` — calls Haiku 4.5 with headline + body, returns plain text

**Signal types** (defined inside `NewsDigestAgent.jsx`): `news`, `pulse`, `longform`, `research`, `synthesis` — each has its own system prompt, user prompt template, and label string (e.g. "Why it matters", "Signal").

## Styling

No Tailwind. Styles are CSS variables (`app/globals.css`) + inline styles inside a `<style>` tag in `NewsDigestAgent.jsx`. Tokens: `--paper`, `--ink`, `--accent`, `--rule`, etc. Fonts loaded via `next/font/google` in `app/layout.js` (Cormorant Garamond, DM Sans, DM Mono).

Do not introduce Tailwind or external CSS frameworks.

## Key files

| File | Purpose |
|------|---------|
| `components/NewsDigestAgent.jsx` | Entire UI + state + parsing (~575 lines) |
| `app/api/digest/route.js` | Digest generation via Claude + web search |
| `app/api/explain/route.js` | Per-story plain-language explanation |
| `app/globals.css` | CSS variable tokens and base styles |
| `docs/styleguide.md` | Design audit — read before changing visual styles |
