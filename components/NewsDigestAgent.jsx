"use client";

import { useState, useRef, useEffect } from "react";

// ─── Signal Configurations ────────────────────────────────────────────────────
const SIGNALS = [
  {
    id: "news", label: "Latest", icon: "◈",
    tagline: "Top stories breaking right now",
    whyLabel: "Why it matters",
    system: `You are a sharp, authoritative news digest agent. Search for today's most significant stories and write precise, editorial summaries.

For each topic:

## [Topic]

**[Specific compelling headline]**
Source: [Publication Name](https://actual-url.com)
[2–3 precise sentences. Include names, organisations, key figures, dates.]
*Why it matters: [One sentence of genuine insight about significance or consequence.]*

**[Second headline]**
Source: [Publication Name](https://actual-url.com)
[Summary.]
*Why it matters: [Insight.]*

— 2 stories per topic. Prioritise news from the last 48 hours. Be direct and specific. Always include a real Source line with a working URL from your search results. No filler.

Treat each topic as an AI industry vertical. Models = foundation models and labs. Infra = compute, chips, data centres, cloud AI. Regulation = AI policy, safety, governance. Products = AI product launches, integrations, and enterprise tools.`,
    userPrompt: (topics, date) =>
      `Today is ${date}. Generate a news digest covering: ${topics.join(", ")}.`,
  },
  {
    id: "pulse", label: "Pulse", icon: "⚡",
    tagline: "GitHub repos & fast-moving signals gaining traction",
    whyLabel: "Signal",
    system: `You are a signal detection agent tracking what's gaining momentum fast — GitHub repositories exploding in popularity, viral technical discussions, fast-moving product launches, and developments suddenly getting outsized attention.

For each topic:

## [Topic]

**[Exact repo name, tool, project, or development — be specific]**
Source: [GitHub / HN / Site Name](https://actual-url.com)
[2–3 sentences: what it is, what's driving sudden attention, key metrics like star counts or GitHub trending rank if findable. Name the repo owner/org.]
*Signal: [Why this momentum is significant — what it reveals about where the space is heading.]*

**[Second trending item]**
Source: [Site Name](https://actual-url.com)
[Summary.]
*Signal: [Significance.]*

— Search GitHub trending, Hacker News Show HN, recent product launches, fast-moving technical discussions. Find things that weren't on everyone's radar a week ago. Always include a real Source URL. Be exact with names and numbers.

Treat each topic as an AI industry vertical. Models = foundation models and labs. Infra = compute, chips, data centres, cloud AI. Regulation = AI policy, safety, governance. Products = AI product launches, integrations, and enterprise tools.`,
    userPrompt: (topics, date) =>
      `Today is ${date}. What's gaining fast traction right now in: ${topics.join(", ")}? Search GitHub trending repos, Hacker News, new product launches, viral technical discussions. Find the signals others haven't caught yet.`,
  },
  {
    id: "longform", label: "Long-form", icon: "◎",
    tagline: "Substacks & essays worth your time",
    whyLabel: "Key insight",
    system: `You are a curator of high-signal long-form content. Search specifically for notable Substack articles, newsletters, and essays recently published or gaining significant attention on the given topics.

For each topic:

## [Topic]

**[Exact article title — search substack.com for real ones]**
Source: [Author · Publication Name](https://actual-substack-url.com)
[2–3 sentences: the core argument, what makes it worth reading, the key claim being made.]
*Key insight: [The most interesting, counterintuitive, or actionable point. What you'd tell someone who asked "what was in it?"]*

**[Second piece worth reading]**
Source: [Author · Publication Name](https://actual-url.com)
[Summary.]
*Key insight: [Insight.]*

— Search substack.com, beehiiv newsletters, and recently shared essays. Always include a real Source URL from your search. Prioritise pieces with real engagement. Be specific about author and publication names. Don't invent articles.

Treat each topic as an AI industry vertical. Models = foundation models and labs. Infra = compute, chips, data centres, cloud AI. Regulation = AI policy, safety, governance. Products = AI product launches, integrations, and enterprise tools.`,
    userPrompt: (topics, date) =>
      `Today is ${date}. Find notable Substack articles, newsletters, and long-form essays recently published or getting significant attention on: ${topics.join(", ")}. Search substack.com directly.`,
  },
  {
    id: "research", label: "Research", icon: "◉",
    tagline: "Papers, discoveries & breakthroughs",
    whyLabel: "Why it matters",
    system: `You are a research monitoring agent. Search for recent papers, discoveries, studies, and breakthroughs. Look at arxiv.org, Nature, Science, institutional research labs, and academic preprint servers.

For each topic:

## [Topic]

**[Research finding — specific descriptive title, not the paper's abstract title]**
Source: [Institution / Journal](https://arxiv.org/abs/... or actual URL)
[Institution and key researcher names. 2–3 sentences: what was found, how they found it, key results or numbers. Write for a smart non-specialist.]
*Why it matters: [The real-world implication — what this enables, changes, or opens up next.]*

**[Second recent finding]**
Source: [Institution / Journal](https://actual-url.com)
[Summary.]
*Why it matters: [Implication.]*

— Prioritise papers from the last 30 days. Search arxiv.org directly by topic. Always include a real Source URL. Be specific about who did the research, where, and what the concrete finding was. Don't be vague.

Treat each topic as an AI industry vertical. Models = foundation models and labs. Infra = compute, chips, data centres, cloud AI. Regulation = AI policy, safety, governance. Products = AI product launches, integrations, and enterprise tools.`,
    userPrompt: (topics, date) =>
      `Today is ${date}. Find recent research papers, discoveries, and breakthroughs in: ${topics.join(", ")}. Search arxiv.org and academic sources. Focus on work from the last 30 days.`,
  },
  {
    id: "synthesis", label: "Connect", icon: "⬡",
    tagline: "Hidden threads linking your topics together",
    whyLabel: "Why this thread matters",
    system: `You are a synthesis and pattern-recognition agent. Do NOT summarise each topic separately. Instead, search across ALL the given topics simultaneously and find hidden threads, structural patterns, and unexpected connections between them.

Look for: common underlying forces driving multiple domains at once, a technology or idea appearing independently across different fields, an event in one area creating ripple effects in another, contrarian signals that challenge the prevailing narrative across topics, slow-moving structural shifts hiding in plain sight.

Format — your sections are THREADS connecting topics, not topic summaries:

## [Evocative, specific name for the connection]

**[Specific piece of evidence from one topic — a real development you found]**
Source: [Publication / Site](https://actual-url.com)
[2–3 sentences: the development itself and precisely how it connects to another topic in the list. Name both topics explicitly.]
*Why this thread matters: [The implication if this connection is real and deepening — what it means for someone tracking both spaces.]*

**[Second piece of evidence reinforcing the same thread]**
Source: [Publication / Site](https://actual-url.com)
[2–3 sentences: another data point from a different topic that supports this thread.]
*Why this thread matters: [What it changes about how you'd think about the connected topics.]*

— Surface 2–3 threads with 2 evidence points each. Always include real Source URLs. The best threads make someone say: "I hadn't connected those two things, but now I can't unsee it." Find the structural ones.

Treat each topic as an AI industry vertical. Models = foundation models and labs. Infra = compute, chips, data centres, cloud AI. Regulation = AI policy, safety, governance. Products = AI product launches, integrations, and enterprise tools.`,
    userPrompt: (topics, date) =>
      `Today is ${date}. Search across all of these topics and find hidden connecting threads and structural patterns between them: ${topics.join(", ")}. What links these domains together in non-obvious ways? What's moving underneath all of them simultaneously?`,
  },
];

// ─── Constants ────────────────────────────────────────────────────────────────
const PRESETS = ["Models", "Infra", "Regulation", "Products"];
const PALETTE = {
  Models: "#5B8FA8",
  Infra: "#7B9E87",
  Regulation: "#C17B5C",
  Products: "#8B7BA8",
};
const topicColor = (t) => PALETTE[t] || "#308695";

const SIGNAL_DESCRIPTIONS = {
  news:      "Breaking news, last 48 hours. Named sources, key figures, why it matters.",
  pulse:     "What's exploding on GitHub and HN right now. Repos, launches, momentum.",
  longform:  "Substacks and essays worth your time. Arguments, not headlines.",
  research:  "Papers and breakthroughs from arxiv and journals. Last 30 days.",
  synthesis: "Hidden threads linking your topics. Patterns others haven't spotted yet.",
};

// ─── Parser ───────────────────────────────────────────────────────────────────
function parseDigest(text) {
  const sections = [];
  let section = null;
  let story = null;

  for (const raw of text.split("\n")) {
    const line = raw.trim();
    if (!line) continue;

    if (/^#{1,2}\s/.test(line)) {
      if (section) sections.push(section);
      section = { title: line.replace(/^#+\s+(Thread:\s*)?/i, ""), stories: [] };
      story = null;
    } else if (/^\*\*.+\*\*$/.test(line) || /^###\s/.test(line)) {
      story = { headline: line.replace(/^\*\*|\*\*$/g, "").replace(/^###\s/, ""), body: [], why: "", source: null };
      section?.stories.push(story);
    } else if (/^source:/i.test(line) && story) {
      const mdMatch = line.match(/\[([^\]]+)\]\(([^)]+)\)/);
      if (mdMatch) {
        story.source = { name: mdMatch[1], url: mdMatch[2] };
      } else {
        const plainUrl = line.match(/https?:\/\/[^\s]+/);
        if (plainUrl) story.source = { name: "Source", url: plainUrl[0] };
      }
    } else if (/^\*[^*]/.test(line) && /why it matters|key insight|signal:|why this thread/i.test(line)) {
      const val = line.replace(/^\*/, "").replace(/\*$/, "")
        .replace(/^(why (it|this thread) matters|key insight|signal):?\s*/i, "").trim();
      if (story) story.why = val;
    } else if (story) {
      const clean = line.replace(/\*\*/g, "").replace(/^\*(?!\*)|(?<!\*)\*$/g, "");
      if (clean && !/^(why|key insight|signal:|source:)/i.test(clean)) story.body.push(clean);
    }
  }

  if (section) sections.push(section);
  return sections;
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function NewsDigestAgent() {
  const [topics, setTopics]             = useState(["Models", "Products"]);
  const [signalId, setSignalId]         = useState("news");
  const [loading, setLoading]           = useState(false);
  const [sections, setSections]         = useState([]);
  const [steps, setSteps]               = useState([]);
  const [error, setError]               = useState(null);
  const [done, setDone]                 = useState(false);
  const [explanations, setExplanations] = useState({});
  const logRef = useRef(null);

  const currentSig = SIGNALS.find(s => s.id === signalId);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [steps]);

  const explainStory = async (key, story) => {
    if (explanations[key]?.visible && explanations[key]?.text) {
      setExplanations(p => ({ ...p, [key]: { ...p[key], visible: false } }));
      return;
    }
    if (explanations[key]?.text) {
      setExplanations(p => ({ ...p, [key]: { ...p[key], visible: true } }));
      return;
    }
    setExplanations(p => ({ ...p, [key]: { text: "", loading: true, visible: true } }));
    try {
      const res = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ headline: story.headline, body: story.body.join(" ") }),
      });
      const data = await res.json();
      const text = data.text || data.error || "Could not generate explanation.";
      setExplanations(p => ({ ...p, [key]: { text, loading: false, visible: true } }));
    } catch {
      setExplanations(p => ({ ...p, [key]: { text: "Could not load explanation.", loading: false, visible: true } }));
    }
  };

  const addTopic = (t) => {
    const s = t.trim().slice(0, 24);
    if (s && !topics.includes(s) && topics.length < 2) setTopics(p => [...p, s]);
  };
  const removeTopic = (t) => setTopics(p => p.filter(x => x !== t));
  const log = (msg) => setSteps(p => [...p, {
    msg, ts: new Date().toLocaleTimeString("en", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" })
  }]);
  const delay = ms => new Promise(r => setTimeout(r, ms));

  const generate = async () => {
    if (!topics.length || loading) return;
    const sig = currentSig;
    setLoading(true); setSections([]); setSteps([]); setError(null); setDone(false);

    log("Agent starting");
    await delay(250);
    log("Web search tool ready");
    await delay(350);
    log(`Mode: ${sig.label} · ${topics.length} topic${topics.length > 1 ? "s" : ""}`);

    try {
      const date = new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
      const res = await fetch("/api/digest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topics,
          signalSystem: sig.system,
          signalUserPrompt: sig.userPrompt(topics, date),
          signalLabel: sig.label,
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error?.message || `HTTP ${res.status}`);
      const data = await res.json();

      const searches = data.content.filter(b => b.type === "tool_use").length;
      if (searches) log(`${searches} web search${searches > 1 ? "es" : ""} complete`);

      const text = data.content.filter(b => b.type === "text").map(b => b.text).join("\n");
      log("Formatting digest…");
      await delay(120);

      setSections(parseDigest(text));
      setDone(true);
      log("Done ✓");
    } catch (e) {
      setError(e.message);
      log(`✗ ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const dateStr = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });

  return (
    <div style={{ minHeight: "100vh", background: "var(--paper)", color: "var(--ink)", fontFamily: "var(--font-body), sans-serif" }}>
      <style>{`
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: var(--pale); border-radius: 2px; }

        .chip { display:inline-flex; align-items:center; gap:5px; padding:3px 9px; cursor:pointer; font-family:var(--font-mono),monospace; font-size:0.6rem; font-weight:500; letter-spacing:0.06em; text-transform:uppercase; transition:opacity 0.15s; }
        .chip:hover { opacity:0.65; }

        .preset { background:transparent; border:1px solid var(--rule); color:var(--warm); padding:4px 10px; font-size:0.6rem; font-family:var(--font-mono),monospace; letter-spacing:0.06em; text-transform:uppercase; cursor:pointer; transition:all 0.15s; }
        .preset:hover { border-color:var(--rule-strong); color:var(--ink-soft); }
        .preset.on { border-color:var(--accent); color:var(--accent); background:color-mix(in srgb, var(--accent) 7%, transparent); }

        .sig-btn { display:flex; flex-direction:column; align-items:center; gap:4px; padding:9px 8px; cursor:pointer; border:1px solid var(--rule); background:transparent; transition:all 0.18s; flex:1; min-width:0; }
        .sig-btn:hover { border-color:var(--rule-strong); }
        .sig-btn.active { background:color-mix(in srgb, var(--accent) 8%, transparent); border-color:color-mix(in srgb, var(--accent) 40%, transparent); }

        .gen-btn { width:100%; padding:13px; border:none; cursor:pointer; font-family:var(--font-mono),monospace; font-size:0.69rem; font-weight:500; letter-spacing:0.12em; text-transform:uppercase; transition:opacity 0.2s; color:var(--paper); background:var(--accent); }
        .gen-btn:disabled { opacity:0.4; cursor:not-allowed; }
        .gen-btn:not(:disabled):hover { opacity:0.84; }

@keyframes fadeUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        .fadein { animation:fadeUp 0.4s ease forwards; opacity:0; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.25} }
        .blink { animation:blink 1.5s ease-in-out infinite; }
        .log-row { display:flex; gap:14px; align-items:baseline; animation:fadeUp 0.14s ease forwards; opacity:0; }

        .story { padding:1.125rem 0; border-bottom:1px solid var(--rule); }
        .story:last-child { border-bottom:none; }

        .refresh-btn { background:transparent; border:1px solid var(--rule); color:var(--warm); padding:5px 12px; font-family:var(--font-mono),monospace; font-size:0.56rem; letter-spacing:0.08em; text-transform:uppercase; cursor:pointer; transition:all 0.15s; }
        .refresh-btn:hover:not(:disabled) { border-color:var(--rule-strong); color:var(--ink-soft); }
        .refresh-btn:disabled { opacity:0.3; cursor:not-allowed; }
        .headline-link:hover { opacity:0.75; }
        .source-link:hover { opacity:0.7; text-decoration:underline !important; }
        .explain-btn { background:transparent; border:1px solid var(--rule); color:var(--warm); padding:4px 10px; font-family:var(--font-mono),monospace; font-size:0.56rem; letter-spacing:0.08em; cursor:pointer; transition:all 0.15s; }
        .explain-btn:hover:not(:disabled) { border-color:color-mix(in srgb, var(--accent) 40%, transparent); color:var(--accent); }
        .explain-btn:disabled { opacity:0.35; cursor:not-allowed; }
      `}</style>

      {/* ── Masthead ── */}
      <div style={{ borderBottom: "1px solid var(--rule)", padding: "1.125rem 1.5rem 0.875rem" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <div style={{ fontFamily: "var(--font-heading), serif", fontSize: "1.75rem", fontWeight: 300, letterSpacing: "-0.01em", lineHeight: 1 }}>
              The Digest
            </div>
            <div style={{ fontFamily: "var(--font-mono), monospace", fontSize: "0.56rem", color: "var(--warm)", letterSpacing: "0.12em", marginTop: 5, textTransform: "uppercase" }}>
              {currentSig.tagline}
            </div>
          </div>
          <div style={{ fontFamily: "var(--font-mono), monospace", fontSize: "0.56rem", color: "var(--warm)", textAlign: "right", letterSpacing: "0.04em" }}>
            <div>{dateStr}</div>
          </div>
        </div>
      </div>

      <div style={{ padding: "1.25rem 1.5rem", maxWidth: 700, margin: "0 auto" }}>

        {/* ── Topics ── */}
        <div style={{ marginBottom: "1rem" }}>
          <div style={{ fontFamily: "var(--font-mono), monospace", fontSize: "0.56rem", color: "var(--warm)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.5rem" }}>
            Topics <span style={{ color: "var(--pale)" }}>— up to 2, click to remove</span>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: "0.5rem", alignItems: "center" }}>
            {topics.map((t) => (
              <span key={t} className="chip" title="Click to remove"
                style={{ background: `${topicColor(t)}18`, border: `1px solid ${topicColor(t)}55`, color: topicColor(t) }}
                onClick={() => removeTopic(t)}>
                {t} <span style={{ opacity: 0.4, fontSize: 13 }}>×</span>
              </span>
            ))}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            {PRESETS.map(p => (
              <button key={p} className={`preset ${topics.includes(p) ? "on" : ""}`}
                onClick={() => topics.includes(p) ? removeTopic(p) : addTopic(p)}>{p}</button>
            ))}
          </div>
        </div>

        {/* ── Signal selector ── */}
        <div style={{ marginBottom: "1rem" }}>
          <div style={{ fontFamily: "var(--font-mono), monospace", fontSize: "0.56rem", color: "var(--warm)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.5rem" }}>
            Signal Type
          </div>
          <div style={{ display: "flex", gap: 5 }}>
            {SIGNALS.map(sig => (
              <button key={sig.id} className={`sig-btn ${signalId === sig.id ? "active" : ""}`}
                onClick={() => { setSignalId(sig.id); setDone(false); setSections([]); setSteps([]); setError(null); }}>
                <span style={{ fontSize: 14, lineHeight: 1, color: signalId === sig.id ? "var(--accent)" : "var(--warm)" }}>
                  {sig.icon}
                </span>
                <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: "0.56rem", letterSpacing: "0.06em", textTransform: "uppercase", color: signalId === sig.id ? "var(--accent)" : "var(--warm)", whiteSpace: "nowrap" }}>
                  {sig.label}
                </span>
              </button>
            ))}
          </div>
          <div style={{ fontFamily: "var(--font-mono), monospace", fontSize: "0.56rem", color: "var(--warm)", marginTop: "0.5rem", letterSpacing: "0.04em" }}>
            {SIGNAL_DESCRIPTIONS[signalId]}
          </div>
        </div>

        {/* ── Generate ── */}
        <button className="gen-btn" onClick={generate} disabled={loading || !topics.length}>
          {loading
            ? <span className="blink">Agent running…</span>
            : done ? `Refresh ${currentSig.label}` : `Generate — ${currentSig.label}`}
        </button>

        {/* ── Agent log ── */}
        {steps.length > 0 && (
          <div style={{ marginTop: "0.75rem", padding: "10px 14px", background: "var(--paper-2)", border: "1px solid var(--rule)" }}>
            <div style={{ fontFamily: "var(--font-mono), monospace", fontSize: "0.56rem", color: "var(--warm)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 7 }}>
              Agent Log
            </div>
            <div ref={logRef} style={{ display: "flex", flexDirection: "column", gap: 4, maxHeight: 95, overflowY: "auto" }}>
              {steps.map((s, i) => (
                <div key={i} className="log-row" style={{ animationDelay: `${i * 0.04}s` }}>
                  <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: "0.56rem", color: "var(--warm)", flexShrink: 0 }}>{s.ts}</span>
                  <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: "0.625rem",
                    color: s.msg.includes("✓") ? "var(--accent)" : s.msg.includes("✗") ? "var(--accent-rare)" : "var(--ink-soft)" }}>
                    {loading && i === steps.length - 1 && !s.msg.includes("✓") && !s.msg.includes("✗")
                      ? <span className="blink">{s.msg}</span> : s.msg}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Error ── */}
        {error && (
          <div style={{ marginTop: "0.75rem", padding: "12px 14px", background: "color-mix(in srgb, var(--accent-rare) 6%, transparent)", border: "1px solid color-mix(in srgb, var(--accent-rare) 20%, transparent)" }}>
            <div style={{ fontFamily: "var(--font-mono), monospace", fontSize: "0.625rem", color: "var(--accent-rare)", marginBottom: 3 }}>Error</div>
            <div style={{ fontFamily: "var(--font-mono), monospace", fontSize: "0.56rem", color: "var(--accent-rare)", opacity: 0.8 }}>{error}</div>
          </div>
        )}

        {/* ── Digest ── */}
        {sections.length > 0 && (
          <div style={{ marginTop: "1.75rem" }}>
            <div style={{ borderTop: "1px solid var(--rule)", marginBottom: "1.5rem" }} />

            {sections.map((sec, si) => (
              <div key={si} className="fadein" style={{ marginBottom: "2rem", animationDelay: `${si * 0.1}s` }}>

                {/* Section header */}
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                  <div style={{ width: 3, height: 16, background: "var(--accent)", flexShrink: 0 }} />
                  <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: "0.625rem", fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--accent)" }}>
                    {sec.title}
                  </span>
                  <div style={{ flex: 1, height: 1, background: "var(--rule)" }} />
                </div>

                {sec.stories.length === 0 && (
                  <p style={{ fontFamily: "var(--font-body), sans-serif", fontSize: "0.8125rem", color: "var(--warm)", fontStyle: "italic" }}>
                    No stories parsed — try regenerating.
                  </p>
                )}

                {sec.stories.map((story, si2) => {
                  const expKey = `${si}-${si2}`;
                  const exp = explanations[expKey];
                  return (
                    <div key={si2} className="story">
                      <h2 style={{ fontFamily: "var(--font-heading), serif", fontSize: "1.19rem", fontWeight: 600, lineHeight: 1.3, color: "var(--ink)", marginBottom: story.source ? "0.375rem" : "0.5625rem", letterSpacing: "-0.01em" }}>
                        {story.source
                          ? <a href={story.source.url} target="_blank" rel="noopener noreferrer"
                              style={{ color: "inherit", textDecoration: "none" }}
                              className="headline-link">{story.headline}</a>
                          : story.headline}
                      </h2>
                      {story.source && (
                        <div style={{ marginBottom: "0.5625rem", display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: "0.5rem", color: "var(--warm)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                            Source
                          </span>
                          <span style={{ width: 1, height: 10, background: "var(--rule)" }} />
                          <a href={story.source.url} target="_blank" rel="noopener noreferrer"
                            style={{ fontFamily: "var(--font-mono), monospace", fontSize: "0.56rem", color: "var(--accent)", textDecoration: "none", letterSpacing: "0.02em" }}
                            className="source-link">
                            {story.source.name} ↗
                          </a>
                        </div>
                      )}
                      <p style={{ fontFamily: "var(--font-body), sans-serif", fontWeight: 300, fontSize: "0.875rem", lineHeight: 1.75, color: "var(--warm)", marginBottom: story.why ? "0.6875rem" : 0 }}>
                        {story.body.join(" ")}
                      </p>
                      {story.why && (
                        <div style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "7px 12px", background: "color-mix(in srgb, var(--accent) 6%, transparent)", borderLeft: "2px solid color-mix(in srgb, var(--accent) 30%, transparent)" }}>
                          <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: "0.5rem", color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.1em", flexShrink: 0, marginTop: 3, fontWeight: 500 }}>
                            {currentSig.whyLabel}
                          </span>
                          <span style={{ fontFamily: "var(--font-body), sans-serif", fontSize: "0.8125rem", color: "var(--ink-soft)", lineHeight: 1.55 }}>
                            {story.why}
                          </span>
                        </div>
                      )}

                      {/* ── Explain simply ── */}
                      <div style={{ marginTop: "0.625rem", display: "flex", justifyContent: "flex-end" }}>
                        <button className="explain-btn"
                          onClick={() => explainStory(expKey, story)}
                          disabled={exp?.loading}>
                          {exp?.loading
                            ? <span className="blink">thinking…</span>
                            : exp?.visible && exp?.text
                              ? "▲ hide explanation"
                              : "◎ explain simply"}
                        </button>
                      </div>

                      {/* ── Explanation panel ── */}
                      {exp?.visible && (
                        <div style={{ marginTop: "0.5rem", padding: "12px 14px", background: "var(--paper-2)", border: "1px solid var(--rule)", animation: "fadeUp 0.25s ease forwards" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                            <span style={{ fontSize: 10 }}>◎</span>
                            <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: "0.56rem", color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 500 }}>
                              Plain English
                            </span>
                            <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: "0.5rem", color: "var(--warm)", letterSpacing: "0.06em" }}>
                              · Claude Haiku
                            </span>
                          </div>
                          {exp.loading
                            ? <div style={{ fontFamily: "var(--font-mono), monospace", fontSize: "0.625rem", color: "var(--warm)", paddingTop: 4 }} className="blink">
                                Generating explanation…
                              </div>
                            : <p style={{ fontFamily: "var(--font-body), sans-serif", fontSize: "0.875rem", lineHeight: 1.7, color: "var(--ink-soft)", fontWeight: 300 }}>
                                {exp.text}
                              </p>}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}

            {/* Footer */}
            <div style={{ borderTop: "1px solid var(--rule)", paddingTop: "0.75rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: "0.56rem", color: "var(--warm)", letterSpacing: "0.06em" }}>
                  Claude · {currentSig.label} · {new Date().toLocaleTimeString()}
                  <a href="https://github.com/fde-shipit/ai-news-agent" target="_blank" rel="noopener noreferrer"
                    style={{ color: "var(--warm)", textDecoration: "none", marginLeft: 14, opacity: 0.5 }}>
                    github.com/fde-shipit/ai-news-agent ↗
                  </a>
                </span>
                <button className="refresh-btn" onClick={generate} disabled={loading}>
                  {loading ? "Running…" : "Refresh"}
                </button>
              </div>
              <p style={{ fontFamily: "var(--font-mono), monospace", fontSize: "0.56rem", color: "var(--warm)", letterSpacing: "0.04em", opacity: 0.6, lineHeight: 1.5 }}>
                Some sources — including paywalled publications and LinkedIn — cannot be accessed directly. Results reflect what&apos;s publicly available.
              </p>
            </div>
          </div>
        )}

        {/* ── Empty state ── */}
        {!done && !loading && steps.length === 0 && (
          <div style={{ marginTop: "2.75rem", textAlign: "center" }}>
            <div style={{ fontFamily: "var(--font-heading), serif", fontSize: "0.94rem", fontStyle: "italic", color: "var(--warm)", marginBottom: 6 }}>
              Pick a signal type and generate your digest
            </div>
            <div style={{ fontFamily: "var(--font-mono), monospace", fontSize: "0.56rem", color: "var(--pale)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Real web searches · Claude analysis · Live
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
