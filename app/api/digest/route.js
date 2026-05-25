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

  const { topics, signalSystem, signalUserPrompt } = body;

  if (
    !Array.isArray(topics) ||
    topics.length === 0 ||
    topics.length > 5 ||
    topics.some((t) => typeof t !== "string" || t.length > 30)
  ) {
    return Response.json({ error: "Invalid topics." }, { status: 400 });
  }

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 3500,
      tools: [{ type: "web_search_20250305", name: "web_search" }],
      system: signalSystem,
      messages: [{ role: "user", content: signalUserPrompt }],
    });

    return Response.json({ content: response.content });

  } catch (err) {
    console.error("[digest]", err.message);
    return Response.json({ error: "Something went wrong." }, { status: 500 });
  }
}