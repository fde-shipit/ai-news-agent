import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});
export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const { headline, body: storyBody } = body;

  if (!headline || typeof headline !== "string" || headline.length > 300) {
    return Response.json({ error: "Invalid input." }, { status: 400 });
  }

  try {
    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 350,
      system: "Explain news stories in plain, friendly language for someone with zero background knowledge. No jargon. Short sentences. One concrete analogy where helpful. 3–4 sentences max. Don't start with 'This article' or 'This story'.",
      messages: [{
        role: "user",
        content: `Explain this simply:\n\n${headline}\n\n${storyBody}`,
      }],
    });

    const text = response.content
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("");

    return Response.json({ text });

  } catch (err) {
    console.error("[explain]", err.message);
    return Response.json({ error: "Could not generate explanation." }, { status: 500 });
  }
}