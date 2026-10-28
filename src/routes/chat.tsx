import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { BrainCircuit, Check, Pencil, Send, Square, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { streamAI, type ChatMsg } from "@/lib/ai/client";
import { Disclaimer } from "@/components/Disclaimer";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Chat — Clarity" },
      { name: "description", content: "Chat with an AI workplace assistant for quick help." },
      { property: "og:title", content: "AI Chat — Clarity" },
      { property: "og:description", content: "Chat with an AI workplace assistant for quick help." },
    ],
  }),
  component: ChatPage,
});

const STARTERS = [
  "How do I give constructive feedback to a colleague?",
  "Draft an agenda for a 30-min kickoff meeting",
  "Explain OKRs in simple terms",
];

function ChatPage() {
  const [msgs, setMsgs] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), [msgs]);

  async function send(text: string) {
    if (!text.trim() || loading) return;
    const history: ChatMsg[] = [...msgs, { role: "user", content: text.trim() }];
    setMsgs([...history, { role: "assistant", content: "" }]);
    setInput("");
    setLoading(true);
    const ac = new AbortController();
    abortRef.current = ac;
    try {
      await streamAI(
        "chat",
        history,
        (t) => setMsgs([...history, { role: "assistant", content: t }]),
        ac.signal,
      );
    } catch (e) {
      if ((e as Error).name !== "AbortError") {
        toast.error((e as Error).message);
        setMsgs(history);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex h-[calc(100svh-3.5rem)] max-w-4xl flex-col p-4 md:p-6">
      <div className="mb-3 flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold tracking-tight">AI Chat</h1>
        <Button variant="ghost" size="sm" disabled={!msgs.length || loading} onClick={() => setMsgs([])}>
          <Trash2 /> Clear
        </Button>
      </div>
      <div className="flex-1 space-y-5 overflow-y-auto pb-4">
        {msgs.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <BrainCircuit className="h-7 w-7" />
            </div>
            <p className="text-muted-foreground">How can I help with your work today?</p>
            <div className="flex flex-wrap justify-center gap-2">
              {STARTERS.map((s) => (
                <button key={s} onClick={() => send(s)} className="rounded-full border bg-card px-3 py-1.5 text-sm hover:border-primary/50">
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
        {msgs.map((m, i) =>
          m.role === "user" ? (
            <div key={i} className="flex justify-end">
              <div className="max-w-[80%] rounded-2xl rounded-br-sm bg-primary px-4 py-2.5 text-primary-foreground">
                {m.content}
              </div>
            </div>
          ) : (
            <div key={i} className="group flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <BrainCircuit className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                {editIdx === i ? (
                  <div className="space-y-2">
                    <Textarea
                      value={m.content}
                      rows={8}
                      onChange={(e) =>
                        setMsgs((prev) => prev.map((x, j) => (j === i ? { ...x, content: e.target.value } : x)))
                      }
                    />
                    <Button size="sm" onClick={() => setEditIdx(null)}>
                      <Check /> Done
                    </Button>
                  </div>
                ) : m.content ? (
                  <>
                    <div className="prose-output">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.content}</ReactMarkdown>
                    </div>
                    {!(loading && i === msgs.length - 1) && (
                      <button
                        onClick={() => setEditIdx(i)}
                        className="mt-1 flex items-center gap-1 text-xs text-muted-foreground opacity-0 transition-opacity hover:text-foreground group-hover:opacity-100"
                      >
                        <Pencil className="h-3 w-3" /> Edit
                      </button>
                    )}
                  </>
                ) : (
                  <div className="flex gap-1 pt-3">
                    {[0, 1, 2].map((d) => (
                      <span key={d} className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/50" style={{ animationDelay: `${d * 150}ms` }} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          ),
        )}
        <div ref={endRef} />
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="flex items-end gap-2 rounded-2xl border bg-card p-2 shadow-soft"
      >
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send(input);
            }
          }}
          rows={1}
          placeholder="Message Clarity…"
          className="max-h-40 min-h-10 resize-none border-0 shadow-none focus-visible:ring-0"
        />
        {loading ? (
          <Button type="button" size="icon" variant="outline" onClick={() => abortRef.current?.abort()} aria-label="Stop">
            <Square />
          </Button>
        ) : (
          <Button type="submit" size="icon" disabled={!input.trim()} aria-label="Send">
            <Send />
          </Button>
        )}
      </form>
      <div className="mt-3">
        <Disclaimer />
      </div>
    </div>
  );
}
