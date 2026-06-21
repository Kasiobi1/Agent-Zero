import Groq from "groq-sdk";

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

export async function analyzeMemories(
  memories: string[],
  query: string
): Promise<string> {
  const memoryContext = memories.join("\n");

  const completion = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: `You are an AI agent analyzing a user's stored memories.
Be concise, insightful, and helpful. Identify patterns and give actionable insights.`,
      },
      {
        role: "user",
        content: `Here are my stored memories:\n${memoryContext}\n\nQuery: ${query}`,
      },
    ],
  });

  return completion.choices[0].message.content ?? "No response.";
}