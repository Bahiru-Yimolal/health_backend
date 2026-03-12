// src/config/rolePermissions.js

const Roles = {
    ADMIN: "ADMIN",
    HEAD: "HEAD",
    SUPERVISOR: "SUPERVISOR",
    PC_WORKER: "PC_WORKER",
    DATA_ENCODER: "DATA_ENCODER",
};

const Permissions = {
    ADMIN_PERMISSIONS: "ADMIN_PERMISSIONS",
    MANAGE_COMMUNITY_UNITS: "MANAGE_COMMUNITY_UNITS",
    MANAGE_FAMILIES: "MANAGE_FAMILIES",
    ASSIGN_PC_WORKERS: "ASSIGN_PC_WORKERS",
    EXPORT_REPORTS: "EXPORT_REPORTS",
    MANAGE_VISITS: "MANAGE_VISITS",
};

const DefaultRolePermissions = {
    [Roles.ADMIN]: [
        Permissions.ADMIN_PERMISSIONS,
        Permissions.ASSIGN_PC_WORKERS,
        Permissions.MANAGE_FAMILIES,
        Permissions.MANAGE_COMMUNITY_UNITS,
        Permissions.MANAGE_VISITS,
        Permissions.EXPORT_REPORTS,
    ],
    [Roles.HEAD]: [
        Permissions.EXPORT_REPORTS,
    ],
    [Roles.SUPERVISOR]: [
        Permissions.ADMIN_PERMISSIONS,
        Permissions.ASSIGN_PC_WORKERS,
        Permissions.MANAGE_FAMILIES,
        Permissions.MANAGE_COMMUNITY_UNITS,
        Permissions.MANAGE_VISITS,
        Permissions.EXPORT_REPORTS,
    ],
    [Roles.PC_WORKER]: [
        Permissions.MANAGE_FAMILIES,
        Permissions.MANAGE_VISITS,
        Permissions.EXPORT_REPORTS,
    ],
    [Roles.DATA_ENCODER]: [
        Permissions.MANAGE_FAMILIES,
    ],

};

module.exports = {
    Roles,
    Permissions,
    DefaultRolePermissions,
};
