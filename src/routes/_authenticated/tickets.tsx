import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusPill, statusTone, priorityTone, label } from "@/components/status-pill";
import { useSecureOps } from "@/hooks/use-secureops";
import { createTicket, deleteTicket, updateTicket, type Priority, type Ticket, type TicketStatus } from "@/lib/secureops-data";

export const Route = createFileRoute("/_authenticated/tickets")({
  head: () => ({
    meta: [
      { title: "Service Desk — Digivista SecureOps" },
      {
        name: "description",
        content:
          "Raise, triage and resolve field service tickets with SLA tracking, priority routing and engineer assignment.",
      },
      { property: "og:title", content: "Service Desk — Digivista SecureOps" },
      { property: "og:description", content: "SLA-driven ticket workflow for managed infrastructure support." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TicketsPage,
});

const STATUSES: TicketStatus[] = ["open", "in_progress", "on_hold", "resolved", "closed"];
const PRIORITIES: Priority[] = ["critical", "high", "medium", "low"];
const CATEGORIES: Ticket["category"][] = ["CCTV", "Network", "Biometric", "Server", "Inventory", "Other"];

function TicketsPage() {
  const { tickets, companies, engineers } = useSecureOps();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [priority, setPriority] = useState("all");
  const [open, setOpen] = useState(false);

  const filtered = useMemo(
    () =>
      tickets.filter(
        (t) =>
          (status === "all" || t.status === status) &&
          (priority === "all" || t.priority === priority) &&
          `${t.id} ${t.subject} ${t.company} ${t.engineer}`.toLowerCase().includes(query.toLowerCase()),
      ),
    [tickets, query, status, priority],
  );

  const counts = STATUSES.map((s) => ({ s, n: tickets.filter((t) => t.status === s).length }));

  function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const p = String(f.get("priority")) as Priority;
    createTicket({
      subject: String(f.get("subject")),
      company: String(f.get("company")),
      category: String(f.get("category")) as Ticket["category"],
      priority: p,
      status: "open",
      engineer: String(f.get("engineer")),
      slaHours: p === "critical" ? 4 : p === "high" ? 8 : p === "medium" ? 24 : 48,
    });
    setOpen(false);
    toast.success("Ticket raised and assigned");
  }

  return (
    <AppShell title="Service Desk" description="SLA-governed ticket lifecycle across every tenant and device category.">
      <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-5">
        {counts.map(({ s, n }) => (
          <Card key={s} className="panel border-0 shadow-none">
            <CardContent className="p-4">
              <p className="text-2xl font-bold">{n}</p>
              <p className="text-xs capitalize text-muted-foreground">{label(s)}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="panel mt-4 border-0 shadow-none">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative min-w-[220px] flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search tickets…" className="pl-9" />
            </div>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {STATUSES.map((s) => (
                  <SelectItem key={s} value={s} className="capitalize">
                    {label(s)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All priorities</SelectItem>
                {PRIORITIES.map((p) => (
                  <SelectItem key={p} value={p} className="capitalize">
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Raise ticket
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Raise a service ticket</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreate} className="grid gap-3 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input id="subject" name="subject" required placeholder="Camera offline at main gate" />
                  </div>
                  <div>
                    <Label htmlFor="company">Company</Label>
                    <select id="company" name="company" className="mt-1 h-9 w-full rounded-md border border-input bg-background px-3 text-sm">
                      {companies.map((c) => (
                        <option key={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <select id="category" name="category" className="mt-1 h-9 w-full rounded-md border border-input bg-background px-3 text-sm">
                      {CATEGORIES.map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="priority">Priority</Label>
                    <select id="priority" name="priority" className="mt-1 h-9 w-full rounded-md border border-input bg-background px-3 text-sm capitalize">
                      {PRIORITIES.map((p) => (
                        <option key={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="engineer">Engineer</Label>
                    <select id="engineer" name="engineer" className="mt-1 h-9 w-full rounded-md border border-input bg-background px-3 text-sm">
                      {engineers.map((e) => (
                        <option key={e.id}>{e.name}</option>
                      ))}
                    </select>
                  </div>
                  <DialogFooter className="sm:col-span-2">
                    <Button type="submit">Create ticket</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="mt-4 overflow-x-auto rounded-md border border-border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/60">
                  <TableHead>Ticket</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Engineer</TableHead>
                  <TableHead>SLA</TableHead>
                  <TableHead className="w-[170px]">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell>
                      <p className="font-medium text-foreground">{t.subject}</p>
                      <p className="text-xs text-muted-foreground">
                        {t.id} · {t.company} · {t.createdAt}
                      </p>
                    </TableCell>
                    <TableCell className="text-sm">{t.category}</TableCell>
                    <TableCell>
                      <StatusPill tone={priorityTone(t.priority)}>{t.priority}</StatusPill>
                    </TableCell>
                    <TableCell className="text-sm">{t.engineer}</TableCell>
                    <TableCell className="text-sm">{t.slaHours}h</TableCell>
                    <TableCell>
                      <Select
                        value={t.status}
                        onValueChange={(v) => {
                          updateTicket(t.id, { status: v as TicketStatus });
                          toast.success(`${t.id} → ${label(v)}`);
                        }}
                      >
                        <SelectTrigger className="h-8 w-[150px] capitalize">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {STATUSES.map((s) => (
                            <SelectItem key={s} value={s} className="capitalize">
                              {label(s)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="icon"
                        variant="ghost"
                        aria-label={`Delete ${t.id}`}
                        onClick={() => {
                          deleteTicket(t.id);
                          toast.success(`${t.id} deleted`);
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="py-12 text-center text-sm text-muted-foreground">
                      No tickets match the current filters.
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
