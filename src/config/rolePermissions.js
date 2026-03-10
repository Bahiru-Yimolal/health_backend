// src/config/rolePermissions.js

const Roles = {
    ADMIN: "ADMIN",
    HEAD: "HEAD",
    SUPERVISOR: "SUPERVISOR",
    PC_WORKER: "PC_WORKER",
    // Add other roles as needed
};

const Permissions = {
    ADMIN_PERMISSIONS: "ADMIN_PERMISSIONS",
    MANAGE_COMMUNITY_UNITS: "MANAGE_COMMUNITY_UNITS",
    MANAGE_FAMILIES: "MANAGE_FAMILIES",
    ASSIGN_PC_WORKERS: "ASSIGN_PC_WORKERS",
    // Add specific overrides like EXPORT_REPORTS here when needed
    EXPORT_REPORTS: "EXPORT_REPORTS",
    MANAGE_VISITS: "MANAGE_VISITS",
};

const DefaultRolePermissions = {
    [Roles.ADMIN]: [
        Permissions.ADMIN_PERMISSIONS,
        Permissions.MANAGE_COMMUNITY_UNITS,
    ],
    [Roles.HEAD]: [
        Permissions.EXPORT_REPORTS,
    ],
    [Roles.SUPERVISOR]: [
        Permissions.ASSIGN_PC_WORKERS,
        Permissions.MANAGE_FAMILIES,
        Permissions.MANAGE_COMMUNITY_UNITS,
        Permissions.MANAGE_VISITS,
    ],
    [Roles.PC_WORKER]: [
        Permissions.MANAGE_FAMILIES,
        Permissions.MANAGE_VISITS,
    ],
};

module.exports = {
    Roles,
    Permissions,
    DefaultRolePermissions,
};
