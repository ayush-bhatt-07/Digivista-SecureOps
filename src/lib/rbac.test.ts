import { describe, expect, it } from "vitest";
import { canAccess, grantableRoles } from "./rbac";

describe("RBAC rules", () => {
  it("end users cannot open audit logs", () => {
    expect(canAccess(["end_user"], "/audit")).toBe(false);
  });
  it("security analysts can open audit logs", () => {
    expect(canAccess(["security_analyst"], "/audit")).toBe(true);
  });
  it("only admins can manage users", () => {
    expect(canAccess(["it_admin"], "/users")).toBe(false);
    expect(canAccess(["org_admin"], "/users")).toBe(true);
  });
  it("technicians cannot open AMC contracts", () => {
    expect(canAccess(["technician"], "/amc")).toBe(false);
  });
  it("organization admins cannot grant super admin", () => {
    expect(grantableRoles(["org_admin"])).not.toContain("super_admin");
    expect(grantableRoles(["super_admin"])).toContain("super_admin");
  });
});
