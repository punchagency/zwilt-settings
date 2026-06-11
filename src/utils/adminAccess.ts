import { sideBarArray } from "@/arrays/SideBarArray";

// System-level admin roles (zwilt-admin platform). Keep in sync with the
// server's adminAuth middleware.
const ADMIN_SYSTEM_ROLES = [
  "SUPER_ADMIN",
  "STAFF_ADMIN",
  "SUPPORT_ADMIN",
  "AUDIT_ADMIN",
];

// Organization-level admin roles (owner/manager).
const ADMIN_ORG_ROLES = ["ORGANIZATION_OWNER", "ORGANIZATION_MANAGER"];

/**
 * Whether the current user may see/use admin-only settings sections.
 * `currentUser` is the recoil currentUser ({ user, organization, systemRole,
 * organizationRole }) populated by AuthGuard from /api/v1/identity/me.
 */
export const isOrgAdmin = (currentUser: any): boolean =>
  ADMIN_SYSTEM_ROLES.includes(currentUser?.systemRole) ||
  ADMIN_ORG_ROLES.includes(currentUser?.organizationRole);

// Single source of truth for admin-gated routes: every sidebar item flagged
// adminOnly. Used by both the sidebar (hide) and the route guard (redirect).
export const ADMIN_ONLY_PATHS: string[] = sideBarArray
  .filter((item) => item.adminOnly)
  .map((item) => item.href.trim());

/** True if `pathname` belongs to an admin-only section. */
export const isAdminOnlyPath = (pathname: string): boolean =>
  ADMIN_ONLY_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
