const User = require("./userModel");
const AdministrativeUnit = require("./administrativeUnitModel");
const Role = require("./roleModel");
const Permission = require("./permissionModel");
const UserAssignment = require("./userAssignment");
const UserPermission = require("./userPermissionModel"); // Repurposed for Overrides
const RolePermission = require("./rolePermissionModel"); // New Role-based permissions
const AuditLog = require("./auditLogModel");
const Family = require("./familyModel");
const PregnantMother = require("./pregnantMotherModel");
const LactatingMother = require("./lactatingMotherModel");
const Child = require("./childModel");

// User -> UserAssignment
User.hasMany(UserAssignment, { foreignKey: "user_id" });
UserAssignment.belongsTo(User, { foreignKey: "user_id" });

// Unit -> UserAssignment
AdministrativeUnit.hasMany(UserAssignment, { foreignKey: "unit_id" });
UserAssignment.belongsTo(AdministrativeUnit, { foreignKey: "unit_id" });

// Role -> UserAssignment
Role.hasMany(UserAssignment, { foreignKey: "role_id" });
UserAssignment.belongsTo(Role, { foreignKey: "role_id" });

// AdministrativeUnit Self-reference for Hierarchy
AdministrativeUnit.hasMany(AdministrativeUnit, { foreignKey: "parent_id", as: "SubUnits" });
AdministrativeUnit.belongsTo(AdministrativeUnit, { foreignKey: "parent_id", as: "ParentUnit" });

// --- HYBRID RBAC ASSOCIATIONS ---

// 1. Role-based Permissions (The Standard)
Role.belongsToMany(Permission, {
  through: RolePermission,
  foreignKey: "role_id",
});
Permission.belongsToMany(Role, {
  through: RolePermission,
  foreignKey: "permission_id",
});

Role.hasMany(RolePermission, { foreignKey: "role_id" });
RolePermission.belongsTo(Role, { foreignKey: "role_id" });

Permission.hasMany(RolePermission, { foreignKey: "permission_id" });
RolePermission.belongsTo(Permission, { foreignKey: "permission_id" });

// 2. User-specific Overrides (The Exception)
UserAssignment.hasMany(UserPermission, { foreignKey: "assignment_id" });
UserPermission.belongsTo(UserAssignment, { foreignKey: "assignment_id" });

Permission.hasMany(UserPermission, { foreignKey: "permission_id" });
UserPermission.belongsTo(Permission, { foreignKey: "permission_id" });

// AuditLog associations
AuditLog.belongsTo(User, { foreignKey: "user_id" });
AuditLog.belongsTo(AdministrativeUnit, { foreignKey: "unit_id" });

// --- FAMILY & DEPENDENT ASSOCIATIONS ---

// Family -> AdministrativeUnit (Block)
AdministrativeUnit.hasMany(Family, { foreignKey: "block_id", as: "Families" });
Family.belongsTo(AdministrativeUnit, { foreignKey: "block_id", as: "Block" });

// Family -> User (Created By)
User.hasMany(Family, { foreignKey: "created_by" });
Family.belongsTo(User, { foreignKey: "created_by", as: "Creator" });

// Family -> PregnantMother (1-to-1)
Family.hasOne(PregnantMother, { foreignKey: "family_id", onDelete: "CASCADE" });
PregnantMother.belongsTo(Family, { foreignKey: "family_id" });

// Family -> LactatingMother (1-to-1)
Family.hasOne(LactatingMother, { foreignKey: "family_id", onDelete: "CASCADE" });
LactatingMother.belongsTo(Family, { foreignKey: "family_id" });

// Family -> Child (1-to-Many)
Family.hasMany(Child, { foreignKey: "family_id", onDelete: "CASCADE" });
Child.belongsTo(Family, { foreignKey: "family_id" });

module.exports = {
  User,
  AdministrativeUnit,
  Role,
  Permission,
  UserAssignment,
  UserPermission,
  RolePermission,
  AuditLog,
  Family,
  PregnantMother,
  LactatingMother,
  Child,
};


