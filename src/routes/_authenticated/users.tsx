import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { ROLES, ROLE_META, ROUTE_ACCESS, grantableRoles, type AppRole } from "@/lib/rbac";

export const Route = createFileRoute("/_authenticated/users")({
  head: () => ({
    meta: [
      { title: "Users & Roles — Digivista SecureOps" },
      { name: "description", content: "Assign RBAC roles and review the permission matrix for SecureOps users." },
      { property: "og:title", content: "Users & Roles — Digivista SecureOps" },
      { property: "og:description", content: "Role-based access control for the SecureOps platform." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: UsersPage,
});

type Row = { id: string; email: string | null; full_name: string | null; roles: AppRole[] };

function UsersPage() {
  const qc = useQueryClient();
  const { session, roles: myRoles, refresh } = useAuth();
  const grantable = grantableRoles(myRoles);

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["rbac-users"],
    queryFn: async (): Promise<Row[]> => {
      const [{ data: profiles, error }, { data: roleRows }] = await Promise.all([
        supabase.from("profiles").select("id,email,full_name").order("created_at"),
        supabase.from("user_roles").select("user_id,role"),
      ]);
      if (error) throw error;
      return (profiles ?? []).map((p) => ({
        ...p,
        roles: (roleRows ?? []).filter((r) => r.user_id === p.id).map((r) => r.role as AppRole),
      }));
    },
  });

  async function toggle(user: Row, role: AppRole, on: boolean) {
    const { error } = on
      ? await supabase.from("user_roles").insert({ user_id: user.id, role })
      : await supabase.from("user_roles").delete().eq("user_id", user.id).eq("role", role);
    if (error) return toast.error(error.message);
    toast.success(`${on ? "Granted" : "Revoked"} ${ROLE_META[role].label} for ${user.full_name ?? user.email}`);
    await qc.invalidateQueries({ queryKey: ["rbac-users"] });
    if (user.id === session?.user.id) await refresh();
  }

  return (
    <AppShell title="Users & Roles" description="Grant and revoke roles. Changes are enforced instantly.">
      <div className="space-y-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Users</CardTitle></CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  {ROLES.map((r) => <TableHead key={r} className="text-center text-xs">{ROLE_META[r].label}</TableHead>)}
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && <TableRow><TableCell colSpan={7} className="text-muted-foreground">Loading…</TableCell></TableRow>}
                {users.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell>
                      <p className="font-medium">{u.full_name}</p>
                      <p className="text-xs text-muted-foreground">{u.email}</p>
                    </TableCell>
                    {ROLES.map((r) => {
                      const has = u.roles.includes(r);
                      const self = u.id === session?.user.id;
                      const disabled = !grantable.includes(r) || (self && has);
                      return (
                        <TableCell key={r} className="text-center">
                          <Checkbox
                            checked={has}
                            disabled={disabled}
                            aria-label={`${ROLE_META[r].label} for ${u.email}`}
                            onCheckedChange={(v) => toggle(u, r, v === true)}
                          />
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Role definitions & module access</CardTitle></CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {ROLES.map((r) => (
              <div key={r} className="rounded-lg border border-border p-4">
                <p className="font-semibold">{ROLE_META[r].label}</p>
                <p className="text-xs text-accent-foreground">{ROLE_META[r].scope}</p>
                <p className="mt-2 text-sm text-muted-foreground">{ROLE_META[r].description}</p>
                <div className="mt-3 flex flex-wrap gap-1">
                  {Object.entries(ROUTE_ACCESS).filter(([, rs]) => rs.includes(r)).map(([p]) => (
                    <Badge key={p} variant="secondary" className="text-[10px]">{p.slice(1)}</Badge>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
