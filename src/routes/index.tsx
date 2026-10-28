import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { NAV } from "@/components/AppSidebar";
import { Disclaimer } from "@/components/Disclaimer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Clarity — AI Workplace Productivity Assistant" },
      { name: "description", content: "Automate emails, meeting notes, planning and research with AI." },
      { property: "og:title", content: "Clarity — AI Workplace Productivity Assistant" },
      { property: "og:description", content: "Automate emails, meeting notes, planning and research with AI." },
    ],
  }),
  component: Index,
});

function Index() {
  const hour = new Date().getHours();
  const greet = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  return (
    <div className="mx-auto max-w-6xl space-y-8 p-4 md:p-8">
      <section className="relative overflow-hidden rounded-2xl bg-hero p-8 text-primary-foreground shadow-elegant md:p-10">
        <p className="text-sm font-medium opacity-80">{greet} 👋</p>
        <h1 className="mt-2 max-w-2xl font-display text-3xl font-semibold tracking-tight md:text-4xl">
          Your AI workplace assistant — less busywork, more impact.
        </h1>
        <p className="mt-3 max-w-xl opacity-80">
          Draft emails, summarise meetings, plan your day and research topics in seconds.
        </p>
        <Link
          to="/chat"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-background px-4 py-2 text-sm font-medium text-foreground transition-transform hover:translate-x-0.5"
        >
          Start a chat <ArrowRight className="h-4 w-4" />
        </Link>
      </section>

      <section>
        <h2 className="mb-4 font-display text-lg font-semibold">AI tools</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {NAV.map((n) => (
            <Link
              key={n.url}
              to={n.url}
              className="group rounded-xl border bg-card p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-elegant"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <n.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-semibold">{n.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{n.desc}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                Open <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>
      <Disclaimer />
    </div>
  );
}
