const sequelize = require("../config/database");
const User = require("../models/userModel");
const UserAssignment = require("../models/userAssignment");
const AdministrativeUnit = require("../models/administrativeUnitModel");
const Role = require("../models/roleModel");
const Permission = require("../models/permissionModel");
const UserPermission = require("../models/userPermissionModel");
const { AppError } = require("../middlewares/errorMiddleware");
const AuditLog = require("../models/auditLogModel");
const { RolePermission } = require("../models");
const { DefaultRolePermissions } = require("../config/rolePermissions");


/**
 * Assign a user to a unit with a role
 * ENFORCES single assignment rule
 */
const assignUserToUnit = async ({ userId, unitId, roleId, permissions = null }) => {
  const transaction = await sequelize.transaction();

  try {
    const user = await User.findByPk(userId, { transaction });
    const unit = await AdministrativeUnit.findByPk(unitId, { transaction });
    const role = await Role.findByPk(roleId, { transaction });

    if (!user || !unit || !role) {
      throw new AppError("errors.internal_error", 404);
    }

    const assignment = await UserAssignment.create(
      { user_id: userId, unit_id: unitId, role_id: roleId },
      { transaction }
    );

    // --- HYBRID RBAC TRANSITION ---
    // 1. Ensure Role-based permissions exist (The Standard)
    const standardPermNames = DefaultRolePermissions[role.name] || [];
    if (standardPermNames.length > 0) {
      const standardPerms = await Permission.findAll({
        where: { name: standardPermNames },
        transaction,
      });

      // Ensure standard permissions are linked to the Role
      await Promise.all(
        standardPerms.map((perm) =>
          RolePermission.findOrCreate({
            where: { role_id: role.id, permission_id: perm.id },
            transaction,
          })
        )
      );
    }

    // 2. Handle User-specific Overrides (The Exception)
    if (permissions && Array.isArray(permissions) && permissions.length > 0) {
      const overridePerms = await Permission.findAll({
        where: { name: permissions },
        transaction,
      });

      await Promise.all(
        overridePerms.map((perm) =>
          UserPermission.create(
            { assignment_id: assignment.id, permission_id: perm.id },
            { transaction }
          )
        )
      );
    }

    await user.update({ status: "ACTIVE" }, { transaction });

    await transaction.commit();

    return { assignment, user: { id: user.user_id, status: user.status }, unit: { id: unit.id, level: unit.level }, role: { id: role.id, name: role.name } };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

/**
 * Unassign user (required before reassignment)
 */
const unassignUser = async ({ targetUserId, performedBy }) => {
  const transaction = await sequelize.transaction();

  try {
    // 1️⃣ Get target assignment
    const assignment = await UserAssignment.findOne({
      where: { user_id: targetUserId },
      transaction,
    });

    if (!assignment) {
      throw new AppError("errors.user_not_assigned", 404);
    }

    // 2️⃣ Prevent unassigning Ethiopia Super Admin
    if (
      assignment.unit_id === performedBy.unit.id &&
      performedBy.unit.level === "ETHIOPIA" &&
      performedBy.role.name === "ADMIN" &&
      targetUserId === performedBy.id
    ) {
      throw new AppError("errors.cannot_unassign_super_admin", 403);
    }

    // 3️⃣ Remove user permissions
    await UserPermission.destroy({
      where: { assignment_id: assignment.id },
      transaction,
    });

    // 4️⃣ Remove assignment
    await assignment.destroy({ transaction });

    // 5️⃣ Set user status back to UNASSIGNED
    await User.update(
      { status: "UNASSIGNED" },
      { where: { user_id: targetUserId }, transaction }
    );

    // 6️⃣ Audit log
    await AuditLog.create(
      {
        user_id: performedBy.id,
        unit_id: performedBy.unit.id,
        action: "UNASSIGN_USER",
        target_id: targetUserId,
        metadata: {
          previous_assignment_id: assignment.id,
        },
      },
      { transaction }
    );

    await transaction.commit();

    return {
      message: "success.user_unassigned",
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};


module.exports = {
  assignUserToUnit,
  unassignUser,
};
