import { MemData, Indexer } from "@0gfoundation/0g-storage-ts-sdk";
import { ethers } from "ethers";

const INDEXER_RPC = "https://indexer-storage-testnet-turbo.0g.ai";
const EVM_RPC = "https://evmrpc-testnet.0g.ai";
const PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY!;

export interface Memory {
  agentId: string;
  content: string;
  timestamp: string;
  type: "memory" | "analysis";
}

declare global {
  var __memoryIndex: Record<string, Memory[]> | undefined;
}

export async function storeMemory(memory: Memory): Promise<string> {
  const provider = new ethers.JsonRpcProvider(EVM_RPC);
  const signer = new ethers.Wallet(PRIVATE_KEY, provider);

  const content = JSON.stringify(memory);
  const data = new MemData(new TextEncoder().encode(content));
  const indexer = new Indexer(INDEXER_RPC);
  const [tx, err] = await indexer.upload(data, EVM_RPC, signer as any);

  if (err) throw new Error(`Upload error: ${err}`);

  const rootHash = "rootHash" in tx ? tx.rootHash : tx.rootHashes[0];

  if (!global.__memoryIndex) global.__memoryIndex = {};
  if (!global.__memoryIndex[memory.agentId]) {
    global.__memoryIndex[memory.agentId] = [];
  }
  global.__memoryIndex[memory.agentId].push(memory);

  return rootHash;
}

export async function recallMemories(agentId: string): Promise<Memory[]> {
  return global.__memoryIndex?.[agentId] ?? [];
}