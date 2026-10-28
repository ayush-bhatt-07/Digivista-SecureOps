import { createFileRoute, Link, Outlet, redirect, useRouterState } from "@tanstack/react-router";
import { ShieldAlert } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { canAccess } from "@/lib/rbac";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) throw redirect({ to: "/auth" });
  },
  component: RoleGate,
});

function RoleGate() {
  const { roles, loading } = useAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">Loading your workspace…</div>;
  }
  if (!canAccess(roles, pathname)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="max-w-md text-center">
          <ShieldAlert className="mx-auto h-10 w-10 text-accent" />
          <h1 className="mt-4 text-xl font-semibold text-foreground">Access restricted</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Your role doesn't include access to this module. Ask an administrator if you need it.
          </p>
          <Button asChild className="mt-6">
            <Link to="/dashboard">Back to dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }
  return <Outlet />;
}
