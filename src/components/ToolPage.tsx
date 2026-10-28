import { useRef, useState, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import { Copy, Eye, Loader2, Pencil, RotateCcw, Square, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { streamAI } from "@/lib/ai/client";
import type { ToolKind } from "@/lib/ai/prompts";
import { Disclaimer } from "./Disclaimer";

export function ToolPage({
  kind,
  title,
  subtitle,
  icon,
  form,
  buildPrompt,
  canSubmit,
}: {
  kind: ToolKind;
  title: string;
  subtitle: string;
  icon: ReactNode;
  form: ReactNode;
  buildPrompt: () => string;
  canSubmit: boolean;
}) {
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  async function run() {
    setLoading(true);
    setEditing(false);
    setOutput("");
    const ac = new AbortController();
    abortRef.current = ac;
    try {
      await streamAI(kind, [{ role: "user", content: buildPrompt() }], setOutput, ac.signal);
    } catch (e) {
      if ((e as Error).name !== "AbortError") toast.error((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 md:p-8">
      <header className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          {icon}
        </div>
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">{title}</h1>
          <p className="text-muted-foreground">{subtitle}</p>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <Card className="space-y-4 p-5 shadow-soft">
          {form}
          <div className="flex gap-2">
            <Button className="flex-1" onClick={run} disabled={!canSubmit || loading}>
              {loading ? <Loader2 className="animate-spin" /> : <Wand2 />}
              {loading ? "Generating…" : "Generate"}
            </Button>
            {loading && (
              <Button variant="outline" onClick={() => abortRef.current?.abort()} aria-label="Stop">
                <Square />
              </Button>
            )}
          </div>
        </Card>

        <Card className="flex min-h-[420px] flex-col p-0 shadow-soft">
          <div className="flex items-center justify-between border-b px-5 py-3">
            <span className="text-sm font-medium">AI output</span>
            <div className="flex gap-1">
              <Button size="sm" variant="ghost" disabled={!output || loading} onClick={() => setEditing((v) => !v)}>
                {editing ? <Eye /> : <Pencil />}
                {editing ? "Preview" : "Edit"}
              </Button>
              <Button size="sm" variant="ghost" disabled={!output || loading} onClick={run}>
                <RotateCcw /> Regenerate
              </Button>
              <Button
                size="sm"
                variant="ghost"
                disabled={!output}
                onClick={() => {
                  navigator.clipboard.writeText(output);
                  toast.success("Copied to clipboard");
                }}
              >
                <Copy /> Copy
              </Button>
            </div>
          </div>
          <div className="flex-1 p-5">
            {!output && !loading && (
              <div className="flex h-full items-center justify-center text-center text-sm text-muted-foreground">
                Fill in the details and click Generate. You can edit the result afterwards.
              </div>
            )}
            {loading && !output && (
              <div className="space-y-3">
                {[80, 95, 60, 90].map((w) => (
                  <div key={w} className="h-3 animate-pulse rounded bg-muted" style={{ width: `${w}%` }} />
                ))}
              </div>
            )}
            {output && editing ? (
              <Textarea
                value={output}
                onChange={(e) => setOutput(e.target.value)}
                className="min-h-[360px] font-mono text-sm"
              />
            ) : (
              output && (
                <div className="prose-output">
                  <ReactMarkdown>{output}</ReactMarkdown>
                </div>
              )
            )}
          </div>
        </Card>
      </div>
      <Disclaimer />
    </div>
  );
}
