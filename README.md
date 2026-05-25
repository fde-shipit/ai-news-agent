# The Digest

An AI news agent that tracks signals, surfaces stories, and connects the dots across topics you care about.

---

## What it does

Choose up to five topics, pick a signal type, and The Digest runs a live web search and writes you a structured briefing in seconds.

| Signal | What you get |
|---|---|
| **Latest** | Breaking news from the last 48 hours — named sources, key figures, and why each story matters. |
| **Pulse** | Trending GitHub repos and Hacker News discussions gaining momentum right now. |
| **Long-form** | Substacks and essays worth your time — arguments and ideas, not just headlines. |
| **Research** | Recent papers and breakthroughs from arxiv and academic journals, last 30 days. |
| **Connect** | Hidden threads linking your topics together — patterns others haven't spotted yet. |

Each story includes a source link and a plain-English "explain simply" button powered by Claude Haiku.

---

## Live demo

[ai-news-agent-gules.vercel.app](https://ai-news-agent-gules.vercel.app)

---

## Run your own

You'll need [Node.js](https://nodejs.org) (LTS) and an Anthropic API key (see below).

**Local setup**

1. Fork this repo on GitHub, then clone your fork:
   ```bash
   git clone https://github.com/YOUR-USERNAME/ai-news-agent.git
   cd ai-news-agent
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file in the project root and add your key:
   ```
   ANTHROPIC_API_KEY=your-key-here
   ```
4. Start the dev server:
   ```bash
   npm run dev
   ```
5. Open [localhost:3000](http://localhost:3000).

For a full deployment walkthrough, see [martina-edwards.vercel.app](https://martina-edwards.vercel.app).

---

## Get an API key

Create one at [console.anthropic.com/settings/keys](https://console.anthropic.com/settings/keys). You'll need to add a payment method, but you won't be charged until you use it. A typical digest run costs a few cents.

Set a monthly spending cap in the Anthropic console before sharing your deployment with anyone.

---

## Built with

- [Next.js](https://nextjs.org) (App Router)
- [Claude Sonnet](https://anthropic.com) — digest generation with live web search
- [Claude Haiku](https://anthropic.com) — plain-English story explanations
- [Vercel](https://vercel.com) — hosting

---

## About

Built by [Martina Edwards](https://martina-edwards.vercel.app) — AI acceleration specialist and the person behind the portfolio this project lives alongside.

---

MIT licence.
