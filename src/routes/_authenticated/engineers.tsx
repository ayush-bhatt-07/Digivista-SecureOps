import { createFileRoute } from "@tanstack/react-router";
import { Phone, Star } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { StatusPill, statusTone, label } from "@/components/status-pill";
import { useSecureOps } from "@/hooks/use-secureops";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/engineers")({
  head: () => ({
    meta: [
      { title: "Engineer Management — Digivista SecureOps" },
      {
        name: "description",
        content:
          "Track field engineer availability, workload, regions, ratings and live ticket assignments across the service network.",
      },
      { property: "og:title", content: "Engineer Management — Digivista SecureOps" },
      { property: "og:description", content: "Field workforce availability and performance tracking." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: EngineersPage,
});

function EngineersPage() {
  const { engineers, tickets } = useSecureOps();

  return (
    <AppShell title="Engineer Management" description="Availability, workload balance and field performance.">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {engineers.map((e) => {
          const assigned = tickets.filter((t) => t.engineer === e.name && t.status !== "closed");
          const load = Math.min(assigned.length * 20, 100);
          return (
            <Card key={e.id} className="panel border-0 shadow-none">
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                    {e.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{e.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {e.role} · {e.region}
                    </p>
                  </div>
                  <StatusPill tone={statusTone(e.availability)}>{label(e.availability)}</StatusPill>
                </div>

                <div className="mt-4">
                  <div className="mb-1.5 flex justify-between text-sm">
                    <span className="text-muted-foreground">Workload</span>
                    <span className="font-medium">{assigned.length} active tickets</span>
                  </div>
                  <Progress value={load} />
                </div>

                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="inline-flex items-center gap-1 font-medium">
                    <Star className="h-4 w-4 fill-accent text-accent" /> {e.rating.toFixed(1)}
                  </span>
                  <span className="inline-flex items-center gap-1 text-muted-foreground">
                    <Phone className="h-3.5 w-3.5" /> {e.phone}
                  </span>
                </div>

                <div className="mt-4 flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => toast.success(`Dispatch request sent to ${e.name}`)}
                  >
                    Dispatch
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() =>
                      toast.info(
                        assigned.length
                          ? `${e.name}: ${assigned.map((t) => t.id).join(", ")}`
                          : `${e.name} has no active tickets`,
                      )
                    }
                  >
                    View queue
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </AppShell>
  );
}
