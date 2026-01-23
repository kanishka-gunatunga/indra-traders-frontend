export const SALES_DEPT_CONFIG: Record<string, { allowedPath: string, dashboard: string }> = {
    "ITPL": {allowedPath: "/sales-agent/sales", dashboard: "/sales-agent/sales"},
    "ISP": {allowedPath: "/sales-agent/service-park-sale", dashboard: "/sales-agent/service-park-sale/sale"},
    "IMS": {allowedPath: "/sales-agent/spare-parts", dashboard: "/sales-agent/spare-parts"},
    "IFT": {allowedPath: "/sales-agent/fast-track", dashboard: "/sales-agent/fast-track"},
    "BYD": {allowedPath: "/sales-agent/byd-sales", dashboard: "/sales-agent/byd-sales"},
};

export const ROLE_DASHBOARDS = {
    ADMIN: "/admin/users",
    CALLAGENT: "/call-agent/dashboard",
    TELEMARKETER: "/tele-marketer",
    SALES01: "/sales-agent",
    SALES02: "/sales-agent",
    SALES03: "/sales-agent",
};

export const ROLE_PERMISSIONS = {
    ADMIN: ["/admin"],
    CALLAGENT: ["/call-agent"],
    TELEMARKETER: ["/tele-marketer"],
    SALES01: ["/sales-agent"],
    SALES02: ["/sales-agent"],
    SALES03: ["/sales-agent"],
};