import { CHAT_SYSTEM_PROMPT } from "@/lib/chatPrompt";

// Server-side proxy to Groq so the API key never ships in the browser bundle.
// Prefers GROQ_API_KEY; falls back to the old NEXT_PUBLIC_ name so existing
// deployments keep working until the env var is renamed.
const MAX_MESSAGES = 12;
const MAX_CHARS = 1000;

export async function POST(request) {
  const apiKey = process.env.GROQ_API_KEY || process.env.NEXT_PUBLIC_GROQ_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "Chat is not configured" }, { status: 503 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const messages = Array.isArray(body?.messages) ? body.messages : [];
  const cleaned = messages
    .filter((m) => (m?.role === "user" || m?.role === "assistant") && typeof m.content === "string")
    .slice(-MAX_MESSAGES)
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_CHARS) }));

  if (!cleaned.length || cleaned[cleaned.length - 1].role !== "user") {
    return Response.json({ error: "Last message must be from the user" }, { status: 400 });
  }

  try {
    const groq = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [{ role: "system", content: CHAT_SYSTEM_PROMPT }, ...cleaned],
        temperature: 0.7,
        max_tokens: 300,
      }),
    });

    if (!groq.ok) {
      console.error("Groq request failed:", groq.status, await groq.text());
      return Response.json({ error: "Upstream error" }, { status: 502 });
    }

    const data = await groq.json();
    return Response.json({ reply: data.choices?.[0]?.message?.content ?? "" });
  } catch (error) {
    console.error("Chat route error:", error);
    return Response.json({ error: "Upstream error" }, { status: 502 });
  }
}
