import Groq from "groq-sdk";

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

export type AgentAction =
  | { action: "STORE_MEMORY"; content: string }
  | { action: "RECALL_MEMORY"; query: string }
  | { action: "ANALYZE_MEMORIES"; query: string }
  | { action: "CHAT"; message: string }
  | { action: "UNKNOWN"; raw: string };

export async function parseIntent(userPrompt: string): Promise<AgentAction> {
  const completion = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: `You are an intent parser for an AI agent.
Convert the user's message into ONLY a valid JSON object with no markdown, no explanation.

The JSON must follow one of these schemas:

1. Store a memory:
{"action": "STORE_MEMORY", "content": "<what to remember>"}

2. Recall a memory:
{"action": "RECALL_MEMORY", "query": "<what to look for>"}

3. Analyze memories:
{"action": "ANALYZE_MEMORIES", "query": "<what to analyze or reason about>"}

4. Normal conversation:
{"action": "CHAT", "message": "<the user's message>"}

5. Unknown:
{"action": "UNKNOWN", "raw": "<original message>"}

Rules:
- If the user says "remember", "save", "store", "note" → STORE_MEMORY
- If the user asks "what", "who", "when", "recall", "do you know" → RECALL_MEMORY
- If the user says "analyze", "summarize", "insights", "patterns", "suggest" → ANALYZE_MEMORIES
- If the user is just chatting, asking questions, or having a conversation → CHAT
- Return ONLY raw JSON. No backticks, no explanation.`,
      },
      {
        role: "user",
        content: userPrompt,
      },
    ],
  });

  const raw = completion.choices[0].message.content ?? "";

  try {
    const cleaned = raw.replace(/```json|```/g, "").trim();
    return JSON.parse(cleaned) as AgentAction;
  } catch {
    return { action: "UNKNOWN", raw: userPrompt };
  }
}