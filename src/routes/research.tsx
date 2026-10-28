import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search } from "lucide-react";
import { ToolPage } from "@/components/ToolPage";
import { Field, Choice } from "@/components/Fields";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant — Clarity" },
      { name: "description", content: "Get structured AI research briefs on any business topic." },
      { property: "og:title", content: "AI Research Assistant — Clarity" },
      { property: "og:description", content: "Get structured AI research briefs on any business topic." },
    ],
  }),
  component: ResearchPage,
});

function ResearchPage() {
  const [topic, setTopic] = useState("");
  const [context, setContext] = useState("");
  const [audience, setAudience] = useState("Executives");
  const [depth, setDepth] = useState("Overview");
  return (
    <ToolPage
      kind="research"
      title="AI Research Assistant"
      subtitle="Ask a question — get a structured, decision-ready brief."
      icon={<Search />}
      canSubmit={topic.trim().length > 3}
      buildPrompt={() =>
        `TASK: Research brief.\nTOPIC/QUESTION: ${topic}\nCONTEXT: ${context || "(none)"}\nAUDIENCE: ${audience}\nDEPTH: ${depth}`
      }
      form={
        <>
          <Field label="Topic or question *">
            <Input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. Benefits of a 4-day work week" />
          </Field>
          <Field label="Context">
            <Textarea rows={4} value={context} onChange={(e) => setContext(e.target.value)} placeholder="Industry, company size, goals…" />
          </Field>
          <Choice label="Audience" value={audience} onChange={setAudience} options={["Executives", "Team", "Clients", "Technical"]} />
          <Choice label="Depth" value={depth} onChange={setDepth} options={["Quick", "Overview", "Deep dive"]} />
        </>
      }
    />
  );
}
