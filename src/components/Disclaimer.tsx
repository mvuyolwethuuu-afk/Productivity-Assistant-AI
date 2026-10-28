import { ShieldAlert } from "lucide-react";

export function Disclaimer() {
  return (
    <div className="flex gap-3 rounded-xl border border-warning/30 bg-warning/10 p-4 text-sm">
      <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
      <p className="text-foreground/80">
        <strong>Responsible AI:</strong> Outputs are AI-generated and may be inaccurate or incomplete.
        Review, fact-check and edit before sharing. Don't enter confidential, personal or sensitive
        company data. You remain responsible for decisions made using this content.
      </p>
    </div>
  );
}
