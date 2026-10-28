import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  AlertTriangle,
  CalendarClock,
  FileDown,
  FileSignature,
  FileText,
  IndianRupee,
  Plus,
  RefreshCw,
  Search,
  Trash2,
} from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusPill, statusTone, label as humanize } from "@/components/status-pill";
import { useSecureOps } from "@/hooks/use-secureops";
import {
  contractStatusFor,
  createContract,
  createInvoice,
  daysUntil,
  deleteContract,
  deleteInvoice,
  deleteVisit,
  downloadCsv,
  inr,
  renewContract,
  scheduleVisit,
  updateContract,
  updateInvoice,
  updateVisit,
  type AmcContract,
} from "@/lib/secureops-data";
import { exportAmcRegisterPdf, exportContractPdf, exportInvoicePdf } from "@/lib/amc-pdf";

export const Route = createFileRoute("/_authenticated/amc")({
  head: () => ({
    meta: [
      { title: "AMC & Contract Management — Digivista SecureOps" },
      {
        name: "description",
        content:
          "Track annual maintenance contracts, renewals, expiry alerts, GST invoices and preventive maintenance visits with one-click PDF exports.",
      },
      { property: "og:title", content: "AMC & Contract Management — Digivista SecureOps" },
      {
        property: "og:description",
        content: "Contracts, renewals, expiry alerts, invoices, visits and PDF exports for managed infrastructure.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AmcPage,
});

function Kpi({ icon: Icon, label, value, hint, tone }: { icon: typeof FileSignature; label: string; value: string; hint: string; tone: string }) {
  return (
    <Card className="panel border-0 shadow-none">
      <CardContent className="flex items-start gap-3 p-5">
        <div className={`flex h-10 w-10 items-center justify-center rounded-md ${tone}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
          <p className="mt-0.5 text-xl font-bold text-foreground">{value}</p>
          <p className="text-xs text-muted-foreground">{hint}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function AmcPage() {
  const { contracts, invoices, visits, companies, engineers } = useSecureOps();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [newContract, setNewContract] = useState(false);
  const [invoiceFor, setInvoiceFor] = useState<AmcContract | null>(null);
  const [visitFor, setVisitFor] = useState<AmcContract | null>(null);

  const live = useMemo(
    () => contracts.map((c) => ({ ...c, status: c.status === "draft" ? c.status : contractStatusFor(c.endDate) })),
    [contracts],
  );

  const filtered = useMemo(
    () =>
      live.filter(
        (c) =>
          `${c.id} ${c.company} ${c.plan} ${c.owner}`.toLowerCase().includes(query.toLowerCase()) &&
          (status === "all" || c.status === status),
      ),
    [live, query, status],
  );

  const expiring = live.filter((c) => c.status === "expiring");
  const expired = live.filter((c) => c.status === "expired");
  const contractedValue = live.reduce((s, c) => s + c.value, 0);
  const outstanding = invoices
    .filter((i) => i.status !== "paid" && i.status !== "draft")
    .reduce((s, i) => s + Math.round(i.amount * (1 + i.taxPercent / 100)), 0);
  const upcomingVisits = visits.filter((v) => v.status === "scheduled").length;

  return (
    <AppShell
      title="AMC & Contracts"
      description="Annual maintenance contracts, renewals, expiry alerts, billing and preventive visits."
    >
      <div className="mb-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi icon={FileSignature} label="Active contracts" value={String(live.filter((c) => c.status === "active").length)} hint={`${inr(contractedValue)} contracted`} tone="bg-primary-soft text-primary" />
        <Kpi icon={AlertTriangle} label="Expiring ≤ 60 days" value={String(expiring.length)} hint={`${expired.length} already expired`} tone="bg-accent-soft text-accent-foreground" />
        <Kpi icon={IndianRupee} label="Outstanding billing" value={inr(outstanding)} hint={`${invoices.filter((i) => i.status === "overdue").length} overdue invoices`} tone="bg-destructive/10 text-destructive" />
        <Kpi icon={CalendarClock} label="Scheduled visits" value={String(upcomingVisits)} hint={`${visits.filter((v) => v.status === "missed").length} missed this cycle`} tone="bg-info/10 text-info" />
      </div>

      {(expiring.length > 0 || expired.length > 0) && (
        <div className="panel mb-5 border-l-4 border-l-accent p-4">
          <div className="flex flex-wrap items-center gap-3">
            <AlertTriangle className="h-5 w-5 shrink-0 text-accent" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-foreground">Renewal alerts</p>
              <p className="text-xs text-muted-foreground">
                {[...expiring, ...expired]
                  .map((c) => `${c.company} (${c.id}) ${daysUntil(c.endDate) < 0 ? `expired ${Math.abs(daysUntil(c.endDate))}d ago` : `expires in ${daysUntil(c.endDate)}d`}`)
                  .join(" · ")}
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => {
                const targets = [...expiring, ...expired].filter((c) => c.autoRenew);
                if (!targets.length) return toast.error("No contracts have auto-renew enabled");
                targets.forEach((c) => renewContract(c.id, 12));
                toast.success(`Auto-renewed ${targets.length} contract(s) and raised invoices`);
              }}
            >
              <RefreshCw className="mr-2 h-4 w-4" /> Run auto-renewals
            </Button>
          </div>
        </div>
      )}

      <Tabs defaultValue="contracts">
        <TabsList>
          <TabsTrigger value="contracts">Contracts</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="visits">Visits</TabsTrigger>
        </TabsList>

        {/* ---------------- Contracts ---------------- */}
        <TabsContent value="contracts" className="mt-4">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <div className="relative min-w-[220px] flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search contracts…" className="pl-9" />
            </div>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {["active", "expiring", "expired", "draft"].map((s) => (
                  <SelectItem key={s} value={s} className="capitalize">
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => { downloadCsv("digivista-amc-contracts.csv", filtered); toast.success("Contract register exported"); }}>
              <FileDown className="mr-2 h-4 w-4" /> CSV
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                if (!exportAmcRegisterPdf(filtered)) toast.error("Allow pop-ups to export the PDF");
                else toast.success("Register PDF ready — choose “Save as PDF”");
              }}
            >
              <FileText className="mr-2 h-4 w-4" /> PDF
            </Button>
            <Dialog open={newContract} onOpenChange={setNewContract}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> New contract
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Create AMC contract</DialogTitle>
                </DialogHeader>
                <form
                  className="grid gap-3 sm:grid-cols-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const f = new FormData(e.currentTarget);
                    createContract({
                      company: String(f.get("company")),
                      plan: String(f.get("plan")) as AmcContract["plan"],
                      startDate: String(f.get("startDate")),
                      endDate: String(f.get("endDate")),
                      value: Number(f.get("value")),
                      billingCycle: String(f.get("billingCycle")) as AmcContract["billingCycle"],
                      coveredAssets: Number(f.get("coveredAssets")),
                      visitsPerYear: Number(f.get("visitsPerYear")),
                      slaHours: Number(f.get("slaHours")),
                      owner: String(f.get("owner")),
                      autoRenew: f.get("autoRenew") === "yes",
                    });
                    setNewContract(false);
                    toast.success("AMC contract created");
                  }}
                >
                  <div className="sm:col-span-2">
                    <Label htmlFor="company">Client</Label>
                    <select id="company" name="company" required className="mt-1 h-9 w-full rounded-md border border-input bg-background px-3 text-sm">
                      {companies.map((c) => (
                        <option key={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="plan">Plan</Label>
                    <select id="plan" name="plan" className="mt-1 h-9 w-full rounded-md border border-input bg-background px-3 text-sm">
                      <option>Comprehensive</option>
                      <option>Non-Comprehensive</option>
                      <option>Labour Only</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="billingCycle">Billing cycle</Label>
                    <select id="billingCycle" name="billingCycle" className="mt-1 h-9 w-full rounded-md border border-input bg-background px-3 text-sm">
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                      <option value="half_yearly">Half yearly</option>
                      <option value="annual">Annual</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="startDate">Start date</Label>
                    <Input id="startDate" name="startDate" type="date" required defaultValue={new Date().toISOString().slice(0, 10)} />
                  </div>
                  <div>
                    <Label htmlFor="endDate">End date</Label>
                    <Input id="endDate" name="endDate" type="date" required />
                  </div>
                  <div>
                    <Label htmlFor="value">Contract value (₹)</Label>
                    <Input id="value" name="value" type="number" min="0" required defaultValue={500000} />
                  </div>
                  <div>
                    <Label htmlFor="coveredAssets">Covered assets</Label>
                    <Input id="coveredAssets" name="coveredAssets" type="number" min="0" required defaultValue={100} />
                  </div>
                  <div>
                    <Label htmlFor="visitsPerYear">Visits / year</Label>
                    <Input id="visitsPerYear" name="visitsPerYear" type="number" min="0" required defaultValue={12} />
                  </div>
                  <div>
                    <Label htmlFor="slaHours">SLA (hours)</Label>
                    <Input id="slaHours" name="slaHours" type="number" min="1" required defaultValue={4} />
                  </div>
                  <div>
                    <Label htmlFor="owner">Account owner</Label>
                    <select id="owner" name="owner" className="mt-1 h-9 w-full rounded-md border border-input bg-background px-3 text-sm">
                      {engineers.map((e) => (
                        <option key={e.id}>{e.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="autoRenew">Auto renew</Label>
                    <select id="autoRenew" name="autoRenew" className="mt-1 h-9 w-full rounded-md border border-input bg-background px-3 text-sm">
                      <option value="yes">Enabled</option>
                      <option value="no">Disabled</option>
                    </select>
                  </div>
                  <DialogFooter className="sm:col-span-2">
                    <Button type="submit">Create contract</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {filtered.map((c) => {
              const days = daysUntil(c.endDate);
              return (
                <Card key={c.id} className="panel border-0 shadow-none">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold text-foreground">{c.company}</p>
                        <p className="text-xs text-muted-foreground">
                          {c.id} · {c.plan} · owner {c.owner}
                        </p>
                      </div>
                      <StatusPill tone={statusTone(c.status)}>{c.status}</StatusPill>
                    </div>

                    <dl className="mt-4 grid grid-cols-2 gap-y-2 text-sm">
                      <dt className="text-muted-foreground">Period</dt>
                      <dd className="text-right font-medium">{c.startDate} → {c.endDate}</dd>
                      <dt className="text-muted-foreground">Expiry</dt>
                      <dd className={`text-right font-medium ${days < 0 ? "text-destructive" : days <= 60 ? "text-accent-foreground" : ""}`}>
                        {days < 0 ? `${Math.abs(days)} days overdue` : `${days} days left`}
                      </dd>
                      <dt className="text-muted-foreground">Value</dt>
                      <dd className="text-right font-medium">{inr(c.value)} · {humanize(c.billingCycle)}</dd>
                      <dt className="text-muted-foreground">Coverage</dt>
                      <dd className="text-right font-medium">{c.coveredAssets} assets · {c.visitsPerYear} visits/yr · {c.slaHours}h SLA</dd>
                      <dt className="text-muted-foreground">Auto renew</dt>
                      <dd className="text-right font-medium">{c.autoRenew ? "Enabled" : "Disabled"}</dd>
                    </dl>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button size="sm" onClick={() => { renewContract(c.id, 12); toast.success(`${c.id} renewed for 12 months`); }}>
                        <RefreshCw className="mr-2 h-4 w-4" /> Renew 12m
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setInvoiceFor(c)}>
                        Raise invoice
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setVisitFor(c)}>
                        Schedule visit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          if (!exportContractPdf(c, visits.filter((v) => v.contractId === c.id))) toast.error("Allow pop-ups to export the PDF");
                          else toast.success("Contract PDF ready");
                        }}
                      >
                        <FileText className="mr-2 h-4 w-4" /> PDF
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => { updateContract(c.id, { autoRenew: !c.autoRenew }); toast.success(`Auto renew ${c.autoRenew ? "disabled" : "enabled"}`); }}
                      >
                        {c.autoRenew ? "Disable auto" : "Enable auto"}
                      </Button>
                      <Button size="icon" variant="ghost" aria-label={`Terminate ${c.id}`} onClick={() => { deleteContract(c.id); toast.success(`${c.id} terminated`); }}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          {filtered.length === 0 && <div className="panel p-12 text-center text-sm text-muted-foreground">No contracts match your filters.</div>}
        </TabsContent>

        {/* ---------------- Invoices ---------------- */}
        <TabsContent value="invoices" className="mt-4">
          <div className="mb-4 flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => { downloadCsv("digivista-amc-invoices.csv", invoices); toast.success("Invoices exported"); }}>
              <FileDown className="mr-2 h-4 w-4" /> Export CSV
            </Button>
          </div>
          <div className="panel overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Contract</TableHead>
                  <TableHead className="text-right">Total (incl. GST)</TableHead>
                  <TableHead>Due</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((i) => (
                  <TableRow key={i.id}>
                    <TableCell className="font-medium">{i.id}</TableCell>
                    <TableCell>{i.company}</TableCell>
                    <TableCell>{i.contractId}</TableCell>
                    <TableCell className="text-right font-medium">{inr(Math.round(i.amount * (1 + i.taxPercent / 100)))}</TableCell>
                    <TableCell>{i.dueOn}</TableCell>
                    <TableCell>
                      <StatusPill tone={statusTone(i.status)}>{i.status}</StatusPill>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        {i.status !== "paid" && (
                          <Button size="sm" variant="outline" onClick={() => { updateInvoice(i.id, { status: "paid" }); toast.success(`${i.id} marked paid`); }}>
                            Mark paid
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            if (!exportInvoicePdf(i, contracts.find((c) => c.id === i.contractId))) toast.error("Allow pop-ups to export the PDF");
                            else toast.success("Invoice PDF ready");
                          }}
                        >
                          <FileText className="mr-2 h-4 w-4" /> PDF
                        </Button>
                        <Button size="icon" variant="ghost" aria-label={`Void ${i.id}`} onClick={() => { deleteInvoice(i.id); toast.success(`${i.id} voided`); }}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {invoices.length === 0 && <p className="p-10 text-center text-sm text-muted-foreground">No invoices raised yet.</p>}
          </div>
        </TabsContent>

        {/* ---------------- Visits ---------------- */}
        <TabsContent value="visits" className="mt-4">
          <div className="mb-4 flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => { downloadCsv("digivista-amc-visits.csv", visits); toast.success("Visit plan exported"); }}>
              <FileDown className="mr-2 h-4 w-4" /> Export CSV
            </Button>
          </div>
          <div className="panel overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Visit</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Scheduled</TableHead>
                  <TableHead>Engineer</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visits.map((v) => (
                  <TableRow key={v.id}>
                    <TableCell className="font-medium">{v.id}</TableCell>
                    <TableCell>
                      <span className="block">{v.company}</span>
                      <span className="text-xs text-muted-foreground">{v.notes}</span>
                    </TableCell>
                    <TableCell>{v.scheduledOn}</TableCell>
                    <TableCell>{v.engineer}</TableCell>
                    <TableCell className="capitalize">{v.type}</TableCell>
                    <TableCell>
                      <StatusPill tone={statusTone(v.status)}>{v.status}</StatusPill>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        {v.status !== "completed" && (
                          <Button size="sm" variant="outline" onClick={() => { updateVisit(v.id, { status: "completed" }); toast.success(`${v.id} marked complete`); }}>
                            Complete
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const next = new Date(v.scheduledOn);
                            next.setDate(next.getDate() + 7);
                            updateVisit(v.id, { scheduledOn: next.toISOString().slice(0, 10), status: "scheduled" });
                            toast.success(`${v.id} rescheduled by a week`);
                          }}
                        >
                          Reschedule
                        </Button>
                        <Button size="icon" variant="ghost" aria-label={`Cancel ${v.id}`} onClick={() => { deleteVisit(v.id); toast.success(`${v.id} cancelled`); }}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {visits.length === 0 && <p className="p-10 text-center text-sm text-muted-foreground">No visits planned.</p>}
          </div>
        </TabsContent>
      </Tabs>

      {/* Raise invoice dialog */}
      <Dialog open={!!invoiceFor} onOpenChange={(o) => !o && setInvoiceFor(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Raise invoice — {invoiceFor?.id}</DialogTitle>
          </DialogHeader>
          {invoiceFor && (
            <form
              className="grid gap-3"
              onSubmit={(e) => {
                e.preventDefault();
                const f = new FormData(e.currentTarget);
                createInvoice({
                  contractId: invoiceFor.id,
                  company: invoiceFor.company,
                  amount: Number(f.get("amount")),
                  taxPercent: Number(f.get("taxPercent")),
                  dueOn: String(f.get("dueOn")),
                  status: "unpaid",
                });
                setInvoiceFor(null);
                toast.success("Invoice raised");
              }}
            >
              <div>
                <Label htmlFor="amount">Amount (₹, pre-tax)</Label>
                <Input id="amount" name="amount" type="number" min="0" required defaultValue={Math.round(invoiceFor.value / 4)} />
              </div>
              <div>
                <Label htmlFor="taxPercent">GST %</Label>
                <Input id="taxPercent" name="taxPercent" type="number" min="0" max="28" required defaultValue={18} />
              </div>
              <div>
                <Label htmlFor="dueOn">Due date</Label>
                <Input id="dueOn" name="dueOn" type="date" required defaultValue={new Date(Date.now() + 15 * 86400000).toISOString().slice(0, 10)} />
              </div>
              <DialogFooter>
                <Button type="submit">Raise invoice</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Schedule visit dialog */}
      <Dialog open={!!visitFor} onOpenChange={(o) => !o && setVisitFor(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Schedule visit — {visitFor?.id}</DialogTitle>
          </DialogHeader>
          {visitFor && (
            <form
              className="grid gap-3"
              onSubmit={(e) => {
                e.preventDefault();
                const f = new FormData(e.currentTarget);
                scheduleVisit({
                  contractId: visitFor.id,
                  company: visitFor.company,
                  scheduledOn: String(f.get("scheduledOn")),
                  engineer: String(f.get("engineer")),
                  type: String(f.get("type")) as "preventive" | "corrective" | "audit",
                  notes: String(f.get("notes")),
                });
                setVisitFor(null);
                toast.success("Visit scheduled");
              }}
            >
              <div>
                <Label htmlFor="scheduledOn">Date</Label>
                <Input id="scheduledOn" name="scheduledOn" type="date" required defaultValue={new Date().toISOString().slice(0, 10)} />
              </div>
              <div>
                <Label htmlFor="engineer">Engineer</Label>
                <select id="engineer" name="engineer" className="mt-1 h-9 w-full rounded-md border border-input bg-background px-3 text-sm">
                  {engineers.map((en) => (
                    <option key={en.id}>{en.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="type">Visit type</Label>
                <select id="type" name="type" className="mt-1 h-9 w-full rounded-md border border-input bg-background px-3 text-sm">
                  <option value="preventive">Preventive</option>
                  <option value="corrective">Corrective</option>
                  <option value="audit">Audit</option>
                </select>
              </div>
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Input id="notes" name="notes" defaultValue="Scheduled preventive maintenance" />
              </div>
              <DialogFooter>
                <Button type="submit">Schedule</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
