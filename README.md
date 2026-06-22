# AgentZero

An AI agent with persistent decentralized memory, powered by 0G infrastructure.

## What it does

AgentZero is an AI companion that remembers everything you tell it — permanently, on decentralized storage. Unlike ChatGPT which stores your data on OpenAI's servers, AgentZero owns its memory on 0G's decentralized network.

- **Remember** → stores your memory on 0G Storage (real on-chain transaction)
- **Recall** → retrieves memories from 0G Storage
- **Analyze** → runs reasoning via 0G Compute to surface insights and patterns

## How 0G does real work

| Feature | 0G Service |
|---|---|
| Store memory | 0G Storage — every memory is a real blockchain tx |
| Recall memory | 0G Storage — retrieved by root hash |
| Analyze memories | 0G Compute — decentralized AI inference |

## Architecture

## Stack

- Next.js 16 + TypeScript
- 0G Storage SDK (@0gfoundation/0g-storage-ts-sdk)
- 0G Compute SDK (@0gfoundation/0g-compute-ts-sdk)
- Groq (intent parsing + fallback inference)
- Ethers.js

## Setup

1. Clone the repo
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env` and fill in your keys
4. Run: `npm run dev`

## Environment Variables

WALLET_PRIVATE_KEY=your_wallet_private_key_here
GROQ_API_KEY=your_groq_api_key_here

## Demo

1. Type: `Remember that I'm building a climate startup`
2. Type: `What do you know about me?`
3. Type: `Analyze my memories and give me insights`

## Roadmap

### Next Features
- **Agentic ID (ERC-7857)** — Mint an on-chain identity for the agent. Every AgentZero instance becomes a tradeable, transferable Intelligent NFT. The agent's memory and intelligence move with the NFT when ownership changes.
- **Wallet Connection** — Let users connect their own MetaMask wallet so they pay their own storage fees instead of a shared wallet.
- **Persistent Memory Across Sessions** — Currently memories reset on server restart. Next step is querying 0G Storage directly by wallet address to load memories across sessions.
- **Multi-user Support** — Each wallet address gets its own agent with isolated memory.
- **0G Compute (Full Integration)** — Switch analysis fully to 0G Compute once testnet faucet limits are resolved.

### Vision
AgentZero is the foundation for a new kind of AI — one that owns its identity, memory, and intelligence on decentralized infrastructure. No company controls it. No server can delete it. The user owns it completely.