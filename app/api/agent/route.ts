import { NextRequest, NextResponse } from "next/server";
import { parseIntent } from "@/app/lib/intentParser";
import { storeMemory, recallMemories, Memory } from "@/app/lib/storage";
import { analyzeMemories } from "@/app/lib/compute";

const AGENT_ID = "agent-zero-001";

export async function POST(req: NextRequest) {
  const { message } = await req.json();

  if (!message) {
    return NextResponse.json({ error: "No message provided" }, { status: 400 });
  }

  const intent = await parseIntent(message);

  switch (intent.action) {
    case "STORE_MEMORY": {
      const memory: Memory = {
        agentId: AGENT_ID,
        content: intent.content,
        timestamp: new Date().toISOString(),
        type: "memory",
      };

      try {
        const rootHash = await storeMemory(memory);
        return NextResponse.json({
          action: "STORE_MEMORY",
          message: `Memory stored on 0G. Root hash: ${rootHash.slice(0, 20)}...`,
          rootHash,
        });
      } catch (err) {
        return NextResponse.json({
          action: "STORE_MEMORY",
          message: `Failed to store memory: ${err}`,
        });
      }
    }

    case "RECALL_MEMORY": {
      const memories = await recallMemories(AGENT_ID);
      if (memories.length === 0) {
        return NextResponse.json({
          action: "RECALL_MEMORY",
          message: "I don't have any memories yet. Tell me something to remember!",
        });
      }
      return NextResponse.json({
        action: "RECALL_MEMORY",
        message: `Here's what I remember:\n${memories.map((m) => m.content).join("\n")}`,
        memories,
      });
    }

    case "ANALYZE_MEMORIES": {
      const memories = await recallMemories(AGENT_ID);
      if (memories.length === 0) {
        return NextResponse.json({
          action: "ANALYZE_MEMORIES",
          message: "No memories to analyze yet. Tell me something first!",
        });
      }

      try {
        const analysis = await analyzeMemories(
          memories.map((m) => m.content),
          intent.query
        );
        return NextResponse.json({
          action: "ANALYZE_MEMORIES",
          message: analysis,
        });
      } catch (err) {
        return NextResponse.json({
          action: "ANALYZE_MEMORIES",
          message: `Analysis failed: ${err}`,
        });
      }
    }

    case "UNKNOWN":
    default:
      return NextResponse.json({
        action: "UNKNOWN",
        message: "I'm not sure what you mean. Try telling me to remember something, or ask me what you've told me.",
      });
  }
}