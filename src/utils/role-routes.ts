// Map roles to their specific dashboard landing pages
export const ROLE_DASHBOARDS = {
    ADMIN: "/admin",
    CALLAGENT: "/call-agent/dashboard",
    TELEMARKETER: "/tele-marketer",
    SALES01: "/sales-agent/sales",
    SALES02: "/sales-agent/sales",
};

// Define the base path permission for each role
// This ensures ADMIN cannot access /call-agent, etc.
export const ROLE_PERMISSIONS = {
    ADMIN: ["/admin"],
    CALLAGENT: ["/call-agent"],
    TELEMARKETER: ["/tele-marketer"],
    SALES01: ["/sales-agent"],
    SALES02: ["/sales-agent"],
};