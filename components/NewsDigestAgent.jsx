"use client";

import { useState, useRef, useEffect } from "react";

// ─── Signal Configurations ────────────────────────────────────────────────────
const SIGNALS = [
  {
    id: "news", label: "Latest", icon: "◈", color: "#e8c547",
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

— 2 stories per topic. Prioritise news from the last 48 hours. Be direct and specific. Always include a real Source line with a working URL from your search results. No filler.`,
    userPrompt: (topics, date) =>
      `Today is ${date}. Generate a news digest covering: ${topics.join(", ")}.`,
  },
  {
    id: "pulse", label: "Pulse", icon: "⚡", color: "#4a9eff",
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

— Search GitHub trending, Hacker News Show HN, recent product launches, fast-moving technical discussions. Find things that weren't on everyone's radar a week ago. Always include a real Source URL. Be exact with names and numbers.`,
    userPrompt: (topics, date) =>
      `Today is ${date}. What's gaining fast traction right now in: ${topics.join(", ")}? Search GitHub trending repos, Hacker News, new product launches, viral technical discussions. Find the signals others haven't caught yet.`,
  },
  {
    id: "longform", label: "Long-form", icon: "◎", color: "#a855f7",
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

— Search substack.com, beehiiv newsletters, and recently shared essays. Always include a real Source URL from your search. Prioritise pieces with real engagement. Be specific about author and publication names. Don't invent articles.`,
    userPrompt: (topics, date) =>
      `Today is ${date}. Find notable Substack articles, newsletters, and long-form essays recently published or getting significant attention on: ${topics.join(", ")}. Search substack.com directly.`,
  },
  {
    id: "research", label: "Research", icon: "◉", color: "#22c55e",
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

— Prioritise papers from the last 30 days. Search arxiv.org directly by topic. Always include a real Source URL. Be specific about who did the research, where, and what the concrete finding was. Don't be vague.`,
    userPrompt: (topics, date) =>
      `Today is ${date}. Find recent research papers, discoveries, and breakthroughs in: ${topics.join(", ")}. Search arxiv.org and academic sources. Focus on work from the last 30 days.`,
  },
  {
    id: "synthesis", label: "Connect", icon: "⬡", color: "#ec4899",
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

— Surface 2–3 threads with 2 evidence points each. Always include real Source URLs. The best threads make someone say: "I hadn't connected those two things, but now I can't unsee it." Find the structural ones.`,
    userPrompt: (topics, date) =>
      `Today is ${date}. Search across all of these topics and find hidden connecting threads and structural patterns between them: ${topics.join(", ")}. What links these domains together in non-obvious ways? What's moving underneath all of them simultaneously?`,
  },
];

// ─── Constants ────────────────────────────────────────────────────────────────
const PRESETS = ["AI", "Technology", "Finance", "Climate", "Geopolitics", "Science", "Health", "Space", "Crypto", "Defence"];
const PALETTE = {
  AI: "#a855f7", Technology: "#4a9eff", Finance: "#e8c547", Climate: "#22c55e",
  Geopolitics: "#ef4444", Science: "#06b6d4", Health: "#ec4899",
  Space: "#8b5cf6", Crypto: "#f97316", Defence: "#94a3b8",
};
const FALLBACKS = ["#e8c547","#4a9eff","#a855f7","#22c55e","#ef4444","#06b6d4"];
const topicColor = (t, i) => PALETTE[t] || FALLBACKS[i % FALLBACKS.length];

// ─── Parser ───────────────────────────────────────────────────────────────────
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
  const [topics, setTopics]           = useState(["AI", "Technology"]);
  const [signalId, setSignalId]       = useState("news");
  const [inputVal, setInputVal]       = useState("");
  const [loading, setLoading]         = useState(false);
  const [sections, setSections]       = useState([]);
  const [steps, setSteps]             = useState([]);
  const [error, setError]             = useState(null);
  const [done, setDone]               = useState(false);
  const [explanations, setExplanations] = useState({});
  const logRef = useRef(null);

  const currentSig = SIGNALS.find(s => s.id === signalId);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [steps]);

  // ── Explain a single story using Haiku (cheap — no web search needed) ──
  const explainStory = async (key, story) => {
    // Toggle off if already visible
    if (explanations[key]?.visible && explanations[key]?.text) {
      setExplanations(p => ({ ...p, [key]: { ...p[key], visible: false } }));
      return;
    }
    // If we already fetched it, just show it
    if (explanations[key]?.text) {
      setExplanations(p => ({ ...p, [key]: { ...p[key], visible: true } }));
      return;
    }
    // Fetch from Haiku — much cheaper than Sonnet, no tools needed
    setExplanations(p => ({ ...p, [key]: { text: "", loading: true, visible: true } }));
    try {
      const res = await fetch("/api/explain", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    headline: story.headline,
    body: story.body.join(" "),
  }),
});
      const data = await res.json();
      const text = data.content?.filter(b => b.type === "text").map(b => b.text).join("") || "Could not generate explanation.";
      setExplanations(p => ({ ...p, [key]: { text, loading: false, visible: true } }));
    } catch {
      setExplanations(p => ({ ...p, [key]: { text: "Could not load explanation.", loading: false, visible: true } }));
    }
  };

  const addTopic = (t) => {
    const s = t.trim().slice(0, 24);
    if (s && !topics.includes(s) && topics.length < 5) setTopics(p => [...p, s]);
    setInputVal("");
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
    <div style={{ minHeight: "100vh", background: "#0c0c0f", color: "#ede9e3", fontFamily: "Georgia, serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,400;1,700&family=IBM+Plex+Mono:wght@400;500&family=Lato:wght@300;400;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #2a2a38; border-radius: 2px; }

        .chip { display:inline-flex; align-items:center; gap:5px; padding:3px 9px; border-radius:2px; cursor:pointer; font-family:'IBM Plex Mono',monospace; font-size:10px; font-weight:500; letter-spacing:0.06em; text-transform:uppercase; transition:opacity 0.15s; }
        .chip:hover { opacity:0.65; }

        .preset { background:transparent; border:1px solid #1e1e28; color:#464658; padding:4px 10px; font-size:10px; font-family:'IBM Plex Mono',monospace; letter-spacing:0.06em; text-transform:uppercase; cursor:pointer; border-radius:2px; transition:all 0.15s; }
        .preset:hover { border-color:#3a3a48; color:#888; }
        .preset.on { border-color:#e8c547; color:#e8c547; background:rgba(232,197,71,0.07); }

        .sig-btn { display:flex; flex-direction:column; align-items:center; gap:4px; padding:9px 8px; border-radius:3px; cursor:pointer; border:1px solid #1a1a22; background:transparent; transition:all 0.18s; flex:1; min-width:0; }
        .sig-btn:hover { border-color:#2a2a38; }
        .sig-btn.active { background:var(--active-bg); border-color:var(--active-border); }

        .gen-btn { width:100%; padding:13px; border:none; border-radius:2px; cursor:pointer; font-family:'IBM Plex Mono',monospace; font-size:11px; font-weight:500; letter-spacing:0.12em; text-transform:uppercase; transition:opacity 0.2s; color:#0c0c0f; }
        .gen-btn:disabled { opacity:0.4; cursor:not-allowed; }
        .gen-btn:not(:disabled):hover { opacity:0.84; }

        .topic-input { background:transparent; border:none; outline:none; color:#ede9e3; font-family:'IBM Plex Mono',monospace; font-size:11px; width:100px; }
        .topic-input::placeholder { color:#2a2a3a; }

        @keyframes fadeUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        .fadein { animation:fadeUp 0.4s ease forwards; opacity:0; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.25} }
        .blink { animation:blink 1.5s ease-in-out infinite; }
        .log-row { display:flex; gap:14px; align-items:baseline; animation:fadeUp 0.14s ease forwards; opacity:0; }

        .story { padding:18px 0; border-bottom:1px solid #14141c; }
        .story:last-child { border-bottom:none; }

        .refresh-btn { background:transparent; border:1px solid #1e1e28; color:#464658; padding:5px 12px; font-family:'IBM Plex Mono',monospace; font-size:9px; letter-spacing:0.08em; text-transform:uppercase; cursor:pointer; border-radius:2px; transition:all 0.15s; }
        .refresh-btn:hover:not(:disabled) { border-color:#3a3a48; color:#888; }
        .refresh-btn:disabled { opacity:0.3; cursor:not-allowed; }
        .headline-link:hover { opacity:0.75; }
        .source-link:hover { opacity:0.7; text-decoration:underline !important; }
        .explain-btn { background:transparent; border:1px solid #1e1e2c; color:#3a3a55; padding:4px 10px; font-family:'IBM Plex Mono',monospace; font-size:9px; letter-spacing:0.08em; cursor:pointer; border-radius:2px; transition:all 0.15s; }
        .explain-btn:hover:not(:disabled) { border-color:#4a9eff44; color:#4a9eff; }
        .explain-btn:disabled { opacity:0.35; cursor:not-allowed; }
      `}</style>

      {/* ── Masthead ── */}
      <div style={{ borderBottom: "1px solid #17172050", padding: "18px 24px 14px" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 900, letterSpacing: "-0.02em", lineHeight: 1 }}>
              THE DIGEST
            </div>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: "#3a3a50", letterSpacing: "0.12em", marginTop: 5, textTransform: "uppercase" }}>
              {currentSig.tagline}
            </div>
          </div>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: "#282838", textAlign: "right", letterSpacing: "0.04em" }}>
            <div>{dateStr}</div>
            <button onClick={() => setApiKey("")}
              style={{ background:"transparent", border:"none", color:"#252535", cursor:"pointer", fontFamily:"'IBM Plex Mono',monospace", fontSize:8, letterSpacing:"0.06em", marginTop:4, padding:0, textDecoration:"underline" }}>
              change key
            </button>
          </div>
        </div>
      </div>

      <div style={{ padding: "20px 24px", maxWidth: 700, margin: "0 auto" }}>

        {/* ── Topics ── */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: "#3d3d50", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8 }}>
            Topics <span style={{ color: "#252535" }}>— up to 5, click to remove</span>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 8, alignItems: "center" }}>
            {topics.map((t, i) => (
              <span key={t} className="chip" title="Click to remove"
                style={{ background: topicColor(t,i)+"18", border:`1px solid ${topicColor(t,i)}40`, color: topicColor(t,i) }}
                onClick={() => removeTopic(t)}>
                {t} <span style={{ opacity:0.4, fontSize:13 }}>×</span>
              </span>
            ))}
            {topics.length < 5 && (
              <span style={{ display:"inline-flex", alignItems:"center", gap:4, padding:"3px 8px", border:"1px dashed #222230", borderRadius:2 }}>
                <input className="topic-input" placeholder="add topic…" value={inputVal}
                  onChange={e => setInputVal(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addTopic(inputVal); }}} />
              </span>
            )}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            {PRESETS.map(p => (
              <button key={p} className={`preset ${topics.includes(p) ? "on" : ""}`}
                onClick={() => topics.includes(p) ? removeTopic(p) : addTopic(p)}>{p}</button>
            ))}
          </div>
        </div>

        {/* ── Signal selector ── */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: "#3d3d50", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8 }}>
            Signal Type
          </div>
          <div style={{ display: "flex", gap: 5 }}>
            {SIGNALS.map(sig => (
              <button key={sig.id} className={`sig-btn ${signalId === sig.id ? "active" : ""}`}
                style={{
                  "--active-bg": sig.color + "12",
                  "--active-border": sig.color + "50",
                }}
                onClick={() => { setSignalId(sig.id); setDone(false); setSections([]); setSteps([]); setError(null); }}>
                <span style={{ fontSize: 14, lineHeight: 1, color: signalId === sig.id ? sig.color : "#333" }}>
                  {sig.icon}
                </span>
                <span style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:9, letterSpacing:"0.06em", textTransform:"uppercase", color: signalId === sig.id ? sig.color : "#424255", whiteSpace:"nowrap" }}>
                  {sig.label}
                </span>
              </button>
            ))}
          </div>
          <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:9, color:"#2a2a3a", marginTop:8, letterSpacing:"0.04em" }}>
            {currentSig.tagline}
          </div>
        </div>

        {/* ── Generate ── */}
        <button className="gen-btn" style={{ background: currentSig.color }}
          onClick={generate} disabled={loading || !topics.length}>
          {loading
            ? <span className="blink">Agent running…</span>
            : done ? `Refresh ${currentSig.label}` : `Generate — ${currentSig.label}`}
        </button>

        {/* ── Agent log ── */}
        {steps.length > 0 && (
          <div style={{ marginTop:12, padding:"10px 14px", background:"#080809", border:"1px solid #141420", borderRadius:2 }}>
            <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:9, color:"#2d2d3a", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:7 }}>
              Agent Log
            </div>
            <div ref={logRef} style={{ display:"flex", flexDirection:"column", gap:4, maxHeight:95, overflowY:"auto" }}>
              {steps.map((s, i) => (
                <div key={i} className="log-row" style={{ animationDelay:`${i*0.04}s` }}>
                  <span style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:9, color:"#252535", flexShrink:0 }}>{s.ts}</span>
                  <span style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:10,
                    color: s.msg.includes("✓") ? "#22c55e" : s.msg.includes("✗") ? "#ef4444" : "#484860" }}>
                    {loading && i === steps.length-1 && !s.msg.includes("✓") && !s.msg.includes("✗")
                      ? <span className="blink">{s.msg}</span> : s.msg}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Error ── */}
        {error && (
          <div style={{ marginTop:12, padding:"12px 14px", background:"#110707", border:"1px solid #220e0e", borderRadius:2 }}>
            <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:10, color:"#ef4444", marginBottom:3 }}>Error</div>
            <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:9, color:"#6a2a2a" }}>{error}</div>
          </div>
        )}

        {/* ── Digest ── */}
        {sections.length > 0 && (
          <div style={{ marginTop:28 }}>
            <div style={{ borderTop:"1px solid #17172050", marginBottom:24 }} />

            {sections.map((sec, si) => (
              <div key={si} className="fadein" style={{ marginBottom:32, animationDelay:`${si*0.1}s` }}>

                {/* Section header */}
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
                  <div style={{ width:3, height:16, background:currentSig.color, borderRadius:1, flexShrink:0 }} />
                  <span style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:10, fontWeight:500, letterSpacing:"0.14em", textTransform:"uppercase", color:currentSig.color }}>
                    {sec.title}
                  </span>
                  <div style={{ flex:1, height:1, background:"#14141c" }} />
                </div>

                {sec.stories.length === 0 && (
                  <p style={{ fontFamily:"'Lato',sans-serif", fontSize:13, color:"#2d2d3a", fontStyle:"italic" }}>
                    No stories parsed — try regenerating.
                  </p>
                )}

                {sec.stories.map((story, si2) => {
                  const expKey = `${si}-${si2}`;
                  const exp = explanations[expKey];
                  return (
                  <div key={si2} className="story">
                    <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:19, fontWeight:700, lineHeight:1.3, color:"#ede9e3", marginBottom: story.source ? 6 : 9, letterSpacing:"-0.01em" }}>
                      {story.source
                        ? <a href={story.source.url} target="_blank" rel="noopener noreferrer"
                            style={{ color:"inherit", textDecoration:"none" }}
                            className="headline-link">{story.headline}</a>
                        : story.headline}
                    </h2>
                    {story.source && (
                      <div style={{ marginBottom:9, display:"flex", alignItems:"center", gap:6 }}>
                        <span style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:8, color:"#2d2d3a", textTransform:"uppercase", letterSpacing:"0.08em" }}>
                          Source
                        </span>
                        <span style={{ width:1, height:10, background:"#232330" }} />
                        <a href={story.source.url} target="_blank" rel="noopener noreferrer"
                          style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:9, color:currentSig.color+"99", textDecoration:"none", letterSpacing:"0.02em" }}
                          className="source-link">
                          {story.source.name} ↗
                        </a>
                      </div>
                    )}
                    <p style={{ fontFamily:"'Lato',sans-serif", fontWeight:300, fontSize:14, lineHeight:1.75, color:"#6a6a82", marginBottom: story.why ? 11 : 0 }}>
                      {story.body.join(" ")}
                    </p>
                    {story.why && (
                      <div style={{ display:"flex", gap:10, alignItems:"flex-start", padding:"7px 12px", background:currentSig.color+"0c", borderLeft:`2px solid ${currentSig.color}38`, borderRadius:"0 2px 2px 0" }}>
                        <span style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:8, color:currentSig.color, textTransform:"uppercase", letterSpacing:"0.1em", flexShrink:0, marginTop:3, fontWeight:500 }}>
                          {currentSig.whyLabel}
                        </span>
                        <span style={{ fontFamily:"'Lato',sans-serif", fontSize:13, color:"#9090aa", lineHeight:1.55 }}>
                          {story.why}
                        </span>
                      </div>
                    )}

                    {/* ── Explain simply button ── */}
                    <div style={{ marginTop:10, display:"flex", justifyContent:"flex-end" }}>
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
                      <div style={{ marginTop:8, padding:"12px 14px", background:"#0f0f14", border:"1px solid #1e1e2a", borderRadius:2, animation:"fadeUp 0.25s ease forwards" }}>
                        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                            <span style={{ fontSize:10 }}>◎</span>
                            <span style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:9, color:"#4a9eff", textTransform:"uppercase", letterSpacing:"0.1em", fontWeight:500 }}>
                              Plain English
                            </span>
                            <span style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:8, color:"#252535", letterSpacing:"0.06em" }}>
                              · Claude Haiku
                            </span>
                          </div>
                        </div>
                        {exp.loading
                          ? <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:10, color:"#333", paddingTop:4 }} className="blink">
                              Generating explanation…
                            </div>
                          : <p style={{ fontFamily:"'Lato',sans-serif", fontSize:14, lineHeight:1.7, color:"#b0b0c8", fontWeight:300 }}>
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
            <div style={{ borderTop:"1px solid #14141c", paddingTop:12, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <span style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:9, color:"#242434", letterSpacing:"0.06em" }}>
                Claude · {currentSig.label} · {new Date().toLocaleTimeString()}
              </span>
              <button className="refresh-btn" onClick={generate} disabled={loading}>
                {loading ? "Running…" : "Refresh"}
              </button>
            </div>
          </div>
        )}

        {/* ── Empty state ── */}
        {!done && !loading && steps.length === 0 && (
          <div style={{ marginTop:44, textAlign:"center" }}>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:15, fontStyle:"italic", color:"#252538", marginBottom:6 }}>
              Pick a signal type and generate your digest
            </div>
            <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:9, color:"#1a1a28", letterSpacing:"0.08em", textTransform:"uppercase" }}>
              Real web searches · Claude analysis · Live
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
