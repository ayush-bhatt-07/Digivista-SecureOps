import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Building2, FileDown, Plus, Search, Trash2 } from "lucide-react";
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
import { StatusPill, statusTone } from "@/components/status-pill";
import { useSecureOps } from "@/hooks/use-secureops";
import { createCompany, deleteCompany, downloadCsv, updateCompany } from "@/lib/secureops-data";

export const Route = createFileRoute("/_authenticated/companies")({
  head: () => ({
    meta: [
      { title: "Companies & Branches — Digivista SecureOps" },
      {
        name: "description",
        content:
          "Manage tenant companies, GST details, contacts, branch hierarchy and AMC coverage from a single multi-tenant registry.",
      },
      { property: "og:title", content: "Companies & Branches — Digivista SecureOps" },
      { property: "og:description", content: "Multi-tenant company and branch administration." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CompaniesPage,
});

function CompaniesPage() {
  const { companies } = useSecureOps();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const filtered = useMemo(
    () =>
      companies.filter((c) =>
        `${c.name} ${c.gstin} ${c.city} ${c.contactPerson}`.toLowerCase().includes(query.toLowerCase()),
      ),
    [companies, query],
  );

  function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    createCompany({
      name: String(f.get("name")),
      gstin: String(f.get("gstin")),
      contactPerson: String(f.get("contactPerson")),
      email: String(f.get("email")),
      phone: String(f.get("phone")),
      city: String(f.get("city")),
      amcStatus: "active",
      status: "active",
    });
    setOpen(false);
    toast.success("Tenant onboarded");
  }

  return (
    <AppShell title="Companies & Branches" description="Tenant onboarding, contacts, GST records and branch coverage.">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative min-w-[220px] flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search tenants…" className="pl-9" />
        </div>
        <Button
          variant="outline"
          onClick={() => {
            downloadCsv("digivista-companies.csv", filtered);
            toast.success("Tenant list exported");
          }}
        >
          <FileDown className="mr-2 h-4 w-4" /> Export
        </Button>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Onboard company
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Onboard a new tenant</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="grid gap-3 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Label htmlFor="name">Company name</Label>
                <Input id="name" name="name" required />
              </div>
              <div>
                <Label htmlFor="gstin">GSTIN</Label>
                <Input id="gstin" name="gstin" required placeholder="27AAECA1234F1Z5" />
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Input id="city" name="city" required />
              </div>
              <div>
                <Label htmlFor="contactPerson">Contact person</Label>
                <Input id="contactPerson" name="contactPerson" required />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" name="phone" required />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required />
              </div>
              <DialogFooter className="sm:col-span-2">
                <Button type="submit">Create tenant</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((c) => (
          <Card key={c.id} className="panel border-0 shadow-none">
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-md bg-primary-soft text-primary">
                  <Building2 className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-foreground">{c.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {c.id} · {c.city}
                  </p>
                </div>
                <StatusPill tone={statusTone(c.status)}>{c.status}</StatusPill>
              </div>

              <dl className="mt-4 grid grid-cols-2 gap-y-2 text-sm">
                <dt className="text-muted-foreground">GSTIN</dt>
                <dd className="text-right font-medium">{c.gstin}</dd>
                <dt className="text-muted-foreground">Contact</dt>
                <dd className="truncate text-right font-medium">{c.contactPerson}</dd>
                <dt className="text-muted-foreground">Branches</dt>
                <dd className="text-right font-medium">{c.branches}</dd>
                <dt className="text-muted-foreground">Assets</dt>
                <dd className="text-right font-medium">{c.assets}</dd>
                <dt className="text-muted-foreground">AMC</dt>
                <dd className="text-right">
                  <StatusPill tone={statusTone(c.amcStatus)}>{c.amcStatus}</StatusPill>
                </dd>
              </dl>

              <div className="mt-4 flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    updateCompany(c.id, { branches: c.branches + 1 });
                    toast.success(`Branch added to ${c.name}`);
                  }}
                >
                  Add branch
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    updateCompany(c.id, { status: c.status === "active" ? "inactive" : "active" });
                    toast.success(`${c.name} ${c.status === "active" ? "suspended" : "reactivated"}`);
                  }}
                >
                  {c.status === "active" ? "Suspend" : "Activate"}
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  aria-label={`Delete ${c.name}`}
                  onClick={() => {
                    deleteCompany(c.id);
                    toast.success(`${c.name} removed`);
                  }}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="panel p-12 text-center text-sm text-muted-foreground">No tenants match your search.</div>
      )}
    </AppShell>
  );
}
