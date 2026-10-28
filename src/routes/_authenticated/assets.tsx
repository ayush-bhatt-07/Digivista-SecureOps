import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { FileDown, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusPill, statusTone } from "@/components/status-pill";
import { useSecureOps } from "@/hooks/use-secureops";
import { createAsset, deleteAssets, downloadCsv, updateAsset, type Asset } from "@/lib/secureops-data";

export const Route = createFileRoute("/_authenticated/assets")({
  head: () => ({
    meta: [
      { title: "Asset Management — Digivista SecureOps" },
      {
        name: "description",
        content:
          "Register, track and service CCTV, NVR, network, biometric and server assets with warranty, health and engineer assignment.",
      },
      { property: "og:title", content: "Asset Management — Digivista SecureOps" },
      { property: "og:description", content: "Full lifecycle asset registry for managed infrastructure." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AssetsPage,
});

const TYPES: Asset["type"][] = [
  "CCTV",
  "NVR",
  "DVR",
  "Server",
  "Switch",
  "Router",
  "Firewall",
  "Access Point",
  "Biometric",
  "Laptop",
  "UPS",
  "Printer",
];
const STATUSES: Asset["status"][] = ["active", "maintenance", "faulty", "inactive"];

function AssetsPage() {
  const { assets, companies, engineers } = useSecureOps();
  const [query, setQuery] = useState("");
  const [type, setType] = useState("all");
  const [status, setStatus] = useState("all");
  const [selected, setSelected] = useState<string[]>([]);
  const [open, setOpen] = useState(false);

  const filtered = useMemo(
    () =>
      assets.filter(
        (a) =>
          (type === "all" || a.type === type) &&
          (status === "all" || a.status === status) &&
          `${a.id} ${a.name} ${a.serial} ${a.company} ${a.branch} ${a.engineer}`
            .toLowerCase()
            .includes(query.toLowerCase()),
      ),
    [assets, query, type, status],
  );

  const allSelected = filtered.length > 0 && filtered.every((a) => selected.includes(a.id));

  function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    createAsset({
      name: String(f.get("name")),
      type: String(f.get("type")) as Asset["type"],
      serial: String(f.get("serial")),
      brand: String(f.get("brand")),
      company: String(f.get("company")),
      branch: String(f.get("branch")),
      warrantyEnd: String(f.get("warrantyEnd")),
      health: 100,
      status: "active",
      engineer: String(f.get("engineer")),
    });
    setOpen(false);
    toast.success("Asset registered and added to the registry");
  }

  return (
    <AppShell title="Asset Management" description="Unified registry for every managed device across tenants and branches.">
      <Card className="panel border-0 shadow-none">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative min-w-[220px] flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search asset, serial, branch…"
                className="pl-9"
              />
            </div>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                {TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {STATUSES.map((s) => (
                  <SelectItem key={s} value={s} className="capitalize">
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={() => {
                downloadCsv("digivista-assets.csv", filtered);
                toast.success(`${filtered.length} assets exported to CSV`);
              }}
            >
              <FileDown className="mr-2 h-4 w-4" /> Export
            </Button>
            {selected.length > 0 && (
              <Button
                variant="destructive"
                onClick={() => {
                  deleteAssets(selected);
                  toast.success(`${selected.length} asset(s) removed`);
                  setSelected([]);
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete ({selected.length})
              </Button>
            )}
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Register asset
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Register new asset</DialogTitle>
                  <DialogDescription>Asset ID and QR reference are generated automatically.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreate} className="grid gap-3 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <Label htmlFor="name">Asset name</Label>
                    <Input id="name" name="name" required placeholder="Reception dome camera" />
                  </div>
                  <div>
                    <Label htmlFor="type">Type</Label>
                    <select
                      id="type"
                      name="type"
                      className="mt-1 h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                    >
                      {TYPES.map((t) => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="brand">Brand</Label>
                    <Input id="brand" name="brand" required placeholder="Hikvision" />
                  </div>
                  <div>
                    <Label htmlFor="serial">Serial number</Label>
                    <Input id="serial" name="serial" required placeholder="HK-DS2CD-00000" />
                  </div>
                  <div>
                    <Label htmlFor="warrantyEnd">Warranty end</Label>
                    <Input id="warrantyEnd" name="warrantyEnd" type="date" required />
                  </div>
                  <div>
                    <Label htmlFor="company">Company</Label>
                    <select
                      id="company"
                      name="company"
                      className="mt-1 h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                    >
                      {companies.map((c) => (
                        <option key={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="branch">Branch</Label>
                    <Input id="branch" name="branch" required placeholder="Andheri HQ" />
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="engineer">Assigned engineer</Label>
                    <select
                      id="engineer"
                      name="engineer"
                      className="mt-1 h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                    >
                      {engineers.map((e) => (
                        <option key={e.id}>{e.name}</option>
                      ))}
                    </select>
                  </div>
                  <DialogFooter className="sm:col-span-2">
                    <Button type="submit">Save asset</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="mt-4 overflow-x-auto rounded-md border border-border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/60">
                  <TableHead className="w-10">
                    <Checkbox
                      checked={allSelected}
                      onCheckedChange={(v) => setSelected(v ? filtered.map((a) => a.id) : [])}
                      aria-label="Select all"
                    />
                  </TableHead>
                  <TableHead>Asset</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Tenant / Branch</TableHead>
                  <TableHead>Warranty</TableHead>
                  <TableHead className="w-40">Health</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell>
                      <Checkbox
                        checked={selected.includes(a.id)}
                        onCheckedChange={(v) =>
                          setSelected((s) => (v ? [...s, a.id] : s.filter((x) => x !== a.id)))
                        }
                        aria-label={`Select ${a.id}`}
                      />
                    </TableCell>
                    <TableCell>
                      <p className="font-medium text-foreground">{a.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {a.id} · {a.brand} · {a.serial}
                      </p>
                    </TableCell>
                    <TableCell className="text-sm">{a.type}</TableCell>
                    <TableCell className="text-sm">
                      <p>{a.company}</p>
                      <p className="text-xs text-muted-foreground">{a.branch}</p>
                    </TableCell>
                    <TableCell className="text-sm">{a.warrantyEnd}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={a.health} className="h-1.5 w-20" />
                        <span className="text-xs font-medium">{a.health}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusPill tone={statusTone(a.status)}>{a.status}</StatusPill>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          const next = a.status === "maintenance" ? "active" : "maintenance";
                          updateAsset(a.id, { status: next, health: next === "active" ? 100 : a.health });
                          toast.success(
                            next === "maintenance" ? `${a.id} moved to maintenance` : `${a.id} restored to service`,
                          );
                        }}
                      >
                        {a.status === "maintenance" ? "Restore" : "Service"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="py-12 text-center text-sm text-muted-foreground">
                      No assets match the current filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Showing {filtered.length} of {assets.length} assets
          </p>
        </CardContent>
      </Card>
    </AppShell>
  );
}
