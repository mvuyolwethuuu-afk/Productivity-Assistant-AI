import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CalendarCheck } from "lucide-react";
import { ToolPage } from "@/components/ToolPage";
import { Field, Choice } from "@/components/Fields";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — Clarity" },
      { name: "description", content: "Prioritise tasks and build a realistic daily schedule with AI." },
      { property: "og:title", content: "AI Task Planner — Clarity" },
      { property: "og:description", content: "Prioritise tasks and build a realistic daily schedule with AI." },
    ],
  }),
  component: PlannerPage,
});

function PlannerPage() {
  const [tasks, setTasks] = useState("");
  const [hours, setHours] = useState("8");
  const [start, setStart] = useState("09:00");
  const [style, setStyle] = useState("Deep-work mornings");
  return (
    <ToolPage
      kind="tasks"
      title="AI Task Planner"
      subtitle="List your to-dos — get priorities and a time-blocked schedule."
      icon={<CalendarCheck />}
      canSubmit={tasks.trim().length > 5}
      buildPrompt={() =>
        `TASK: Plan my day.\nAVAILABLE HOURS: ${hours}\nSTART TIME: ${start}\nWORK STYLE: ${style}\nTASKS:\n${tasks}`
      }
      form={
        <>
          <Field label="Tasks & deadlines *">
            <Textarea rows={8} value={tasks} onChange={(e) => setTasks(e.target.value)} placeholder="- Finish Q3 report (due today)&#10;- Reply to client emails&#10;- Prep slides for Friday" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Hours available">
              <Input type="number" min={1} max={16} value={hours} onChange={(e) => setHours(e.target.value)} />
            </Field>
            <Field label="Start time">
              <Input type="time" value={start} onChange={(e) => setStart(e.target.value)} />
            </Field>
          </div>
          <Choice label="Work style" value={style} onChange={setStyle} options={["Deep-work mornings", "Quick wins first", "Pomodoro", "Meeting-heavy"]} />
        </>
      }
    />
  );
}
