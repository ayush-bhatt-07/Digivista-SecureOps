import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Building2,
  HardDrive,
  Ticket,
  Users,
  MonitorSmartphone,
  ScrollText,
  FileSignature,
  Search,
  Bell,
  Moon,
  Sun,
  Menu,
  ChevronRight,
  ShieldCheck,
  LogOut,
} from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, type ReactNode } from "react";
import { DigivistaLogo } from "@/components/digivista-logo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useSecureOps } from "@/hooks/use-secureops";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { ROLE_META, canAccess, primaryRole, type AppPath } from "@/lib/rbac";

type NavItem = {
  to: AppPath;
  label: string;
  icon: typeof LayoutDashboard;
};

export const NAV: { group: string; items: NavItem[] }[] = [
  {
    group: "Operations",
    items: [
      { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { to: "/tickets", label: "Service Desk", icon: Ticket },
      { to: "/endpoints", label: "Endpoint Management", icon: MonitorSmartphone },
    ],
  },
  {
    group: "Infrastructure",
    items: [
      { to: "/assets", label: "Asset Management", icon: HardDrive },
      { to: "/companies", label: "Companies & Branches", icon: Building2 },
      { to: "/engineers", label: "Engineers", icon: Users },
    ],
  },
  {
    group: "Governance",
    items: [
      { to: "/amc", label: "AMC & Contracts", icon: FileSignature },
      { to: "/audit", label: "Audit Logs", icon: ScrollText },
      { to: "/users", label: "Users & Roles", icon: ShieldCheck },
    ],
  },
];

function useNav() {
  const { roles } = useAuth();
  return NAV.map((s) => ({ ...s, items: s.items.filter((i) => canAccess(roles, i.to)) })).filter(
    (s) => s.items.length > 0,
  );
}

function useTheme() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);
  return { dark, toggle: () => setDark((d) => !d) };
}

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const nav = useNav();
  const { roles, fullName } = useAuth();
  const role = primaryRole(roles);
  return (
    <nav className="flex h-full flex-col gap-6 overflow-y-auto px-3 py-4">
      {nav.map((section) => (
        <div key={section.group}>
          <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-sidebar-foreground/50">
            {section.group}
          </p>
          <ul className="space-y-0.5">
            {section.items.map((item) => {
              const active = pathname === item.to;
              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    onClick={onNavigate}
                    className={cn(
                      "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-sidebar-foreground/85 transition-colors",
                      "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      active &&
                        "bg-sidebar-accent text-sidebar-accent-foreground shadow-[inset_3px_0_0_0_var(--sidebar-primary)]",
                    )}
                  >
                    <item.icon className={cn("h-4 w-4", active && "text-sidebar-primary")} />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
      <div className="mt-auto rounded-lg border border-sidebar-border bg-sidebar-accent/50 p-3">
        <p className="truncate text-xs font-semibold text-sidebar-accent-foreground">{fullName}</p>
        <p className="mt-1 text-[11px] text-sidebar-foreground/60">
          {role ? `${ROLE_META[role].label} · ${ROLE_META[role].scope}` : "No role assigned"}
        </p>
      </div>
    </nav>
  );
}

export function AppShell({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  const { dark, toggle } = useTheme();
  const [open, setOpen] = useState(false);
  const data = useSecureOps();
  const nav = useNav();
  const { fullName, roles } = useAuth();
  const role = primaryRole(roles);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const initials = (fullName ?? "?").split(/[\s@.]+/).filter(Boolean).slice(0, 2).map((s) => s[0]?.toUpperCase()).join("");

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const openTickets = data.tickets.filter((t) => t.status === "open" || t.status === "in_progress").length;

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
        <div className="flex h-16 items-center border-b border-sidebar-border px-5">
          <DigivistaLogo />
        </div>
        <SidebarNav />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-surface/90 px-4 backdrop-blur md:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open navigation">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 border-sidebar-border bg-sidebar p-0">
              <SheetTitle className="flex h-16 items-center border-b border-sidebar-border px-5">
                <DigivistaLogo />
              </SheetTitle>
              <SidebarNav />
            </SheetContent>
          </Sheet>

          <button
            onClick={() => setOpen(true)}
            className="flex h-9 w-full max-w-sm items-center gap-2 rounded-md border border-border bg-muted/60 px-3 text-sm text-muted-foreground transition-colors hover:bg-muted"
          >
            <Search className="h-4 w-4" />
            <span className="truncate">Search assets, tickets, companies…</span>
            <kbd className="ml-auto hidden rounded border border-border bg-surface px-1.5 py-0.5 text-[10px] font-medium sm:inline">
              ⌘K
            </kbd>
          </button>

          <div className="ml-auto flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
              <Bell className="h-4 w-4" />
              {openTickets > 0 && (
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-accent" />
              )}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  aria-label="Account menu"
                  className="ml-2 flex h-9 w-9 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground"
                >
                  {initials}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-60">
                <DropdownMenuLabel>
                  <p className="truncate">{fullName}</p>
                  <p className="text-xs font-normal text-muted-foreground">{role ? ROLE_META[role].label : "No role"}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut}>
                  <LogOut className="mr-2 h-4 w-4" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 md:px-6 lg:px-8">
          <div className="mx-auto max-w-[1500px]">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
              <div>
                <div className="mb-1 flex items-center gap-1 text-xs text-muted-foreground">
                  <span>SecureOps</span>
                  <ChevronRight className="h-3 w-3" />
                  <span className="font-medium text-foreground">{title}</span>
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
                {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
              </div>
              <Badge variant="outline" className="border-accent/40 bg-accent-soft text-accent-foreground">
                Multi-tenant · {data.companies.length} tenants
              </Badge>
            </div>
            {children}
          </div>
        </main>
      </div>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Jump to module, asset or ticket…" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Modules">
            {nav.flatMap((s) => s.items).map((item) => (
              <CommandItem key={item.to} value={item.label} asChild>
                <Link to={item.to} onClick={() => setOpen(false)}>
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Link>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Assets">
            {data.assets.slice(0, 5).map((a) => (
              <CommandItem key={a.id} value={`${a.id} ${a.name}`} asChild>
                <Link to="/assets" onClick={() => setOpen(false)}>
                  <HardDrive className="mr-2 h-4 w-4" />
                  {a.id} · {a.name}
                </Link>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Tickets">
            {data.tickets.slice(0, 5).map((t) => (
              <CommandItem key={t.id} value={`${t.id} ${t.subject}`} asChild>
                <Link to="/tickets" onClick={() => setOpen(false)}>
                  <Ticket className="mr-2 h-4 w-4" />
                  {t.id} · {t.subject}
                </Link>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </div>
  );
}
