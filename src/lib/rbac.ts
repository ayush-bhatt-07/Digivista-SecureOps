export const ROLES = [
  "super_admin",
  "org_admin",
  "it_admin",
  "security_analyst",
  "technician",
  "end_user",
] as const;

export type AppRole = (typeof ROLES)[number];

export const ROLE_META: Record<AppRole, { label: string; scope: string; description: string }> = {
  super_admin: {
    label: "Super Admin",
    scope: "Platform-wide",
    description: "Manage client organizations, subscriptions, system configuration and all users.",
  },
  org_admin: {
    label: "Organization Admin",
    scope: "Full access within organization",
    description: "Manage employees, devices, security policies, permissions and reports.",
  },
  it_admin: {
    label: "IT Administrator",
    scope: "Technical administration",
    description: "Manage endpoints, deploy agents, configure policies, patches and remote operations.",
  },
  security_analyst: {
    label: "Security Analyst",
    scope: "Security & compliance",
    description: "Monitor vulnerabilities, investigate alerts, review audit logs and compliance reports.",
  },
  technician: {
    label: "IT Technician",
    scope: "Limited operational access",
    description: "Resolve assigned tickets, troubleshoot devices, perform maintenance, update assets.",
  },
  end_user: {
    label: "Employee / End User",
    scope: "Self-service",
    description: "View assigned devices, report issues, submit requests and check ticket status.",
  },
};

export type AppPath =
  | "/dashboard"
  | "/tickets"
  | "/endpoints"
  | "/assets"
  | "/companies"
  | "/engineers"
  | "/amc"
  | "/audit"
  | "/users";

const ALL: AppRole[] = [...ROLES];

export const ROUTE_ACCESS: Record<AppPath, AppRole[]> = {
  "/dashboard": ALL,
  "/tickets": ALL,
  "/assets": ["super_admin", "org_admin", "it_admin", "security_analyst", "technician"],
  "/endpoints": ["super_admin", "org_admin", "it_admin", "security_analyst", "technician"],
  "/companies": ["super_admin", "org_admin"],
  "/engineers": ["super_admin", "org_admin", "it_admin"],
  "/amc": ["super_admin", "org_admin"],
  "/audit": ["super_admin", "org_admin", "security_analyst"],
  "/users": ["super_admin", "org_admin"],
};

export function canAccess(roles: AppRole[], path: string): boolean {
  const allowed = ROUTE_ACCESS[path as AppPath];
  if (!allowed) return true;
  return roles.some((r) => allowed.includes(r));
}

/** Roles a given admin is allowed to grant or revoke (mirrors database policies). */
export function grantableRoles(roles: AppRole[]): AppRole[] {
  if (roles.includes("super_admin")) return [...ROLES];
  if (roles.includes("org_admin")) return ROLES.filter((r) => r !== "super_admin");
  return [];
}

export function primaryRole(roles: AppRole[]): AppRole | null {
  return ROLES.find((r) => roles.includes(r)) ?? null;
}
