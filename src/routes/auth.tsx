import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import {
  Activity,
  ArrowLeft,
  Building2,
  Check,
  Eye,
  EyeOff,
  FileSignature,
  HardDrive,
  KeyRound,
  LayoutDashboard,
  Lock,
  MonitorSmartphone,
  ScrollText,
  ShieldCheck,
  Ticket,
  Users,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/hooks/use-auth";
import { DigivistaLogo } from "@/components/digivista-logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — Digivista SecureOps" },
      {
        name: "description",
        content: "Sign in to the Digivista SecureOps enterprise operations console.",
      },
      { property: "og:title", content: "Sign in — Digivista SecureOps" },
      {
        property: "og:description",
        content: "Secure, role-based access to the SecureOps console.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

const modules = [
  { icon: LayoutDashboard, label: "Dashboard" },
  { icon: Ticket, label: "Service desk" },
  { icon: MonitorSmartphone, label: "Endpoints" },
  { icon: HardDrive, label: "Assets" },
  { icon: Building2, label: "Companies" },
  { icon: Users, label: "Engineers" },
  { icon: FileSignature, label: "AMC" },
  { icon: ScrollText, label: "Audit", locked: true },
  { icon: KeyRound, label: "Users", locked: true },
];

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47a5.54 5.54 0 0 1-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09A11.99 11.99 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.29a7.2 7.2 0 0 1 0-4.58V6.62H1.29a12 12 0 0 0 0 10.76l3.98-3.09Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.69 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75Z"
      />
    </svg>
  );
}

function AuthPage() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (session) navigate({ to: "/dashboard" });
  }, [session, navigate]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) toast.error(error.message);
    } else {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: window.location.origin, data: { full_name: name } },
      });
      if (error) toast.error(error.message);
      else if (!data.session) toast.success("Check your email to confirm your account.");
    }
    setBusy(false);
  }

  async function google() {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) toast.error("Google sign-in failed");
  }

  return (
    <div className="grid min-h-screen bg-background lg:grid-cols-[1.05fr_0.95fr]">
      {/* Brand panel */}
      <aside className="landing-dark relative hidden flex-col justify-between overflow-hidden px-10 py-10 text-sidebar-foreground lg:flex xl:px-14">
        <div className="flex items-center justify-between">
          <Link to="/" aria-label="Digivista SecureOps home">
            <DigivistaLogo variant="dark" />
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-medium text-sidebar-foreground/70 transition-colors hover:bg-white/10 hover:text-sidebar-foreground"
          >
            <ArrowLeft className="h-3 w-3" /> Back to site
          </Link>
        </div>

        <div className="mx-auto w-full max-w-lg py-10">
          <p className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
            <span className="h-1 w-1 rounded-full bg-accent" />
            Secure operations
          </p>
          <p className="mt-4 text-4xl font-bold leading-[1.05] tracking-[-0.035em] text-white xl:text-[2.9rem]">
            Your estate.
            <br />
            One login.
          </p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-sidebar-foreground/60">
            Role-scoped access to every tenant, site, device and ticket — with every action on the
            record.
          </p>

          <div className="landing-glass mt-9 rounded-2xl p-5">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/15 text-success">
                <ShieldCheck className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">Access granted</p>
                <p className="truncate text-[11px] text-sidebar-foreground/55">
                  Ravi Menon · Organization Admin
                </p>
              </div>
              <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-semibold text-success">
                <Check className="h-2.5 w-2.5" /> Verified
              </span>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-2">
              {modules.map((module) => (
                <div
                  key={module.label}
                  className={cn(
                    "flex items-center gap-1.5 rounded-lg border px-2 py-2",
                    module.locked
                      ? "border-white/5 bg-white/[0.02] text-sidebar-foreground/35"
                      : "border-white/10 bg-white/5 text-sidebar-foreground/80",
                  )}
                >
                  <module.icon className="h-3 w-3 shrink-0" />
                  <span className="min-w-0 flex-1 truncate text-[9px] font-medium">
                    {module.label}
                  </span>
                  {module.locked ? (
                    <Lock className="h-2.5 w-2.5 shrink-0" />
                  ) : (
                    <Check className="h-2.5 w-2.5 shrink-0 text-success" />
                  )}
                </div>
              ))}
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-3 text-[10px] text-sidebar-foreground/45">
              <span className="inline-flex items-center gap-1.5">
                <Lock className="h-3 w-3" /> Encrypted session
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Activity className="h-3 w-3" /> 99.98% uptime
              </span>
            </div>
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-2 text-[10px] font-medium text-sidebar-foreground/45">
            <span className="rounded-full border border-white/10 px-2.5 py-1">5 tenants</span>
            <span className="rounded-full border border-white/10 px-2.5 py-1">48 sites</span>
            <span className="rounded-full border border-white/10 px-2.5 py-1">1,866 assets</span>
            <span className="rounded-full border border-white/10 px-2.5 py-1">SSO ready</span>
          </div>
        </div>

        <p className="text-[10px] uppercase tracking-[0.16em] text-sidebar-foreground/30">
          Digivista Infotech · Enterprise infrastructure operations
        </p>
      </aside>

      {/* Form panel */}
      <main className="relative flex min-h-screen flex-col justify-center px-4 py-10 sm:px-8">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-10 flex items-center justify-between lg:hidden">
            <Link to="/" aria-label="Digivista SecureOps home">
              <DigivistaLogo variant="light" />
            </Link>
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-[11px] font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-3 w-3" /> Back
            </Link>
          </div>

          <div className="mb-8">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-primary">
              <ShieldCheck className="h-3 w-3" />
              {mode === "signin" ? "Secure sign-in" : "New workspace"}
            </span>
            <h1 className="mt-4 text-2xl font-bold tracking-[-0.02em] text-foreground sm:text-[1.7rem]">
              {mode === "signin" ? "Sign in to SecureOps" : "Create your account"}
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              {mode === "signin"
                ? "Use your work email. Access follows your role."
                : "Start with your work email. An admin grants module access."}
            </p>
          </div>

          <form onSubmit={submit} className="space-y-4">
            {mode === "signup" && (
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-xs font-medium">
                  Full name
                </Label>
                <Input
                  id="name"
                  autoComplete="name"
                  placeholder="Ravi Menon"
                  className="h-11"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-medium">
                Work email
              </Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@company.com"
                className="h-11"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs font-medium">
                  Password
                </Label>
                <span className="text-[10px] text-muted-foreground">Minimum 8 characters</span>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete={mode === "signin" ? "current-password" : "new-password"}
                  placeholder="••••••••"
                  className="h-11 pr-10"
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="h-11 w-full text-sm font-semibold" disabled={busy}>
              {busy ? "Please wait…" : mode === "signin" ? "Sign in to console" : "Create account"}
            </Button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <span className="h-px flex-1 bg-border" />
            <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
              or continue with
            </span>
            <span className="h-px flex-1 bg-border" />
          </div>

          <Button
            type="button"
            variant="outline"
            className="h-11 w-full gap-2 text-sm font-medium"
            onClick={google}
          >
            <GoogleMark />
            Continue with Google
          </Button>

          <button
            type="button"
            className="mt-7 w-full text-center text-[13px] text-muted-foreground transition-colors hover:text-foreground"
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          >
            {mode === "signin" ? (
              <>
                New here? <span className="font-semibold text-primary">Create an account</span>
              </>
            ) : (
              <>
                Already have an account? <span className="font-semibold text-primary">Sign in</span>
              </>
            )}
          </button>

          <div className="mt-10 flex items-start gap-2 rounded-lg border border-border bg-surface/60 p-3">
            <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
            <p className="text-[11px] leading-relaxed text-muted-foreground">
              Protected by role-based access control. Every sign-in and action is recorded in the
              audit trail.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
