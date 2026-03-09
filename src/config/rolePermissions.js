// src/config/rolePermissions.js

const Roles = {
    ADMIN: "ADMIN",
    HEAD: "HEAD",
    SUPERVISOR: "SUPERVISOR",
    // Add other roles as needed
};

const Permissions = {
    CREATE_FOLDER: "CREATE_FOLDER",
    READ_FOLDER: "READ_FOLDER",
    UPDATE_FOLDER: "UPDATE_FOLDER",
    DELETE_FOLDER: "DELETE_FOLDER",
    ADMIN_PERMISSIONS: "ADMIN_PERMISSIONS",
    MANAGE_COMMUNITY_UNITS: "MANAGE_COMMUNITY_UNITS",
    MANAGE_FAMILIES: "MANAGE_FAMILIES",
    ASSIGN_PC_WORKERS: "ASSIGN_PC_WORKERS",
    // Add specific overrides like EXPORT_REPORTS here when needed
    EXPORT_REPORTS: "EXPORT_REPORTS",
};

const DefaultRolePermissions = {
    [Roles.ADMIN]: [
        Permissions.CREATE_FOLDER,
        Permissions.READ_FOLDER,
        Permissions.UPDATE_FOLDER,
        Permissions.DELETE_FOLDER,
        Permissions.ADMIN_PERMISSIONS,
        Permissions.MANAGE_COMMUNITY_UNITS,
    ],
    [Roles.HEAD]: [
        Permissions.CREATE_FOLDER,
        Permissions.READ_FOLDER,
        Permissions.UPDATE_FOLDER,
        Permissions.DELETE_FOLDER,
    ],
    [Roles.SUPERVISOR]: [
        Permissions.READ_FOLDER,
        Permissions.ASSIGN_PC_WORKERS,
    ],
};

module.exports = {
    Roles,
    Permissions,
    DefaultRolePermissions,
};
