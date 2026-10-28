import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FileDown, Search } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useSecureOps } from "@/hooks/use-secureops";
import { downloadCsv } from "@/lib/secureops-data";

export const Route = createFileRoute("/_authenticated/audit")({
  head: () => ({
    meta: [
      { title: "Audit Logs — Digivista SecureOps" },
      {
        name: "description",
        content:
          "Immutable trail of every operator action across companies, assets, tickets and endpoints with actor, entity and timestamp.",
      },
      { property: "og:title", content: "Audit Logs — Digivista SecureOps" },
      { property: "og:description", content: "Compliance-grade activity trail for the SecureOps platform." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuditPage,
});

function AuditPage() {
  const { audit } = useSecureOps();
  const [query, setQuery] = useState("");
  const filtered = audit.filter((a) =>
    `${a.actor} ${a.action} ${a.entity}`.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <AppShell title="Audit Logs" description="Every create, update and remote command is recorded for compliance.">
      <Card className="panel border-0 shadow-none">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative min-w-[220px] flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search audit trail…" className="pl-9" />
            </div>
            <Button
              variant="outline"
              onClick={() => {
                downloadCsv("digivista-audit-log.csv", filtered);
                toast.success("Audit trail exported");
              }}
            >
              <FileDown className="mr-2 h-4 w-4" /> Export
            </Button>
          </div>

          <div className="mt-4 overflow-x-auto rounded-md border border-border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/60">
                  <TableHead>Time</TableHead>
                  <TableHead>Actor</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Module</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell className="text-sm text-muted-foreground">{a.at}</TableCell>
                    <TableCell className="text-sm font-medium">{a.actor}</TableCell>
                    <TableCell className="text-sm">{a.action}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{a.entity}</TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="py-12 text-center text-sm text-muted-foreground">
                      No audit entries yet — perform an action in any module.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </AppShell>
  );
}
