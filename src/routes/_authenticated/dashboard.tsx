import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Activity,
  ArrowUpRight,
  HardDrive,
  ShieldCheck,
  Ticket as TicketIcon,
  TrendingUp,
  Users,
  Plus,
  FileDown,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { StatusPill, statusTone, priorityTone, label } from "@/components/status-pill";
import { useSecureOps } from "@/hooks/use-secureops";
import { downloadCsv } from "@/lib/secureops-data";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Digivista SecureOps — Operations Dashboard" },
      {
        name: "description",
        content:
          "Enterprise command centre for CCTV, biometric, network and IT asset operations: live KPIs, SLA performance and engineer activity.",
      },
      { property: "og:title", content: "Digivista SecureOps — Operations Dashboard" },
      {
        property: "og:description",
        content:
          "Multi-tenant SecureOps command centre for managed infrastructure, tickets and AMC.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

const revenue = [
  { m: "Feb", amc: 18.2, services: 6.4 },
  { m: "Mar", amc: 19.6, services: 7.1 },
  { m: "Apr", amc: 21.4, services: 6.9 },
  { m: "May", amc: 22.8, services: 8.6 },
  { m: "Jun", amc: 24.1, services: 9.4 },
  { m: "Jul", amc: 26.7, services: 11.2 },
];

function Kpi({
  icon: Icon,
  title,
  value,
  delta,
  hint,
}: {
  icon: typeof Activity;
  title: string;
  value: string;
  delta?: string;
  hint: string;
}) {
  return (
    <Card className="panel border-0 shadow-none">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary-soft text-primary">
            <Icon className="h-5 w-5" />
          </div>
          {delta && (
            <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-[11px] font-semibold text-success">
              <ArrowUpRight className="h-3 w-3" />
              {delta}
            </span>
          )}
        </div>
        <p className="mt-4 text-2xl font-bold tracking-tight text-foreground">{value}</p>
        <p className="text-sm font-medium text-foreground/80">{title}</p>
        <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
      </CardContent>
    </Card>
  );
}

function Dashboard() {
  const { assets, tickets, engineers, companies, audit } = useSecureOps();

  const open = tickets.filter((t) => t.status === "open" || t.status === "in_progress").length;
  const resolved = tickets.filter((t) => t.status === "resolved" || t.status === "closed").length;
  const online = engineers.filter((e) => e.availability !== "offline").length;

  const byType = Object.entries(
    assets.reduce<Record<string, number>>((acc, a) => {
      acc[a.type] = (acc[a.type] ?? 0) + 1;
      return acc;
    }, {}),
  ).map(([type, count]) => ({ type, count }));

  const slaAdherence = Math.round((resolved / Math.max(tickets.length, 1)) * 100);

  return (
    <AppShell
      title="Operations Dashboard"
      description="Live posture across every managed tenant, device and field engineer."
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi
          icon={TrendingUp}
          title="AMC revenue (FY, ₹L)"
          value="132.8"
          delta="11.4%"
          hint="Recurring contracts across 5 tenants"
        />
        <Kpi
          icon={TicketIcon}
          title="Open tickets"
          value={String(open)}
          hint={`${resolved} resolved in the last 30 days`}
        />
        <Kpi
          icon={HardDrive}
          title="Managed assets"
          value={String(assets.length)}
          delta="4.2%"
          hint="CCTV, network, biometric & servers"
        />
        <Kpi
          icon={Users}
          title="Engineers available"
          value={`${online}/${engineers.length}`}
          hint="Live field availability"
        />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card className="panel border-0 shadow-none lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">Revenue trend — AMC vs services (₹L)</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                downloadCsv("digivista-revenue.csv", revenue);
                toast.success("Revenue report exported");
              }}
            >
              <FileDown className="mr-2 h-4 w-4" /> Export
            </Button>
          </CardHeader>
          <CardContent className="h-[280px] pt-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenue} margin={{ left: -18, right: 8, top: 8 }}>
                <defs>
                  <linearGradient id="amc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="svc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-chart-2)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--color-chart-2)" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--color-border)"
                  vertical={false}
                />
                <XAxis
                  dataKey="m"
                  tickLine={false}
                  axisLine={false}
                  fontSize={12}
                  stroke="var(--color-muted-foreground)"
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  fontSize={12}
                  stroke="var(--color-muted-foreground)"
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-surface)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "8px",
                    fontSize: 12,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="amc"
                  stroke="var(--color-chart-1)"
                  fill="url(#amc)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="services"
                  stroke="var(--color-chart-2)"
                  fill="url(#svc)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="panel border-0 shadow-none">
          <CardHeader>
            <CardTitle className="text-base">Assets by type</CardTitle>
          </CardHeader>
          <CardContent className="h-[280px] pt-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byType} margin={{ left: -22, right: 8, top: 8 }}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--color-border)"
                  vertical={false}
                />
                <XAxis
                  dataKey="type"
                  tickLine={false}
                  axisLine={false}
                  fontSize={11}
                  stroke="var(--color-muted-foreground)"
                  interval={0}
                  angle={-30}
                  textAnchor="end"
                  height={54}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  fontSize={12}
                  stroke="var(--color-muted-foreground)"
                  allowDecimals={false}
                />
                <Tooltip
                  cursor={{ fill: "var(--color-muted)" }}
                  contentStyle={{
                    background: "var(--color-surface)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "8px",
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="count" fill="var(--color-chart-1)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card className="panel border-0 shadow-none lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">Priority queue</CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link to="/tickets">Open service desk</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-2 pt-0">
            {tickets.slice(0, 5).map((t) => (
              <div
                key={t.id}
                className="flex flex-wrap items-center gap-3 rounded-md border border-border bg-background/60 px-3 py-2.5"
              >
                <StatusPill tone={priorityTone(t.priority)}>{t.priority}</StatusPill>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{t.subject}</p>
                  <p className="text-xs text-muted-foreground">
                    {t.id} · {t.company} · {t.engineer}
                  </p>
                </div>
                <StatusPill tone={statusTone(t.status)}>{label(t.status)}</StatusPill>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="panel border-0 shadow-none">
            <CardHeader>
              <CardTitle className="text-base">SLA performance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
              <div>
                <div className="mb-1.5 flex justify-between text-sm">
                  <span className="text-muted-foreground">Resolution within SLA</span>
                  <span className="font-semibold">{slaAdherence}%</span>
                </div>
                <Progress value={slaAdherence} />
              </div>
              <div>
                <div className="mb-1.5 flex justify-between text-sm">
                  <span className="text-muted-foreground">First response</span>
                  <span className="font-semibold">94%</span>
                </div>
                <Progress value={94} />
              </div>
              <div>
                <div className="mb-1.5 flex justify-between text-sm">
                  <span className="text-muted-foreground">Preventive maintenance done</span>
                  <span className="font-semibold">81%</span>
                </div>
                <Progress value={81} />
              </div>
            </CardContent>
          </Card>

          <Card className="panel border-0 shadow-none">
            <CardHeader>
              <CardTitle className="text-base">Quick actions</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2 pt-0">
              <Button asChild>
                <Link to="/tickets">
                  <Plus className="mr-2 h-4 w-4" /> Raise ticket
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/assets">
                  <HardDrive className="mr-2 h-4 w-4" /> Register asset
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/endpoints">
                  <ShieldCheck className="mr-2 h-4 w-4" /> Endpoint health
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card className="panel border-0 shadow-none">
          <CardHeader>
            <CardTitle className="text-base">Tenant health</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 pt-0">
            {companies.map((c) => (
              <div
                key={c.id}
                className="flex items-center gap-3 rounded-md border border-border px-3 py-2.5"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary-soft text-xs font-bold text-primary">
                  {c.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{c.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {c.branches} branches · {c.assets} assets
                  </p>
                </div>
                <StatusPill tone={statusTone(c.amcStatus)}>AMC {c.amcStatus}</StatusPill>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="panel border-0 shadow-none">
          <CardHeader>
            <CardTitle className="text-base">Recent activity</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ul className="space-y-3">
              {audit.slice(0, 8).map((a) => (
                <li key={a.id} className="flex gap-3 text-sm">
                  <Activity className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  <div>
                    <p className="text-foreground">{a.action}</p>
                    <p className="text-xs text-muted-foreground">
                      {a.actor} · {a.entity} · {a.at}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
