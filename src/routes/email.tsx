import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail } from "lucide-react";
import { ToolPage } from "@/components/ToolPage";
import { Field, Choice } from "@/components/Fields";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — Clarity" },
      { name: "description", content: "Generate professional workplace emails with AI in any tone." },
      { property: "og:title", content: "Smart Email Generator — Clarity" },
      { property: "og:description", content: "Generate professional workplace emails with AI in any tone." },
    ],
  }),
  component: EmailPage,
});

function EmailPage() {
  const [recipient, setRecipient] = useState("");
  const [purpose, setPurpose] = useState("");
  const [points, setPoints] = useState("");
  const [tone, setTone] = useState("Professional");
  const [length, setLength] = useState("Medium");
  return (
    <ToolPage
      kind="email"
      title="Smart Email Generator"
      subtitle="Describe what you need — get a ready-to-send draft."
      icon={<Mail />}
      canSubmit={purpose.trim().length > 3}
      buildPrompt={() =>
        `TASK: Write an email.\nRECIPIENT: ${recipient || "[Recipient]"}\nPURPOSE: ${purpose}\nKEY POINTS:\n${points || "(none)"}\nTONE: ${tone}\nLENGTH: ${length}`
      }
      form={
        <>
          <Field label="Recipient">
            <Input value={recipient} onChange={(e) => setRecipient(e.target.value)} placeholder="e.g. Sarah, Head of Marketing" />
          </Field>
          <Field label="Purpose *">
            <Input value={purpose} onChange={(e) => setPurpose(e.target.value)} placeholder="e.g. Request a project deadline extension" />
          </Field>
          <Field label="Key points">
            <Textarea rows={4} value={points} onChange={(e) => setPoints(e.target.value)} placeholder="- Vendor delay&#10;- New date: 15 Nov" />
          </Field>
          <Choice label="Tone" value={tone} onChange={setTone} options={["Professional", "Friendly", "Formal", "Persuasive", "Apologetic"]} />
          <Choice label="Length" value={length} onChange={setLength} options={["Short", "Medium", "Detailed"]} />
        </>
      }
    />
  );
}
