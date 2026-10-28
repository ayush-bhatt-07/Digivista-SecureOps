import type { ReactNode } from "react";
import {
  ArrowUpRight,
  Bell,
  Building2,
  Camera,
  CheckCircle2,
  Clock,
  Cpu,
  FileSignature,
  HardDrive,
  LayoutDashboard,
  Lock,
  MonitorSmartphone,
  Search,
  Server,
  ShieldCheck,
  Ticket,
  Users,
  Wifi,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Shared primitives                                                   */
/* ------------------------------------------------------------------ */

const tones = {
  primary: "bg-primary-soft text-primary",
  accent: "bg-accent-soft text-accent-foreground",
  success: "bg-success/10 text-success",
  warning: "bg-accent-soft text-accent-foreground",
  danger: "bg-destructive/10 text-destructive",
  muted: "bg-muted text-muted-foreground",
} as const;

export function Pill({
  tone = "muted",
  children,
  className,
}: {
  tone?: keyof typeof tones;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-[9px] font-semibold leading-4",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

function Meter({ value, tone = "bg-primary" }: { value: number; tone?: string }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
      <div className={cn("h-full rounded-full", tone)} style={{ width: `${value}%` }} />
    </div>
  );
}

export function Ring({
  value,
  size = 68,
  stroke = 7,
  color = "var(--color-primary)",
  children,
}: {
  value: number;
  size?: number;
  stroke?: number;
  color?: string;
  children?: ReactNode;
}) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-muted)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - value / 100)}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
        {children}
      </div>
    </div>
  );
}

function MiniChart({ id, className }: { id: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 320 120"
      className={cn("h-full w-full", className)}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`${id}-a`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity="0.32" />
          <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity="0.02" />
        </linearGradient>
        <linearGradient id={`${id}-b`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-chart-2)" stopOpacity="0.26" />
          <stop offset="100%" stopColor="var(--color-chart-2)" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      {[22, 50, 78, 106].map((y) => (
        <line
          key={y}
          x1="0"
          y1={y}
          x2="320"
          y2={y}
          stroke="var(--color-border)"
          strokeWidth="1"
          strokeDasharray="3 5"
        />
      ))}
      <path
        d="M0 92 L40 80 L80 84 L120 64 L160 68 L200 46 L240 50 L280 30 L320 22 L320 120 L0 120 Z"
        fill={`url(#${id}-b)`}
      />
      <path
        d="M0 74 L40 62 L80 66 L120 46 L160 50 L200 30 L240 34 L280 18 L320 10 L320 120 L0 120 Z"
        fill={`url(#${id}-a)`}
      />
      <path
        d="M0 74 L40 62 L80 66 L120 46 L160 50 L200 30 L240 34 L280 18 L320 10"
        fill="none"
        stroke="var(--color-chart-1)"
        strokeWidth="2"
        strokeLinecap="round"
        className="landing-draw"
      />
      <path
        d="M0 92 L40 80 L80 84 L120 64 L160 68 L200 46 L240 50 L280 30 L320 22"
        fill="none"
        stroke="var(--color-chart-2)"
        strokeWidth="2"
        strokeLinecap="round"
        className="landing-draw"
        style={{ animationDelay: "0.55s" }}
      />
    </svg>
  );
}

function Sparkline({ up = true }: { up?: boolean }) {
  return (
    <svg viewBox="0 0 44 16" className="h-3.5 w-10" aria-hidden="true">
      <path
        d={
          up
            ? "M0 13 L8 11 L15 12 L22 7 L30 8 L37 4 L44 2"
            : "M0 3 L8 6 L15 5 L22 9 L30 8 L37 12 L44 13"
        }
        fill="none"
        stroke={up ? "var(--color-success)" : "var(--color-destructive)"}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Window chrome                                                       */
/* ------------------------------------------------------------------ */

export function ConsoleFrame({
  children,
  className,
  url = "app.digivista.in/secureops",
}: {
  children: ReactNode;
  className?: string;
  url?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-border bg-surface text-foreground shadow-[0_30px_90px_-24px_rgba(6,20,40,0.55)] sm:rounded-2xl",
        className,
      )}
    >
      <div className="flex items-center gap-2 border-b border-border bg-muted/50 px-3 py-2 sm:px-4">
        <div className="flex gap-1.5">
          <span className="h-2 w-2 rounded-full bg-destructive/60" />
          <span className="h-2 w-2 rounded-full bg-accent/70" />
          <span className="h-2 w-2 rounded-full bg-success/60" />
        </div>
        <div className="mx-auto flex max-w-[220px] flex-1 items-center justify-center gap-1.5 truncate rounded-md border border-border bg-surface px-2.5 py-1 text-[9px] text-muted-foreground">
          <Lock className="h-2.5 w-2.5 shrink-0" />
          <span className="truncate">{url}</span>
        </div>
        <span className="hidden items-center gap-1 text-[9px] font-medium text-muted-foreground sm:flex">
          <span className="h-1.5 w-1.5 rounded-full bg-success" />
          Live
        </span>
      </div>
      {children}
    </div>
  );
}

const sidebarIcons = [LayoutDashboard, Ticket, MonitorSmartphone, HardDrive, FileSignature];

function MiniSidebar({ active = 0 }: { active?: number }) {
  return (
    <aside className="hidden w-10 shrink-0 flex-col items-center gap-1.5 border-r border-border bg-sidebar py-3 sm:flex">
      <span className="mb-1 flex h-5 w-5 items-center justify-center rounded bg-accent text-[8px] font-bold text-accent-foreground">
        D
      </span>
      {sidebarIcons.map((Icon, i) => (
        <span
          key={i}
          className={cn(
            "flex h-6 w-6 items-center justify-center rounded-md",
            i === active ? "bg-sidebar-accent text-sidebar-primary" : "text-sidebar-foreground/45",
          )}
        >
          <Icon className="h-3 w-3" />
        </span>
      ))}
    </aside>
  );
}

function ScreenHeader({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle: string;
  right?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <div className="min-w-0">
        <p className="text-[8px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          {subtitle}
        </p>
        <p className="truncate text-[13px] font-semibold tracking-tight">{title}</p>
      </div>
      <div className="flex items-center gap-1.5">{right}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Hero console                                                        */
/* ------------------------------------------------------------------ */

const heroKpis = [
  { label: "Managed assets", value: "1,866", delta: "+4.2%", up: true, icon: HardDrive },
  { label: "Open tickets", value: "37", delta: "−12%", up: false, icon: Ticket },
  { label: "Engineers live", value: "24/28", delta: "86%", up: true, icon: Users },
  { label: "AMC revenue", value: "₹132.8L", delta: "+11.4%", up: true, icon: FileSignature },
];

export function HeroConsole() {
  return (
    <div className="relative mx-auto w-full max-w-[640px] lg:max-w-none">
      <div className="pointer-events-none absolute -inset-8 rounded-[2.5rem] bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--color-primary)_45%,transparent),transparent)] blur-2xl" />

      <div className="relative lg:[transform:perspective(1800px)_rotateY(-7deg)_rotateX(2.5deg)] lg:transition-transform lg:duration-700 lg:hover:[transform:perspective(1800px)_rotateY(-2deg)_rotateX(0deg)]">
        <ConsoleFrame>
          <div className="flex bg-surface">
            <MiniSidebar active={0} />
            <div className="min-w-0 flex-1 p-3 sm:p-4">
              <ScreenHeader
                subtitle="Operations"
                title="Command centre"
                right={
                  <>
                    <Pill tone="primary">
                      <Building2 className="h-2.5 w-2.5" /> 5 tenants
                    </Pill>
                    <Pill tone="accent">
                      <Clock className="h-2.5 w-2.5" /> 4h SLA
                    </Pill>
                  </>
                }
              />

              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {heroKpis.map((kpi) => (
                  <div
                    key={kpi.label}
                    className="rounded-lg border border-border/80 bg-background/70 p-2"
                  >
                    <div className="flex items-center justify-between text-muted-foreground">
                      <kpi.icon className="h-3 w-3" />
                      <Sparkline up={kpi.up} />
                    </div>
                    <p className="mt-1.5 text-[13px] font-bold leading-none tracking-tight">
                      {kpi.value}
                    </p>
                    <p className="mt-1 truncate text-[8px] font-medium text-muted-foreground">
                      {kpi.label}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-2.5 grid gap-2 sm:grid-cols-[1.55fr_1fr]">
                <div className="rounded-lg border border-border/80 bg-surface p-2.5">
                  <div className="flex items-center justify-between">
                    <p className="text-[9px] font-semibold">Revenue trend</p>
                    <div className="flex items-center gap-2 text-[8px] text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-chart-1" /> AMC
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-chart-2" /> Services
                      </span>
                    </div>
                  </div>
                  <div className="mt-1 h-[86px]">
                    <MiniChart id="hero" />
                  </div>
                  <div className="mt-1 flex justify-between text-[7px] text-muted-foreground">
                    {["Feb", "Mar", "Apr", "May", "Jun", "Jul"].map((m) => (
                      <span key={m}>{m}</span>
                    ))}
                  </div>
                </div>

                <div className="rounded-lg border border-border/80 bg-surface p-2.5">
                  <div className="flex items-center gap-2.5">
                    <Ring value={96} size={54} stroke={6}>
                      <span className="text-[11px] font-bold leading-none">96%</span>
                      <span className="mt-0.5 text-[6px] uppercase tracking-wide text-muted-foreground">
                        SLA
                      </span>
                    </Ring>
                    <div className="min-w-0">
                      <p className="text-[9px] font-semibold leading-tight">
                        Resolution within SLA
                      </p>
                      <p className="mt-0.5 text-[8px] text-muted-foreground">Last 30 days</p>
                      <Pill tone="success" className="mt-1">
                        <ArrowUpRight className="h-2.5 w-2.5" /> 3.1%
                      </Pill>
                    </div>
                  </div>
                  <div className="mt-2 space-y-1">
                    {[
                      { label: "Camera 12 offline", tone: "danger" as const, tag: "Critical" },
                      { label: "Biometric sync", tone: "warning" as const, tag: "High" },
                      { label: "ERP disk 91%", tone: "primary" as const, tag: "Medium" },
                    ].map((row) => (
                      <div
                        key={row.label}
                        className="flex items-center gap-1.5 rounded-md bg-muted/50 px-1.5 py-1"
                      >
                        <span
                          className={cn(
                            "h-1.5 w-1.5 shrink-0 rounded-full",
                            row.tone === "danger"
                              ? "bg-destructive"
                              : row.tone === "warning"
                                ? "bg-accent"
                                : "bg-primary",
                          )}
                        />
                        <span className="min-w-0 flex-1 truncate text-[8px] font-medium">
                          {row.label}
                        </span>
                        <span className="text-[7px] text-muted-foreground">{row.tag}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ConsoleFrame>

        {/* Floating status cards */}
        <div className="landing-float-soft absolute -left-4 top-[42%] hidden w-[184px] rounded-xl border border-border bg-surface p-2.5 shadow-raised md:block lg:-left-10">
          <div className="flex items-start gap-2">
            <span className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
              <Camera className="h-3.5 w-3.5" />
              <span className="landing-pulse absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-destructive" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-[10px] font-semibold">Camera 12 offline</p>
              <p className="truncate text-[8px] text-muted-foreground">Northline · Cold storage</p>
              <Pill tone="danger" className="mt-1">
                Critical · 4h SLA
              </Pill>
            </div>
          </div>
        </div>

        <div
          className="landing-float absolute -bottom-5 right-0 hidden w-[176px] rounded-xl border border-border bg-surface p-2.5 shadow-raised sm:block lg:-right-6"
          style={{ animationDelay: "-2.4s" }}
        >
          <div className="flex items-center justify-between">
            <p className="text-[9px] font-semibold">AMC renewal</p>
            <Pill tone="warning">12 days</Pill>
          </div>
          <p className="mt-0.5 truncate text-[8px] text-muted-foreground">
            Northline Logistics · ₹18.4L
          </p>
          <div className="mt-1.5">
            <Meter value={78} tone="bg-accent" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Showcase screens                                                    */
/* ------------------------------------------------------------------ */

export type ShowcaseVariant = "overview" | "tickets" | "amc" | "endpoints";

const ticketRows = [
  {
    id: "TKT-9001",
    subject: "Camera 12 offline in cold storage",
    tenant: "Northline Logistics",
    priority: "Critical",
    tone: "danger" as const,
    sla: 74,
    status: "In progress",
    statusTone: "primary" as const,
  },
  {
    id: "TKT-9002",
    subject: "Biometric punch sync failing",
    tenant: "Sterling Retail",
    priority: "High",
    tone: "warning" as const,
    sla: 52,
    status: "Open",
    statusTone: "muted" as const,
  },
  {
    id: "TKT-9003",
    subject: "Packet loss on Hebbal uplink",
    tenant: "Northline Logistics",
    priority: "High",
    tone: "warning" as const,
    sla: 38,
    status: "On hold",
    statusTone: "muted" as const,
  },
  {
    id: "TKT-9004",
    subject: "ERP server disk at 91%",
    tenant: "Vertex Manufacturing",
    priority: "Medium",
    tone: "primary" as const,
    sla: 61,
    status: "In progress",
    statusTone: "primary" as const,
  },
  {
    id: "TKT-9005",
    subject: "NVR firmware upgrade request",
    tenant: "Aurora Textiles",
    priority: "Low",
    tone: "muted" as const,
    sla: 90,
    status: "Resolved",
    statusTone: "success" as const,
  },
];

const endpointRows = [
  {
    host: "aurora-hq-nvr01",
    os: "Windows Server 2022",
    cpu: 38,
    ram: 61,
    disk: 44,
    patch: "Current",
    tone: "success" as const,
  },
  {
    host: "northline-dc-fw01",
    os: "FortiOS 7.4",
    cpu: 22,
    ram: 40,
    disk: 31,
    patch: "Current",
    tone: "success" as const,
  },
  {
    host: "sterling-pos-114",
    os: "Windows 11 Pro",
    cpu: 71,
    ram: 68,
    disk: 83,
    patch: "Pending",
    tone: "warning" as const,
  },
  {
    host: "meridian-erp-app",
    os: "Ubuntu 24.04 LTS",
    cpu: 56,
    ram: 74,
    disk: 91,
    patch: "Critical",
    tone: "danger" as const,
  },
  {
    host: "vertex-plc-gw",
    os: "Windows 10 IoT",
    cpu: 44,
    ram: 52,
    disk: 60,
    patch: "Pending",
    tone: "warning" as const,
  },
];

const contracts = [
  {
    company: "Aurora Textiles",
    plan: "Comprehensive",
    value: "₹42.6L",
    date: "Ends 14 Mar 2027",
    status: "Active",
    tone: "success" as const,
    progress: 72,
  },
  {
    company: "Northline Logistics",
    plan: "Non-Comprehensive",
    value: "₹18.4L",
    date: "Ends 09 Nov 2026",
    status: "Expiring",
    tone: "warning" as const,
    progress: 91,
  },
  {
    company: "Vertex Manufacturing",
    plan: "Labour Only",
    value: "₹6.2L",
    date: "Ended 02 Jul 2026",
    status: "Expired",
    tone: "danger" as const,
    progress: 100,
  },
];

function OverviewScreen() {
  return (
    <div className="min-w-0 flex-1 p-3 sm:p-5">
      <ScreenHeader
        subtitle="Overview"
        title="Operations command centre"
        right={
          <>
            <Pill tone="primary">5 tenants</Pill>
            <Pill tone="accent">
              <Clock className="h-2.5 w-2.5" /> 4h critical SLA
            </Pill>
          </>
        }
      />

      <div className="mt-3 grid grid-cols-2 gap-2 lg:grid-cols-4">
        {heroKpis.map((kpi) => (
          <div key={kpi.label} className="rounded-lg border border-border bg-background/70 p-2.5">
            <div className="flex items-center justify-between">
              <kpi.icon className="h-3 w-3 text-muted-foreground" />
              <Sparkline up={kpi.up} />
            </div>
            <p className="mt-2 text-sm font-bold leading-none tracking-tight sm:text-base">
              {kpi.value}
            </p>
            <p className="mt-1 truncate text-[9px] font-medium text-muted-foreground">
              {kpi.label}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-2.5 grid gap-2.5 lg:grid-cols-[1.6fr_1fr]">
        <div className="rounded-lg border border-border p-3">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-semibold">Revenue trend — AMC vs services</p>
            <div className="flex items-center gap-2 text-[8px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-chart-1" /> AMC
              </span>
              <span className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-chart-2" /> Services
              </span>
            </div>
          </div>
          <div className="mt-2 h-[190px] sm:h-[236px]">
            <MiniChart id="showcase-overview" />
          </div>
          <div className="mt-1 flex justify-between text-[7px] text-muted-foreground">
            {["Feb", "Mar", "Apr", "May", "Jun", "Jul"].map((m) => (
              <span key={m}>{m}</span>
            ))}
          </div>
        </div>

        <div className="space-y-2.5">
          <div className="rounded-lg border border-border p-3">
            <div className="flex items-center gap-3">
              <Ring value={96} size={62} stroke={6}>
                <span className="text-xs font-bold leading-none">96%</span>
                <span className="mt-0.5 text-[6px] uppercase tracking-wide text-muted-foreground">
                  SLA
                </span>
              </Ring>
              <div>
                <p className="text-[10px] font-semibold">Resolution within SLA</p>
                <p className="text-[8px] text-muted-foreground">Rolling 30 days</p>
                <Pill tone="success" className="mt-1">
                  <ArrowUpRight className="h-2.5 w-2.5" /> 3.1%
                </Pill>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-border p-3">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-semibold">Priority queue</p>
              <Pill tone="accent">7 open</Pill>
            </div>
            <div className="mt-2 space-y-1.5">
              {ticketRows.slice(0, 3).map((t) => (
                <div key={t.id} className="flex items-center gap-1.5">
                  <span
                    className={cn(
                      "h-1.5 w-1.5 shrink-0 rounded-full",
                      t.tone === "danger"
                        ? "bg-destructive"
                        : t.tone === "warning"
                          ? "bg-accent"
                          : "bg-primary",
                    )}
                  />
                  <span className="min-w-0 flex-1 truncate text-[8px] font-medium">
                    {t.subject}
                  </span>
                  <span className="text-[7px] text-muted-foreground">{t.priority}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TicketsScreen() {
  return (
    <div className="min-w-0 flex-1 p-3 sm:p-5">
      <ScreenHeader
        subtitle="Service desk"
        title="SLA-governed tickets"
        right={
          <>
            <Pill tone="success">96% within SLA</Pill>
            <Pill tone="muted">7 open</Pill>
          </>
        }
      />

      <div className="mt-3 flex flex-wrap gap-1.5">
        {["All", "Critical", "High", "Medium", "Low"].map((f, i) => (
          <span
            key={f}
            className={cn(
              "rounded-full border px-2 py-0.5 text-[8px] font-medium",
              i === 0
                ? "border-primary/30 bg-primary-soft text-primary"
                : "border-border text-muted-foreground",
            )}
          >
            {f}
          </span>
        ))}
      </div>

      <div className="mt-2.5 overflow-hidden rounded-lg border border-border">
        <div className="hidden grid-cols-[1.9fr_0.9fr_1fr_0.8fr] gap-2 bg-muted/60 px-3 py-1.5 text-[7px] font-semibold uppercase tracking-wide text-muted-foreground sm:grid">
          <span>Ticket</span>
          <span>Priority</span>
          <span>SLA remaining</span>
          <span className="text-right">Status</span>
        </div>
        {ticketRows.map((t) => (
          <div
            key={t.id}
            className="grid grid-cols-[1.9fr_0.8fr] items-center gap-2 border-t border-border/70 px-3 py-2 sm:grid-cols-[1.9fr_0.9fr_1fr_0.8fr]"
          >
            <div className="min-w-0">
              <p className="truncate text-[9px] font-semibold">{t.subject}</p>
              <p className="truncate text-[7px] text-muted-foreground">
                {t.id} · {t.tenant}
              </p>
            </div>
            <div>
              <Pill tone={t.tone}>{t.priority}</Pill>
            </div>
            <div className="hidden sm:block">
              <Meter
                value={t.sla}
                tone={
                  t.tone === "danger"
                    ? "bg-destructive"
                    : t.tone === "warning"
                      ? "bg-accent"
                      : "bg-primary"
                }
              />
              <p className="mt-0.5 text-[7px] text-muted-foreground">{t.sla}% of window left</p>
            </div>
            <div className="hidden justify-end sm:flex">
              <Pill tone={t.statusTone}>{t.status}</Pill>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-2.5 grid grid-cols-3 gap-2">
        {[
          { label: "First response", value: "94%", tone: "bg-primary" },
          { label: "Preventive done", value: "81%", tone: "bg-accent" },
          { label: "Reopened", value: "2.4%", tone: "bg-success" },
        ].map((s) => (
          <div key={s.label} className="rounded-lg border border-border p-2">
            <p className="text-[10px] font-bold">{s.value}</p>
            <p className="mt-0.5 text-[7px] text-muted-foreground">{s.label}</p>
            <div className="mt-1">
              <Meter value={parseFloat(s.value)} tone={s.tone} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AmcScreen() {
  return (
    <div className="min-w-0 flex-1 p-3 sm:p-5">
      <ScreenHeader
        subtitle="AMC & contracts"
        title="Renewals, invoices, visits"
        right={
          <>
            <Pill tone="warning">2 expiring</Pill>
            <Pill tone="danger">₹4.8L overdue</Pill>
          </>
        }
      />

      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        {contracts.map((c) => (
          <div key={c.company} className="rounded-lg border border-border p-2.5">
            <div className="flex items-center justify-between gap-1">
              <p className="truncate text-[9px] font-semibold">{c.company}</p>
              <Pill tone={c.tone}>{c.status}</Pill>
            </div>
            <p className="mt-0.5 truncate text-[7px] text-muted-foreground">{c.plan}</p>
            <p className="mt-1.5 text-sm font-bold leading-none tracking-tight">{c.value}</p>
            <p className="mt-0.5 text-[7px] text-muted-foreground">{c.date}</p>
            <div className="mt-1.5">
              <Meter
                value={c.progress}
                tone={
                  c.tone === "danger"
                    ? "bg-destructive"
                    : c.tone === "warning"
                      ? "bg-accent"
                      : "bg-success"
                }
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-2.5 rounded-lg border border-border p-3">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-semibold">Renewal runway</p>
          <div className="flex gap-2 text-[7px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-success" /> Active
            </span>
            <span className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" /> Expiring
            </span>
            <span className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-destructive" /> Expired
            </span>
          </div>
        </div>

        <div className="relative mt-4 h-1.5 rounded-full bg-muted">
          <div className="absolute inset-y-0 left-0 w-[62%] rounded-full bg-success/70" />
          <div className="absolute inset-y-0 left-[62%] w-[26%] rounded-full bg-accent/80" />
          <div className="absolute inset-y-0 left-[88%] right-0 rounded-full bg-destructive/70" />
          {[
            { left: "18%", label: "Aurora", tone: "bg-success" },
            { left: "62%", label: "Northline", tone: "bg-accent" },
            { left: "88%", label: "Vertex", tone: "bg-destructive" },
          ].map((m) => (
            <span
              key={m.label}
              className="absolute -top-1 -translate-x-1/2"
              style={{ left: m.left }}
            >
              <span
                className={cn("block h-3.5 w-3.5 rounded-full border-2 border-surface", m.tone)}
              />
              <span className="absolute left-1/2 top-4 -translate-x-1/2 whitespace-nowrap text-[7px] text-muted-foreground">
                {m.label}
              </span>
            </span>
          ))}
        </div>
        <div className="mt-7 flex justify-between text-[7px] text-muted-foreground">
          {["Jul", "Oct", "Jan", "Apr", "Jul"].map((m) => (
            <span key={m}>{m}</span>
          ))}
        </div>
      </div>

      <div className="mt-2.5 grid gap-2 sm:grid-cols-2">
        <div className="rounded-lg border border-border p-2.5">
          <div className="flex items-center justify-between">
            <p className="text-[9px] font-semibold">Next preventive visits</p>
            <Pill tone="primary">4 scheduled</Pill>
          </div>
          {[
            { date: "02 Nov", company: "Northline · Whitefield DC" },
            { date: "06 Nov", company: "Sterling · T. Nagar" },
          ].map((v) => (
            <div key={v.date} className="mt-1.5 flex items-center gap-2 text-[8px]">
              <span className="flex h-6 w-8 items-center justify-center rounded bg-primary-soft text-[7px] font-semibold text-primary">
                {v.date}
              </span>
              <span className="truncate text-muted-foreground">{v.company}</span>
            </div>
          ))}
        </div>
        <div className="rounded-lg border border-border p-2.5">
          <div className="flex items-center justify-between">
            <p className="text-[9px] font-semibold">Invoice register</p>
            <Pill tone="success">₹21.4L paid</Pill>
          </div>
          {[
            { id: "INV-2201", amount: "₹8.2L", tone: "success" as const, state: "Paid" },
            { id: "INV-2202", amount: "₹4.8L", tone: "danger" as const, state: "Overdue" },
          ].map((i) => (
            <div key={i.id} className="mt-1.5 flex items-center justify-between text-[8px]">
              <span className="text-muted-foreground">{i.id}</span>
              <span className="font-semibold">{i.amount}</span>
              <Pill tone={i.tone}>{i.state}</Pill>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function EndpointsScreen() {
  return (
    <div className="min-w-0 flex-1 p-3 sm:p-5">
      <ScreenHeader
        subtitle="Endpoint management"
        title="Fleet telemetry & remote actions"
        right={
          <>
            <Pill tone="success">
              <Wifi className="h-2.5 w-2.5" /> 128 online
            </Pill>
            <Pill tone="warning">9 pending patch</Pill>
          </>
        }
      />

      <div className="mt-3 grid grid-cols-3 gap-2">
        {[
          { label: "Agent uptime", value: "99.98%", icon: Wifi, tone: "success" as const },
          { label: "Patch compliance", value: "94%", icon: ShieldCheck, tone: "primary" as const },
          { label: "Avg. health", value: "91", icon: Cpu, tone: "accent" as const },
        ].map((s) => (
          <div key={s.label} className="rounded-lg border border-border p-2.5">
            <div className="flex items-center justify-between">
              <s.icon className="h-3 w-3 text-muted-foreground" />
              <Pill tone={s.tone}>{s.value}</Pill>
            </div>
            <p className="mt-1.5 truncate text-[8px] text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-2.5 overflow-hidden rounded-lg border border-border">
        <div className="hidden grid-cols-[1.5fr_0.9fr_1fr_1fr_1fr_0.7fr] gap-2 bg-muted/60 px-3 py-1.5 text-[7px] font-semibold uppercase tracking-wide text-muted-foreground sm:grid">
          <span>Endpoint</span>
          <span>OS</span>
          <span>CPU</span>
          <span>Memory</span>
          <span>Disk</span>
          <span className="text-right">Patch</span>
        </div>
        {endpointRows.map((e) => (
          <div
            key={e.host}
            className="grid grid-cols-[1.6fr_0.7fr] items-center gap-2 border-t border-border/70 px-3 py-2 sm:grid-cols-[1.5fr_0.9fr_1fr_1fr_1fr_0.7fr]"
          >
            <div className="flex min-w-0 items-center gap-1.5">
              <Server className="h-3 w-3 shrink-0 text-muted-foreground" />
              <span className="truncate text-[8px] font-semibold">{e.host}</span>
            </div>
            <span className="hidden truncate text-[7px] text-muted-foreground sm:block">
              {e.os}
            </span>
            <div className="hidden sm:block">
              <Meter value={e.cpu} tone={e.cpu > 70 ? "bg-accent" : "bg-primary"} />
              <span className="text-[6px] text-muted-foreground">{e.cpu}%</span>
            </div>
            <div className="hidden sm:block">
              <Meter value={e.ram} tone={e.ram > 70 ? "bg-accent" : "bg-primary"} />
              <span className="text-[6px] text-muted-foreground">{e.ram}%</span>
            </div>
            <div className="hidden sm:block">
              <Meter
                value={e.disk}
                tone={e.disk > 80 ? "bg-destructive" : e.disk > 60 ? "bg-accent" : "bg-success"}
              />
              <span className="text-[6px] text-muted-foreground">{e.disk}%</span>
            </div>
            <div className="flex justify-end">
              <Pill tone={e.tone}>{e.patch}</Pill>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-2.5 flex flex-wrap items-center gap-1.5 rounded-lg border border-border bg-muted/30 p-2">
        <span className="text-[7px] font-semibold uppercase tracking-wide text-muted-foreground">
          Remote
        </span>
        {[
          { icon: Search, label: "Diagnose" },
          { icon: ShieldCheck, label: "Patch" },
          { icon: CheckCircle2, label: "Restart" },
          { icon: Wifi, label: "Wake" },
        ].map((a) => (
          <span
            key={a.label}
            className="inline-flex items-center gap-1 rounded-md border border-border bg-surface px-1.5 py-0.5 text-[7px] font-medium"
          >
            <a.icon className="h-2.5 w-2.5" /> {a.label}
          </span>
        ))}
        <span className="ml-auto hidden items-center gap-1 text-[7px] text-muted-foreground sm:flex">
          <Bell className="h-2.5 w-2.5" /> Commands are audited
        </span>
      </div>
    </div>
  );
}

const sidebarActive: Record<ShowcaseVariant, number> = {
  overview: 0,
  tickets: 1,
  endpoints: 2,
  amc: 4,
};

const urls: Record<ShowcaseVariant, string> = {
  overview: "app.digivista.in/secureops",
  tickets: "app.digivista.in/secureops/tickets",
  amc: "app.digivista.in/secureops/amc",
  endpoints: "app.digivista.in/secureops/endpoints",
};

export function ShowcaseScreen({ variant }: { variant: ShowcaseVariant }) {
  return (
    <ConsoleFrame url={urls[variant]} className="shadow-[0_30px_90px_-30px_rgba(0,0,0,0.55)]">
      <div className="flex min-h-[420px] bg-surface sm:min-h-[460px]">
        <MiniSidebar active={sidebarActive[variant]} />
        {variant === "overview" && <OverviewScreen />}
        {variant === "tickets" && <TicketsScreen />}
        {variant === "amc" && <AmcScreen />}
        {variant === "endpoints" && <EndpointsScreen />}
      </div>
    </ConsoleFrame>
  );
}
