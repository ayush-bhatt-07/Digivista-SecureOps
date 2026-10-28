import { createFileRoute } from "@tanstack/react-router";
import { Power, RefreshCw, ShieldCheck, Stethoscope } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusPill, statusTone } from "@/components/status-pill";
import { useSecureOps } from "@/hooks/use-secureops";
import { endpointAction } from "@/lib/secureops-data";

export const Route = createFileRoute("/_authenticated/endpoints")({
  head: () => ({
    meta: [
      { title: "Endpoint Management — Digivista SecureOps" },
      {
        name: "description",
        content:
          "Monitor agent heartbeat, patch compliance and resource utilisation, and run remote restart, shutdown and diagnostics on managed endpoints.",
      },
      { property: "og:title", content: "Endpoint Management — Digivista SecureOps" },
      { property: "og:description", content: "Remote endpoint monitoring, patching and diagnostics." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: EndpointsPage,
});

function EndpointsPage() {
  const { endpoints } = useSecureOps();
  const online = endpoints.filter((e) => e.agent === "online").length;
  const pending = endpoints.filter((e) => e.patchLevel !== "current").length;

  return (
    <AppShell title="Endpoint Management" description="Agent telemetry, patch compliance and remote operations.">
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="panel border-0 shadow-none">
          <CardContent className="p-5">
            <p className="text-2xl font-bold">
              {online}/{endpoints.length}
            </p>
            <p className="text-sm text-muted-foreground">Agents reporting</p>
          </CardContent>
        </Card>
        <Card className="panel border-0 shadow-none">
          <CardContent className="p-5">
            <p className="text-2xl font-bold">{pending}</p>
            <p className="text-sm text-muted-foreground">Endpoints pending patch</p>
          </CardContent>
        </Card>
        <Card className="panel border-0 shadow-none">
          <CardContent className="p-5">
            <p className="text-2xl font-bold">
              {Math.round(endpoints.reduce((s, e) => s + (100 - e.disk / 2 - e.cpu / 4), 0) / endpoints.length)}
            </p>
            <p className="text-sm text-muted-foreground">Average health score</p>
          </CardContent>
        </Card>
      </div>

      <Card className="panel mt-4 border-0 shadow-none">
        <CardContent className="p-4">
          <div className="overflow-x-auto rounded-md border border-border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/60">
                  <TableHead>Endpoint</TableHead>
                  <TableHead>Tenant</TableHead>
                  <TableHead>Agent</TableHead>
                  <TableHead className="w-32">CPU</TableHead>
                  <TableHead className="w-32">Memory</TableHead>
                  <TableHead className="w-32">Disk</TableHead>
                  <TableHead>Patch</TableHead>
                  <TableHead className="text-right">Remote actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {endpoints.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell>
                      <p className="font-medium">{e.hostname}</p>
                      <p className="text-xs text-muted-foreground">
                        {e.os} · {e.ip}
                      </p>
                    </TableCell>
                    <TableCell className="text-sm">{e.company}</TableCell>
                    <TableCell>
                      <StatusPill tone={statusTone(e.agent)}>{e.agent}</StatusPill>
                      <p className="mt-1 text-xs text-muted-foreground">{e.lastHeartbeat}</p>
                    </TableCell>
                    <TableCell>
                      <Progress value={e.cpu} className="h-1.5" />
                      <span className="text-xs text-muted-foreground">{e.cpu}%</span>
                    </TableCell>
                    <TableCell>
                      <Progress value={e.ram} className="h-1.5" />
                      <span className="text-xs text-muted-foreground">{e.ram}%</span>
                    </TableCell>
                    <TableCell>
                      <Progress value={e.disk} className="h-1.5" />
                      <span className="text-xs text-muted-foreground">{e.disk}%</span>
                    </TableCell>
                    <TableCell>
                      <StatusPill tone={statusTone(e.patchLevel)}>{e.patchLevel}</StatusPill>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          aria-label={`Restart ${e.hostname}`}
                          onClick={() => {
                            endpointAction(e.id, "restart");
                            toast.success(`Restart command sent to ${e.hostname}`);
                          }}
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          aria-label={`Shutdown ${e.hostname}`}
                          onClick={() => {
                            endpointAction(e.id, "shutdown");
                            toast.success(`Shutdown command sent to ${e.hostname}`);
                          }}
                        >
                          <Power className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          aria-label={`Patch ${e.hostname}`}
                          onClick={() => {
                            endpointAction(e.id, "patch");
                            toast.success(`${e.hostname} patched to current baseline`);
                          }}
                        >
                          <ShieldCheck className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          aria-label={`Diagnose ${e.hostname}`}
                          onClick={() => {
                            endpointAction(e.id, "diagnose");
                            toast.info(`Diagnostics collected from ${e.hostname}`);
                          }}
                        >
                          <Stethoscope className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </AppShell>
  );
}
