import type { ToolKind } from "./prompts";

export type ChatMsg = { role: "user" | "assistant"; content: string };

export async function streamAI(
  kind: ToolKind,
  messages: ChatMsg[],
  onChunk: (fullText: string) => void,
  signal?: AbortSignal,
): Promise<string> {
  const res = await fetch("/api/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ kind, messages }),
    signal,
  });
  if (!res.ok || !res.body) {
    let msg = `Request failed (${res.status})`;
    try {
      const j = await res.json();
      if (j?.error) msg = j.error;
    } catch {}
    if (res.status === 429) msg = "Too many requests — please wait a moment and try again.";
    if (res.status === 402) msg = "AI credits are exhausted for this workspace.";
    throw new Error(msg);
  }
  const reader = res.body.getReader();
  const dec = new TextDecoder();
  let text = "";
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    text += dec.decode(value, { stream: true });
    onChunk(text);
  }
  if (!text.trim()) throw new Error("The AI returned an empty response. Please try again.");
  return text;
}
