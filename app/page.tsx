"use client";

import { useState, useRef, useEffect } from "react";

type Message = {
  role: "user" | "agent";
  text: string;
  action?: string;
};

const ACTION_COLORS: Record<string, string> = {
  STORE_MEMORY: "text-green-400",
  RECALL_MEMORY: "text-blue-400",
  ANALYZE_MEMORIES: "text-purple-400",
  UNKNOWN: "text-zinc-400",
};

const ACTION_LABELS: Record<string, string> = {
  STORE_MEMORY: "⟢ Stored on 0G",
  RECALL_MEMORY: "⟢ Retrieved from 0G",
  ANALYZE_MEMORIES: "⟢ Analyzed via 0G Compute",
  UNKNOWN: "⟢ Unknown",
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "agent",
      text: "Hey, I'm AgentZero — your AI with decentralized memory. Tell me something to remember, ask what I know, or say 'analyze my memories'.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage() {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
    setLoading(true);

    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "agent",
          text: data.message,
          action: data.action,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "agent", text: "Something went wrong. Try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white flex flex-col">
      {/* Header */}
      <div className="border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold">
            A
          </div>
          <div>
            <h1 className="text-sm font-semibold">AgentZero</h1>
            <p className="text-xs text-zinc-500">Powered by 0G decentralized infrastructure</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <span className="text-xs text-zinc-400">0G Testnet</span>
        </div>
      </div>

      {/* Chat */}
      <div className="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-4 max-w-3xl w-full mx-auto">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div className={`max-w-[80%] flex flex-col gap-1`}>
              {msg.action && (
                <span className={`text-xs ${ACTION_COLORS[msg.action]} font-mono`}>
                  {ACTION_LABELS[msg.action]}
                </span>
              )}
              <div
                className={`rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white rounded-br-sm"
                    : "bg-zinc-800 text-zinc-100 rounded-bl-sm"
                }`}
              >
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-zinc-800 rounded-2xl rounded-bl-sm px-4 py-3">
              <div className="flex gap-1 items-center">
                <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:0ms]"></div>
                <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:150ms]"></div>
                <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:300ms]"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-zinc-800 px-4 py-4">
        <div className="max-w-3xl mx-auto flex gap-2">
          <input
            className="flex-1 bg-zinc-800 text-white rounded-xl px-4 py-3 text-sm outline-none placeholder-zinc-500 focus:ring-1 focus:ring-blue-600"
            placeholder="Remember something, ask what I know, or analyze your memories..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl text-sm font-medium disabled:opacity-50 transition-colors"
          >
            Send
          </button>
        </div>
        <p className="text-center text-xs text-zinc-600 mt-2">
          Memories stored permanently on 0G decentralized storage
        </p>
      </div>
    </main>
  );
}