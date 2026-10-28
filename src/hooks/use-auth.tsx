import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import type { AppRole } from "@/lib/rbac";

type AuthState = {
  session: Session | null;
  loading: boolean;
  roles: AppRole[];
  fullName: string | null;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthState>({
  session: null,
  loading: true,
  roles: [],
  fullName: null,
  refresh: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [fullName, setFullName] = useState<string | null>(null);

  const load = useCallback(async (s: Session | null) => {
    if (!s) {
      setRoles([]);
      setFullName(null);
      setLoading(false);
      return;
    }
    const [{ data: r }, { data: p }] = await Promise.all([
      supabase.from("user_roles").select("role").eq("user_id", s.user.id),
      supabase.from("profiles").select("full_name").eq("id", s.user.id).maybeSingle(),
    ]);
    setRoles((r ?? []).map((x) => x.role as AppRole));
    setFullName(p?.full_name ?? s.user.email ?? null);
    setLoading(false);
  }, []);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event, s) => {
      setSession(s);
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") {
        setLoading(true);
        setTimeout(() => void load(s), 0);
      }
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      void load(data.session);
    });
    return () => sub.subscription.unsubscribe();
  }, [load]);

  return (
    <AuthContext.Provider value={{ session, loading, roles, fullName, refresh: () => load(session) }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
