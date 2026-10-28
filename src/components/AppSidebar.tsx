import { Link, useRouterState } from "@tanstack/react-router";
import { BrainCircuit, CalendarCheck, LayoutDashboard, Mail, MessageSquare, NotebookPen, Search } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export const NAV = [
  { title: "Email Generator", url: "/email", icon: Mail, desc: "Draft polished emails in seconds" },
  { title: "Meeting Summarizer", url: "/meetings", icon: NotebookPen, desc: "Turn notes into decisions & actions" },
  { title: "Task Planner", url: "/planner", icon: CalendarCheck, desc: "Prioritise and schedule your day" },
  { title: "Research Assistant", url: "/research", icon: Search, desc: "Structured briefs on any topic" },
  { title: "AI Chat", url: "/chat", icon: MessageSquare, desc: "Ask anything about your work" },
] as const;

export function AppSidebar() {
  const path = useRouterState({ select: (r) => r.location.pathname });
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <Link to="/" className="flex items-center gap-2 px-2 py-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <BrainCircuit className="h-4 w-4" />
          </div>
          <span className="font-display text-lg font-semibold group-data-[collapsible=icon]:hidden">Clarity</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={path === "/"} tooltip="Dashboard">
                  <Link to="/">
                    <LayoutDashboard />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>AI Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV.map((n) => (
                <SidebarMenuItem key={n.url}>
                  <SidebarMenuButton asChild isActive={path === n.url} tooltip={n.title}>
                    <Link to={n.url}>
                      <n.icon />
                      <span>{n.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <p className="px-2 text-xs text-sidebar-foreground/60 group-data-[collapsible=icon]:hidden">
          AI can make mistakes. Always review outputs.
        </p>
      </SidebarFooter>
    </Sidebar>
  );
}
