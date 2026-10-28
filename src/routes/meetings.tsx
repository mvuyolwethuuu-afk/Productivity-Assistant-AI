import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { NotebookPen } from "lucide-react";
import { ToolPage } from "@/components/ToolPage";
import { Field, Choice } from "@/components/Fields";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/meetings")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — Clarity" },
      { name: "description", content: "Summarise meeting notes into decisions and action items with AI." },
      { property: "og:title", content: "Meeting Notes Summarizer — Clarity" },
      { property: "og:description", content: "Summarise meeting notes into decisions and action items with AI." },
    ],
  }),
  component: MeetingsPage,
});

function MeetingsPage() {
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [detail, setDetail] = useState("Balanced");
  return (
    <ToolPage
      kind="meeting"
      title="Meeting Notes Summarizer"
      subtitle="Paste raw notes or a transcript — get decisions and action items."
      icon={<NotebookPen />}
      canSubmit={notes.trim().length > 20}
      buildPrompt={() =>
        `TASK: Summarise this meeting.\nMEETING: ${title || "Untitled meeting"}\nDETAIL LEVEL: ${detail}\nNOTES:\n"""\n${notes}\n"""`
      }
      form={
        <>
          <Field label="Meeting title">
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Q4 product sync" />
          </Field>
          <Field label="Notes or transcript *">
            <Textarea rows={12} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Paste your meeting notes here…" />
          </Field>
          <Choice label="Detail" value={detail} onChange={setDetail} options={["Brief", "Balanced", "Detailed"]} />
        </>
      }
    />
  );
}
