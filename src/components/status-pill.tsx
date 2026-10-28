import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const TONES = {
  success: "border-success/30 bg-success/10 text-success",
  warning: "border-warning/40 bg-accent-soft text-accent-foreground",
  danger: "border-destructive/30 bg-destructive/10 text-destructive",
  info: "border-info/30 bg-info/10 text-info",
  neutral: "border-border bg-muted text-muted-foreground",
} as const;

export type Tone = keyof typeof TONES;

export function StatusPill({ tone, children }: { tone: Tone; children: React.ReactNode }) {
  return (
    <Badge variant="outline" className={cn("font-medium capitalize", TONES[tone])}>
      {children}
    </Badge>
  );
}

export function statusTone(status: string): Tone {
  switch (status) {
    case "active":
    case "online":
    case "resolved":
    case "closed":
    case "current":
    case "paid":
    case "completed":
      return "success";
    case "maintenance":
    case "on_hold":
    case "expiring":
    case "pending":
    case "in_progress":
    case "unpaid":
      return "warning";
    case "faulty":
    case "expired":
    case "critical":
    case "offline":
    case "overdue":
    case "missed":
      return "danger";
    case "open":
    case "on_site":
    case "scheduled":
      return "info";
    default:
      return "neutral";
  }
}

export function priorityTone(priority: string): Tone {
  return priority === "critical" ? "danger" : priority === "high" ? "warning" : priority === "medium" ? "info" : "neutral";
}

export function label(value: string) {
  return value.replace(/_/g, " ");
}
