# /deploy — Deploy The Digest to Vercel

Walk the user through a first-time deployment of this app to Vercel, including
getting an Anthropic API key and wiring up environment variables.

Work through each phase below in order. Check in with the user after each phase
before moving on. If they get stuck, help them troubleshoot before continuing.

---

## Phase 1 — Anthropic API key

Tell the user:

> Before deploying, you need an Anthropic API key. This is what lets the app
> call Claude to generate your digests.

Steps to talk them through:

1. Go to **console.anthropic.com** and sign up (or log in).
2. Add a payment method under **Billing**. You won't be charged until you use
   the API — a typical digest run costs a few cents.
3. **Recommended:** Set a monthly spending cap now (Billing → Usage limits) so
   you can't accidentally run up a large bill, especially if you share the URL
   with others.
4. Go to **API Keys → Create key**, give it a name (e.g. "the-digest-vercel"),
   and copy the key. It starts with `sk-ant-api03-`.
5. Keep this tab open — you'll paste the key into Vercel in Phase 3.

---

## Phase 2 — Push the repo to GitHub

Vercel deploys from GitHub. Ask the user if the repo is already on GitHub.

**If yes:** confirm the URL and move to Phase 3.

**If no:** walk them through:

1. Go to **github.com → New repository**. Name it `ai-news-agent`, set it to
   Public (or Private — either works with Vercel), and do not add a README.
2. Run in the terminal:
   ```bash
   git remote add origin https://github.com/YOUR-USERNAME/ai-news-agent.git
   git push -u origin main
   ```
3. Refresh GitHub to confirm the files are there.

---

## Phase 3 — Import the project into Vercel

1. Go to **vercel.com** and sign up with your GitHub account if you haven't
   already. The free Hobby plan is enough for personal use.
2. Click **Add New → Project**.
3. Find your `ai-news-agent` repository in the list and click **Import**.
4. Vercel will detect it's a Next.js app automatically. Don't change the
   framework or build settings — the defaults are correct.
5. **Do not click Deploy yet.** Environment variables come first.

---

## Phase 4 — Set environment variables

Still on the Vercel import screen, scroll down to **Environment Variables**.
Add both variables from `.env.example`:

| Name | Value |
|------|-------|
| `ANTHROPIC_API_KEY` | The key you copied in Phase 1 (`sk-ant-api03-...`) |
| `NEXT_PUBLIC_MULTI_USER` | `false` |

About `NEXT_PUBLIC_MULTI_USER`: setting this to `false` means the app uses the
key you just added for all requests. Set it to `true` only if you're building a
multi-tenant version where each user supplies their own key.

---

## Phase 5 — Deploy

Click **Deploy**. The first build takes about 60–90 seconds.

When it finishes, Vercel shows a preview URL like
`ai-news-agent-xyz.vercel.app`. Click **Visit** to open it.

**Smoke test:**
- Pick a topic (e.g. "Models") and a signal type (e.g. "Latest")
- Click **Generate**
- The agent log should show web searches running, then a digest should appear

If it works, the deployment is complete.

---

## Troubleshooting

**Build failed — module not found**
Run `npm install` locally and push again. A missing `node_modules` entry
sometimes causes this.

**"Invalid API key" error in the app**
The env var wasn't saved correctly. Go to Vercel → Project → Settings →
Environment Variables, verify `ANTHROPIC_API_KEY` is there, then redeploy
(Deployments → the latest one → Redeploy).

**Digest generates but shows no results**
The web search tool (`web_search_20250305`) requires the API key to have web
search enabled. Check that your Anthropic account has access — it's available
on all paid plans.

**The app loads but looks broken**
Check the browser console for errors. A common cause is a missing or misspelled
env var. Vercel logs (Project → Functions tab) show server-side errors.

---

## After deploying

- Share the Vercel URL — it's public by default
- Future pushes to `main` redeploy automatically
- To add a custom domain: Vercel → Project → Settings → Domains
