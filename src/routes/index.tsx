import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type KeyboardEvent, type ReactNode } from "react";
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  Building2,
  Camera,
  Check,
  ChevronRight,
  FileSignature,
  Fingerprint,
  HardDrive,
  KeyRound,
  Lock,
  MapPin,
  Menu,
  MonitorSmartphone,
  Network,
  ScrollText,
  Server,
  ShieldCheck,
  Ticket,
  Users,
  Wifi,
  X,
  Zap,
} from "lucide-react";
import { DigivistaLogo } from "@/components/digivista-logo";
import { CountUp, Reveal } from "@/components/landing/reveal";
import {
  HeroConsole,
  Pill,
  Ring,
  ShowcaseScreen,
  type ShowcaseVariant,
} from "@/components/landing/console-visual";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Digivista SecureOps — Every device. Every site. One console." },
      {
        name: "description",
        content:
          "Multi-tenant operations platform for CCTV, biometrics, networks, servers, endpoints, field engineers, service desk tickets and AMC contracts.",
      },
      {
        property: "og:title",
        content: "Digivista SecureOps — Every device. Every site. One console.",
      },
      {
        property: "og:description",
        content:
          "One command centre for the whole infrastructure estate: assets, endpoints, engineers, tickets, AMC and audit.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LandingPage,
});

/* ------------------------------------------------------------------ */
/* Small local primitives                                              */
/* ------------------------------------------------------------------ */

function Bar({ value, className }: { value: number; className?: string }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
      <div
        className={cn("h-full rounded-full bg-primary transition-[width] duration-700", className)}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

function Eyebrow({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return (
    <p
      className={cn(
        "inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em]",
        light ? "text-accent" : "text-primary",
      )}
    >
      <span className="h-1 w-1 rounded-full bg-accent" />
      {children}
    </p>
  );
}

const tenants = [
  { name: "Aurora Textiles", meta: "7 branches", mono: "AT" },
  { name: "Northline Logistics", meta: "12 branches", mono: "NL" },
  { name: "Meridian Health", meta: "5 branches", mono: "MH" },
  { name: "Sterling Retail", meta: "21 branches", mono: "SR" },
  { name: "Vertex Manufacturing", meta: "3 branches", mono: "VM" },
];

/* ------------------------------------------------------------------ */
/* Bento visuals                                                       */
/* ------------------------------------------------------------------ */

function AssetVisual() {
  const rows = [
    { icon: Camera, name: "CCTV cameras", count: "842", health: 94, tone: "bg-primary" },
    { icon: Network, name: "Network gear", count: "611", health: 88, tone: "bg-primary" },
    { icon: Fingerprint, name: "Biometric readers", count: "188", health: 76, tone: "bg-accent" },
    { icon: Server, name: "Servers & storage", count: "225", health: 91, tone: "bg-success" },
  ];

  return (
    <div className="space-y-2">
      {rows.map((row) => (
        <div
          key={row.name}
          className="flex items-center gap-2.5 rounded-lg border border-border/70 bg-background/70 px-2.5 py-2"
        >
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary-soft text-primary">
            <row.icon className="h-3.5 w-3.5" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline justify-between gap-2">
              <span className="truncate text-[11px] font-medium">{row.name}</span>
              <span className="text-[10px] font-semibold tabular-nums text-muted-foreground">
                {row.count}
              </span>
            </div>
            <div className="mt-1 flex items-center gap-2">
              <Bar value={row.health} className={row.tone} />
              <span className="w-6 shrink-0 text-right text-[9px] tabular-nums text-muted-foreground">
                {row.health}%
              </span>
            </div>
          </div>
        </div>
      ))}
      <div className="flex items-center gap-1.5 pt-0.5">
        <Pill tone="primary">
          <MapPin className="h-2.5 w-2.5" /> 48 sites
        </Pill>
        <Pill tone="success">
          <Check className="h-2.5 w-2.5" /> 1,866 tracked
        </Pill>
        <Pill tone="muted">12 categories</Pill>
      </div>
    </div>
  );
}

function DeskVisual() {
  const rows = [
    { label: "Camera 12 offline", tag: "Critical", tone: "danger" as const },
    { label: "Biometric sync", tag: "High", tone: "warning" as const },
    { label: "ERP disk at 91%", tag: "Medium", tone: "primary" as const },
    { label: "NVR firmware", tag: "Resolved", tone: "success" as const },
  ];

  return (
    <div className="flex h-full flex-col justify-center gap-3 sm:flex-row sm:items-center">
      <div className="flex shrink-0 items-center justify-center">
        <Ring value={96} size={96} stroke={9}>
          <span className="text-xl font-bold leading-none tracking-tight">96%</span>
          <span className="mt-1 text-[7px] uppercase tracking-[0.12em] text-muted-foreground">
            within SLA
          </span>
        </Ring>
      </div>
      <div className="min-w-0 flex-1 space-y-1.5">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-center gap-2 rounded-md bg-muted/50 px-2 py-1.5"
          >
            <span
              className={cn(
                "h-1.5 w-1.5 shrink-0 rounded-full",
                row.tone === "danger"
                  ? "bg-destructive"
                  : row.tone === "warning"
                    ? "bg-accent"
                    : row.tone === "success"
                      ? "bg-success"
                      : "bg-primary",
              )}
            />
            <span className="min-w-0 flex-1 truncate text-[10px] font-medium">{row.label}</span>
            <Pill tone={row.tone}>{row.tag}</Pill>
          </div>
        ))}
        <div className="flex items-center justify-between pt-0.5 text-[9px] text-muted-foreground">
          <span>First response 94%</span>
          <span className="flex items-center gap-1 text-success">
            <ArrowUpRight className="h-2.5 w-2.5" /> 3.1%
          </span>
        </div>
      </div>
    </div>
  );
}

const fleetTiles = [
  "ok",
  "ok",
  "ok",
  "warn",
  "ok",
  "ok",
  "ok",
  "ok",
  "ok",
  "ok",
  "ok",
  "ok",
  "bad",
  "ok",
  "ok",
  "ok",
  "warn",
  "ok",
  "ok",
  "ok",
  "ok",
  "ok",
  "ok",
  "ok",
  "ok",
  "warn",
  "ok",
  "ok",
];

function FleetVisual() {
  return (
    <div className="flex h-full flex-col justify-center">
      <div className="flex items-center justify-between text-[9px]">
        <span className="flex items-center gap-1 font-medium text-muted-foreground">
          <Wifi className="h-2.5 w-2.5 text-success" /> 128 reporting
        </span>
        <span className="font-semibold text-success">99.98% uptime</span>
      </div>
      <div className="mt-2 grid grid-cols-7 gap-1.5">
        {fleetTiles.map((tile, i) => (
          <span
            key={i}
            className={cn(
              "aspect-square rounded-[4px] transition-transform duration-200 hover:scale-110",
              tile === "ok"
                ? "bg-success/75"
                : tile === "warn"
                  ? "bg-accent/80"
                  : "bg-destructive/80",
            )}
          />
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between border-t border-border/70 pt-2.5">
        {[
          { label: "Healthy", count: "119", tone: "bg-success" },
          { label: "Patch pending", count: "9", tone: "bg-accent" },
          { label: "Critical", count: "1", tone: "bg-destructive" },
        ].map((l) => (
          <div key={l.label} className="flex items-center gap-1.5">
            <span className={cn("h-1.5 w-1.5 rounded-full", l.tone)} />
            <span className="text-[9px] text-muted-foreground">{l.label}</span>
            <span className="text-[9px] font-semibold tabular-nums">{l.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AmcVisual() {
  const rows = [
    {
      company: "Northline Logistics",
      value: "₹18.4L",
      badge: "12 days",
      tone: "warning" as const,
      progress: 88,
      bar: "bg-accent",
    },
    {
      company: "Aurora Textiles",
      value: "₹42.6L",
      badge: "Active",
      tone: "success" as const,
      progress: 64,
      bar: "bg-success",
    },
    {
      company: "Vertex Mfg.",
      value: "₹6.2L",
      badge: "Expired",
      tone: "danger" as const,
      progress: 100,
      bar: "bg-destructive",
    },
  ];

  return (
    <div className="flex h-full flex-col justify-center gap-2">
      {rows.map((row) => (
        <div
          key={row.company}
          className="rounded-lg border border-border/70 bg-background/70 p-2.5"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="truncate text-[10px] font-medium">{row.company}</span>
            <Pill tone={row.tone}>{row.badge}</Pill>
          </div>
          <div className="mt-1.5 flex items-center gap-2">
            <Bar value={row.progress} className={row.bar} />
            <span className="w-10 shrink-0 text-right text-[9px] font-semibold tabular-nums">
              {row.value}
            </span>
          </div>
        </div>
      ))}
      <div className="flex items-center justify-between rounded-md bg-primary-soft/60 px-2 py-1.5">
        <span className="text-[9px] font-medium text-primary">Renewal runway</span>
        <span className="text-[9px] font-semibold text-primary">2 expiring · ₹4.8L due</span>
      </div>
    </div>
  );
}

const fieldEngineers = [
  { initials: "RV", region: "BLR", tickets: 4, status: "site" },
  { initials: "PN", region: "AMD", tickets: 3, status: "online" },
  { initials: "IS", region: "MUM", tickets: 5, status: "site" },
  { initials: "SP", region: "CHN", tickets: 2, status: "online" },
  { initials: "AK", region: "DEL", tickets: 1, status: "offline" },
  { initials: "MD", region: "HYD", tickets: 3, status: "online" },
  { initials: "VS", region: "BLR", tickets: 2, status: "site" },
  { initials: "RK", region: "PNQ", tickets: 4, status: "online" },
];

function EngineerVisual() {
  return (
    <div className="flex h-full flex-col justify-center">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1 text-[9px] font-medium text-muted-foreground">
          <MapPin className="h-2.5 w-2.5 text-accent" /> Live field map
        </span>
        <span className="flex items-center gap-1 text-[9px] font-semibold text-success">
          <span className="h-1.5 w-1.5 rounded-full bg-success" /> 24/28 online
        </span>
      </div>
      <div className="mt-2 grid grid-cols-4 gap-1.5">
        {fieldEngineers.map((e) => (
          <div
            key={e.initials}
            className="flex flex-col items-center gap-0.5 rounded-lg border border-border/70 bg-background/70 px-1 py-1.5"
          >
            <span className="relative flex h-7 w-7 items-center justify-center rounded-full bg-primary text-[9px] font-semibold text-primary-foreground">
              {e.initials}
              <span
                className={cn(
                  "absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-surface",
                  e.status === "online"
                    ? "bg-success"
                    : e.status === "site"
                      ? "bg-accent"
                      : "bg-muted-foreground/50",
                )}
              />
            </span>
            <span className="text-[8px] font-semibold">{e.region}</span>
            <span className="text-[7px] text-muted-foreground">{e.tickets} open</span>
          </div>
        ))}
      </div>
      <div className="mt-2 flex items-center justify-between text-[9px] text-muted-foreground">
        <span>4h critical response</span>
        <span className="font-semibold text-foreground">Avg. rating 4.7</span>
      </div>
    </div>
  );
}

const graphTenants = [
  { x: 64, y: 42, mono: "AT", sites: "7 sites" },
  { x: 64, y: 142, mono: "NL", sites: "12 sites" },
  { x: 280, y: 22, mono: "MH", sites: "5 sites" },
  { x: 496, y: 42, mono: "SR", sites: "21 sites" },
  { x: 496, y: 142, mono: "VM", sites: "3 sites" },
];

function NetworkVisual() {
  return (
    <div className="relative flex h-full flex-col justify-center">
      <svg viewBox="0 0 560 190" className="h-[160px] w-full sm:h-[180px]" aria-hidden="true">
        {graphTenants.map((t) => (
          <line
            key={t.mono}
            x1="280"
            y1="95"
            x2={t.x}
            y2={t.y}
            stroke="var(--color-primary)"
            strokeOpacity="0.28"
            strokeWidth="1.4"
            strokeDasharray="4 6"
            className="landing-flow"
          />
        ))}
        <circle cx="280" cy="95" r="52" fill="var(--color-primary)" fillOpacity="0.07" />
        <circle cx="280" cy="95" r="38" fill="var(--color-primary)" />
        <text
          x="280"
          y="92"
          textAnchor="middle"
          fill="var(--color-primary-foreground)"
          fontSize="9"
          fontWeight="700"
        >
          SecureOps
        </text>
        <text
          x="280"
          y="104"
          textAnchor="middle"
          fill="var(--color-primary-foreground)"
          fontSize="6.5"
          opacity="0.75"
        >
          1,866 assets
        </text>
        {graphTenants.map((t) => (
          <g key={t.mono}>
            <circle
              cx={t.x}
              cy={t.y}
              r="20"
              fill="var(--color-surface)"
              stroke="var(--color-border)"
              strokeWidth="1.5"
            />
            <circle cx={t.x} cy={t.y} r="20" fill="var(--color-accent)" fillOpacity="0.08" />
            <text
              x={t.x}
              y={t.y + 3}
              textAnchor="middle"
              fill="var(--color-primary)"
              fontSize="8"
              fontWeight="700"
            >
              {t.mono}
            </text>
            <text
              x={t.x}
              y={t.y + 32}
              textAnchor="middle"
              fill="var(--color-muted-foreground)"
              fontSize="6.5"
            >
              {t.sites}
            </text>
          </g>
        ))}
      </svg>
      <div className="flex flex-wrap items-center justify-center gap-1.5">
        <Pill tone="primary">
          <Building2 className="h-2.5 w-2.5" /> 5 tenants
        </Pill>
        <Pill tone="muted">48 branches</Pill>
        <Pill tone="muted">12 device categories</Pill>
        <Pill tone="success">Single source of truth</Pill>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Bento card shell                                                    */
/* ------------------------------------------------------------------ */

function BentoCard({
  icon: Icon,
  title,
  copy,
  className,
  delay = 0,
  children,
}: {
  icon: typeof Camera;
  title: string;
  copy: string;
  className?: string;
  delay?: number;
  children: ReactNode;
}) {
  return (
    <Reveal delay={delay} className={cn("h-full", className)}>
      <article className="landing-bento flex h-full flex-col">
        <div className="relative flex-1 p-4 sm:p-5">{children}</div>
        <div className="border-t border-border/70 px-4 py-3.5 sm:px-5">
          <div className="flex items-center gap-2">
            <Icon className="h-3.5 w-3.5 shrink-0 text-accent" />
            <h3 className="text-[13px] font-semibold tracking-tight">{title}</h3>
            <ArrowUpRight className="ml-auto h-3.5 w-3.5 text-muted-foreground/40" />
          </div>
          <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">{copy}</p>
        </div>
      </article>
    </Reveal>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

const navLinks = [
  { href: "#platform", label: "Platform" },
  { href: "#modules", label: "Modules" },
  { href: "#console", label: "Console" },
  { href: "#security", label: "Security" },
];

const showcaseTabs: { id: ShowcaseVariant; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "tickets", label: "Service desk" },
  { id: "amc", label: "AMC" },
  { id: "endpoints", label: "Endpoints" },
];

const roleRows = [
  { name: "Super Admin", scope: "Platform-wide", width: 100, tone: "bg-primary" },
  { name: "Org Admin", scope: "Organization", width: 86, tone: "bg-primary" },
  { name: "IT Admin", scope: "Technical", width: 72, tone: "bg-primary" },
  { name: "Security Analyst", scope: "Security", width: 58, tone: "bg-accent" },
  { name: "Technician", scope: "Assigned work", width: 42, tone: "bg-accent" },
  { name: "End user", scope: "Self-service", width: 26, tone: "bg-success" },
];

function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<ShowcaseVariant>("overview");

  useEffect(() => {
    document.documentElement.classList.add("reveal-ready");
    return () => document.documentElement.classList.remove("reveal-ready");
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const solidHeader = scrolled || menuOpen;

  function onTabKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const index = showcaseTabs.findIndex((tab) => tab.id === activeTab);
    const next =
      (index + (event.key === "ArrowRight" ? 1 : -1) + showcaseTabs.length) % showcaseTabs.length;
    const nextTab = showcaseTabs[next];
    setActiveTab(nextTab.id);
    document.getElementById(`showcase-tab-${nextTab.id}`)?.focus();
  }

  return (
    <div className="min-h-screen bg-background">
      {/* ---------------------------------------------------------- */}
      {/* Header                                                     */}
      {/* ---------------------------------------------------------- */}
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-300",
          solidHeader
            ? cn(
                "border-b border-border",
                menuOpen ? "bg-surface" : "bg-surface/85 backdrop-blur-xl",
              )
            : "border-b border-transparent bg-transparent",
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
          <Link to="/" aria-label="Digivista SecureOps home" className="shrink-0">
            <DigivistaLogo variant={solidHeader ? "light" : "dark"} />
          </Link>

          <nav className="ml-8 hidden items-center gap-1 lg:flex" aria-label="Sections">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-full px-3.5 py-2 text-[13px] font-medium transition-colors",
                  solidHeader
                    ? "text-muted-foreground hover:bg-muted hover:text-foreground"
                    : "text-sidebar-foreground/70 hover:bg-white/5 hover:text-sidebar-foreground",
                )}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <Link
              to="/auth"
              className={cn(
                "hidden px-2 text-[13px] font-medium transition-colors sm:block",
                solidHeader
                  ? "text-muted-foreground hover:text-foreground"
                  : "text-sidebar-foreground/70 hover:text-sidebar-foreground",
              )}
            >
              Sign in
            </Link>
            <Link
              to="/auth"
              className={cn(
                "group inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[13px] font-semibold shadow-sm transition-all",
                solidHeader
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "bg-accent text-accent-foreground hover:bg-accent/90",
              )}
            >
              Open console
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-full border transition-colors lg:hidden",
                solidHeader
                  ? "border-border text-foreground hover:bg-muted"
                  : "border-white/15 text-sidebar-foreground hover:bg-white/10",
              )}
            >
              {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="border-t border-border bg-surface px-4 pb-4 pt-2 lg:hidden">
            <nav className="flex flex-col" aria-label="Mobile sections">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
                >
                  {link.label}
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </a>
              ))}
              <Link
                to="/auth"
                onClick={() => setMenuOpen(false)}
                className="mt-2 flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted"
              >
                Sign in
                <ArrowRight className="h-4 w-4" />
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* ---------------------------------------------------------- */}
      {/* Hero                                                       */}
      {/* ---------------------------------------------------------- */}
      <section className="landing-hero overflow-hidden pb-20 pt-28 text-sidebar-foreground sm:pt-32 lg:pb-28 lg:pt-40">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)] lg:gap-12 lg:px-8">
          <div className="max-w-xl">
            <div className="landing-rise inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/5 px-3 py-1.5 text-[11px] font-medium tracking-wide text-sidebar-foreground/80">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-70" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
              </span>
              Multi-tenant infrastructure operations
            </div>

            <h1
              className="landing-rise mt-6 text-[2.65rem] font-bold leading-[1.02] tracking-[-0.04em] text-white sm:text-6xl lg:text-[4.15rem]"
              style={{ animationDelay: "70ms" }}
            >
              Every device.
              <br />
              Every site.
              <br />
              <span className="text-accent">One console.</span>
            </h1>

            <p
              className="landing-rise mt-6 max-w-md text-[15px] leading-relaxed text-sidebar-foreground/70 sm:text-lg"
              style={{ animationDelay: "140ms" }}
            >
              CCTV, biometrics, networks, servers and the engineers who keep them running —
              orchestrated from a single command centre.
            </p>

            <div
              className="landing-rise mt-8 flex flex-wrap items-center gap-3"
              style={{ animationDelay: "210ms" }}
            >
              <Link
                to="/auth"
                className="group inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground shadow-[0_10px_30px_-10px_rgba(243,156,18,0.7)] transition-all hover:bg-accent/90"
              >
                Open the console
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <a
                href="#platform"
                className="group inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-sidebar-foreground transition-colors hover:bg-white/10"
              >
                See the platform
                <ChevronRight className="h-4 w-4 text-sidebar-foreground/60 transition-transform group-hover:translate-x-0.5" />
              </a>
            </div>

            <dl
              className="landing-rise mt-10 grid max-w-md grid-cols-3 gap-4 border-t border-white/10 pt-6"
              style={{ animationDelay: "280ms" }}
            >
              {[
                { value: "1,866", label: "assets managed" },
                { value: "48", label: "sites covered" },
                { value: "99.98%", label: "agent uptime" },
              ].map((stat) => (
                <div key={stat.label}>
                  <dt className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                    {stat.value}
                  </dt>
                  <dd className="mt-1 text-[10px] font-medium uppercase tracking-[0.12em] text-sidebar-foreground/45">
                    {stat.label}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="landing-rise relative" style={{ animationDelay: "240ms" }}>
            <HeroConsole />
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- */}
      {/* Tenant strip                                               */}
      {/* ---------------------------------------------------------- */}
      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-9 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-10">
            <p className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Operating across
            </p>
            <div className="grid flex-1 grid-cols-2 gap-4 sm:grid-cols-5 sm:gap-6">
              {tenants.map((tenant) => (
                <div key={tenant.name} className="group flex items-center gap-2.5">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-muted/50 text-[9px] font-bold text-primary transition-colors group-hover:border-primary/25 group-hover:bg-primary-soft">
                    {tenant.mono}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-[11px] font-semibold text-foreground">
                      {tenant.name}
                    </p>
                    <p className="text-[10px] text-muted-foreground">{tenant.meta}</p>
                  </div>
                </div>
              ))}
            </div>
            <span className="hidden shrink-0 items-center gap-1.5 text-[11px] font-medium text-muted-foreground xl:flex">
              <Activity className="h-3.5 w-3.5 text-success" />
              All systems operational
            </span>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- */}
      {/* Bento                                                      */}
      {/* ---------------------------------------------------------- */}
      <section id="platform" className="relative py-20 sm:py-24 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="max-w-xl">
                <Eyebrow>The platform</Eyebrow>
                <h2 className="mt-3 text-3xl font-bold tracking-[-0.03em] text-foreground sm:text-4xl">
                  One estate. Zero blind spots.
                </h2>
              </div>
              <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
                Nine modules, one source of truth — from the loading-dock camera to the ERP rack.
              </p>
            </div>
          </Reveal>

          <div id="modules" className="mt-10 grid gap-4 lg:grid-cols-12">
            <BentoCard
              className="lg:col-span-7"
              icon={HardDrive}
              title="Asset registry"
              copy="Every camera, switch and server, accountable to a tenant and a site."
            >
              <AssetVisual />
            </BentoCard>

            <BentoCard
              className="lg:col-span-5"
              icon={Ticket}
              title="Service desk"
              copy="SLA clocks that never sleep, across every device category."
              delay={60}
            >
              <DeskVisual />
            </BentoCard>

            <BentoCard
              className="lg:col-span-4"
              icon={MonitorSmartphone}
              title="Endpoint fleet"
              copy="Heartbeat, patching and remote actions in one grid."
              delay={80}
            >
              <FleetVisual />
            </BentoCard>

            <BentoCard
              className="lg:col-span-4"
              icon={FileSignature}
              title="AMC & renewals"
              copy="Contracts renew before they lapse. Invoices stay visible."
              delay={120}
            >
              <AmcVisual />
            </BentoCard>

            <BentoCard
              className="lg:col-span-4"
              icon={Users}
              title="Field engineers"
              copy="The right engineer, nearest the fault, with the right access."
              delay={160}
            >
              <EngineerVisual />
            </BentoCard>

            <BentoCard
              className="lg:col-span-12"
              icon={Building2}
              title="Multi-tenant by design"
              copy="Five enterprises, forty-eight branches, one governed operating model."
              delay={80}
            >
              <NetworkVisual />
            </BentoCard>
          </div>

          <Reveal delay={100}>
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <span className="mr-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Nine modules
              </span>
              {[
                { icon: Activity, label: "Dashboard" },
                { icon: Ticket, label: "Service desk" },
                { icon: MonitorSmartphone, label: "Endpoints" },
                { icon: HardDrive, label: "Assets" },
                { icon: Building2, label: "Companies" },
                { icon: Users, label: "Engineers" },
                { icon: FileSignature, label: "AMC" },
                { icon: ScrollText, label: "Audit" },
                { icon: KeyRound, label: "Users & roles" },
              ].map((module) => (
                <span
                  key={module.label}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-[11px] font-medium text-muted-foreground transition-colors hover:border-primary/25 hover:text-foreground"
                >
                  <module.icon className="h-3 w-3 text-primary" />
                  {module.label}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------------------------------------------------------- */}
      {/* Showcase                                                   */}
      {/* ---------------------------------------------------------- */}
      <section
        id="console"
        className="landing-dark overflow-hidden py-20 text-sidebar-foreground sm:py-24"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <Eyebrow light>Inside the console</Eyebrow>
              <h2 className="mt-3 text-3xl font-bold tracking-[-0.03em] text-white sm:text-4xl">
                This is the actual workspace.
              </h2>
              <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-sidebar-foreground/60">
                The same console your team signs into. Role-scoped, real-time, export-ready.
              </p>
            </div>
          </Reveal>

          <div
            role="tablist"
            aria-label="Console modules"
            className="mx-auto mt-8 flex w-fit max-w-full flex-wrap justify-center gap-1 rounded-full border border-white/10 bg-white/5 p-1"
          >
            {showcaseTabs.map((tab) => (
              <button
                key={tab.id}
                id={`showcase-tab-${tab.id}`}
                role="tab"
                type="button"
                aria-selected={activeTab === tab.id}
                aria-controls="showcase-panel"
                tabIndex={activeTab === tab.id ? 0 : -1}
                data-active={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
                onKeyDown={onTabKeyDown}
                className="landing-tab focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div
            className="relative mt-8"
            id="showcase-panel"
            role="tabpanel"
            aria-labelledby={`showcase-tab-${activeTab}`}
            aria-live="polite"
          >
            <div className="pointer-events-none absolute -inset-6 rounded-[2rem] bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--color-primary)_40%,transparent),transparent)] blur-2xl" />
            <div key={activeTab} className="landing-rise relative">
              <ShowcaseScreen variant={activeTab} />
            </div>
          </div>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
            {[
              { icon: Lock, label: "Role-based access" },
              { icon: Zap, label: "Live telemetry" },
              { icon: ScrollText, label: "Audited actions" },
              { icon: FileSignature, label: "CSV & PDF exports" },
            ].map((chip) => (
              <span
                key={chip.label}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-medium text-sidebar-foreground/70"
              >
                <chip.icon className="h-3 w-3 text-accent" />
                {chip.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- */}
      {/* Stats                                                      */}
      {/* ---------------------------------------------------------- */}
      <section className="border-b border-border bg-surface">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-6 gap-y-10 px-4 py-14 sm:px-6 lg:grid-cols-4 lg:px-8">
          {[
            { value: 1866, suffix: "", label: "Assets under management", decimals: 0 },
            { value: 48, suffix: "", label: "Branches covered", decimals: 0 },
            { value: 99.98, suffix: "%", label: "Agent uptime", decimals: 2 },
            { value: 4, suffix: "h", label: "Critical response SLA", decimals: 0 },
          ].map((stat, index) => (
            <Reveal key={stat.label} delay={index * 60}>
              <div className="relative pl-4">
                <span className="absolute left-0 top-1 h-9 w-0.5 rounded-full bg-accent/70" />
                <p className="text-3xl font-bold tracking-[-0.03em] text-foreground sm:text-4xl">
                  <CountUp value={stat.value} suffix={stat.suffix} decimals={stat.decimals} />
                </p>
                <p className="mt-2 text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------- */}
      {/* Security                                                   */}
      {/* ---------------------------------------------------------- */}
      <section id="security" className="relative py-20 sm:py-24 lg:py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16 lg:px-8">
          <Reveal>
            <div className="max-w-md">
              <Eyebrow>Governance</Eyebrow>
              <h2 className="mt-3 text-3xl font-bold tracking-[-0.03em] text-foreground sm:text-4xl">
                Scoped by role.
                <br />
                Proven by audit.
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                Six roles, nine modules, one immutable trail. Access is granted at the module level
                and enforced on every request.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  { icon: KeyRound, label: "Least-privilege roles" },
                  { icon: ScrollText, label: "Every action logged" },
                  { icon: ShieldCheck, label: "Tenant-isolated data" },
                ].map((item) => (
                  <li
                    key={item.label}
                    className="flex items-center gap-3 text-sm font-medium text-foreground"
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary-soft text-primary">
                      <item.icon className="h-3.5 w-3.5" />
                    </span>
                    {item.label}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="landing-bento p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-accent" />
                  <p className="text-sm font-semibold">Role access ladder</p>
                </div>
                <Pill tone="success">
                  <Lock className="h-2.5 w-2.5" /> Enforced
                </Pill>
              </div>

              <div className="mt-4 space-y-2.5">
                {roleRows.map((role) => (
                  <div
                    key={role.name}
                    className="grid grid-cols-[6.5rem_1fr_auto] items-center gap-3"
                  >
                    <span className="truncate text-[11px] font-medium">{role.name}</span>
                    <Bar value={role.width} className={role.tone} />
                    <span className="w-[4.5rem] text-right text-[9px] text-muted-foreground">
                      {role.scope}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-lg border border-border/70 bg-background/60 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                    Audit trail
                  </span>
                  <span className="flex items-center gap-1 text-[9px] font-semibold text-success">
                    <span className="h-1.5 w-1.5 rounded-full bg-success" /> Immutable
                  </span>
                </div>
                <ul className="mt-2 space-y-1.5">
                  {[
                    { action: "Role granted — technician", actor: "A. Kapoor", at: "2m ago" },
                    {
                      action: "Remote restart — sterling-pos-114",
                      actor: "S. Pillai",
                      at: "18m ago",
                    },
                    { action: "Contract renewed — Northline", actor: "D. Iyer", at: "1h ago" },
                  ].map((entry) => (
                    <li key={entry.action} className="flex items-center gap-2 text-[10px]">
                      <span className="h-1 w-1 shrink-0 rounded-full bg-accent" />
                      <span className="min-w-0 flex-1 truncate text-foreground/85">
                        {entry.action}
                      </span>
                      <span className="shrink-0 text-muted-foreground">{entry.actor}</span>
                      <span className="w-10 shrink-0 text-right text-muted-foreground/70">
                        {entry.at}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------------------------------------------------------- */}
      {/* CTA                                                        */}
      {/* ---------------------------------------------------------- */}
      <section className="px-4 pb-20 sm:px-6 sm:pb-24 lg:px-8">
        <Reveal>
          <div className="landing-cta relative mx-auto max-w-6xl overflow-hidden rounded-3xl px-6 py-16 text-center text-sidebar-foreground sm:px-12 sm:py-20">
            <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/5" />
            <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[24rem] w-[24rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />
            <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[14rem] w-[14rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/25 blur-3xl" />

            <span className="landing-glass mx-auto flex h-14 w-14 items-center justify-center rounded-2xl text-accent">
              <ShieldCheck className="h-6 w-6" />
            </span>
            <h2 className="mx-auto mt-6 max-w-lg text-3xl font-bold tracking-[-0.03em] text-white sm:text-4xl">
              Step inside your operations console.
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-sidebar-foreground/60">
              Sign in with your work account. Your access follows your role.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/auth"
                className="group inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground shadow-[0_10px_30px_-10px_rgba(243,156,18,0.7)] transition-colors hover:bg-accent/90"
              >
                Sign in to SecureOps
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <a
                href="#modules"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-sidebar-foreground transition-colors hover:bg-white/10"
              >
                Explore modules
                <ChevronRight className="h-4 w-4 text-sidebar-foreground/60" />
              </a>
            </div>
            <p className="mt-6 text-[10px] uppercase tracking-[0.16em] text-sidebar-foreground/40">
              SSO ready · Role-based · Audit-logged
            </p>
          </div>
        </Reveal>
      </section>

      {/* ---------------------------------------------------------- */}
      {/* Footer                                                     */}
      {/* ---------------------------------------------------------- */}
      <footer className="border-t border-border bg-surface">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="flex items-center gap-3">
            <DigivistaLogo variant="light" />
            <span className="hidden h-6 w-px bg-border sm:block" />
            <span className="hidden text-[11px] text-muted-foreground sm:block">
              Enterprise infrastructure operations
            </span>
          </div>
          <nav
            className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] font-medium text-muted-foreground"
            aria-label="Footer"
          >
            <a href="#platform" className="hover:text-foreground">
              Platform
            </a>
            <a href="#modules" className="hover:text-foreground">
              Modules
            </a>
            <a href="#security" className="hover:text-foreground">
              Security
            </a>
            <Link to="/auth" className="hover:text-foreground">
              Sign in
            </Link>
            <span className="text-muted-foreground/60">© 2026 Digivista Infotech</span>
          </nav>
        </div>
      </footer>
    </div>
  );
}
