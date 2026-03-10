const express = require("express");
const {
    protect,
    assignmentMiddleware,
    levelGuard,
    permissionMiddleware,
} = require("../middlewares/authMiddleware");

const {
    validateFamilyCreationInput,
    validateFamilyUpdateInput,
} = require("../validators/familyValidators");

const {
    createFamilyController,
    updateFamilyController,
    deleteFamilyController,
    getFamilyByIdController,
    getFamiliesByCreatorController,
    getFamiliesByAdminUnitController,
    getAssignedFamiliesController,
} = require("../controllers/familyControllers");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Families
 *   description: Core Family household registration and management
 */

// Create Family
router.post(
    "/",
    protect,
    assignmentMiddleware,
    // levelGuard(["HEALTH_CENTER"]),
    permissionMiddleware("MANAGE_FAMILIES"),
    validateFamilyCreationInput,
    createFamilyController
);

// Get Family by ID
router.get(
    "/:id",
    protect,
    assignmentMiddleware,
    // levelGuard(["HEALTH_CENTER"]),
    permissionMiddleware("MANAGE_FAMILIES"),
    getFamilyByIdController
);

// Get Families by Creator ID (with pagination)
router.get(
    "/creator/:creatorId",
    protect,
    assignmentMiddleware,
    // levelGuard(["HEALTH_CENTER"]),
    permissionMiddleware("MANAGE_FAMILIES"),
    getFamiliesByCreatorController
);

// Get Families by Administrative Unit (filter with pagination)
router.get(
    "/filter",
    protect,
    assignmentMiddleware,
    // levelGuard(["HEALTH_CENTER"]),
    permissionMiddleware("MANAGE_FAMILIES"),
    getFamiliesByAdminUnitController
);

// Get Assigned Families for the current PC Worker
router.get(
    "/assigned/me",
    protect,
    assignmentMiddleware,
    // levelGuard(["HEALTH_CENTER"]),
    permissionMiddleware("MANAGE_FAMILIES"),
    getAssignedFamiliesController
);

// Update Family
router.put(
    "/:id",
    protect,
    assignmentMiddleware,
    // levelGuard(["HEALTH_CENTER"]),
    permissionMiddleware("MANAGE_FAMILIES"),
    validateFamilyUpdateInput,
    updateFamilyController
);

// Delete Family
router.delete(
    "/:id",
    protect,
    assignmentMiddleware,
    // levelGuard(["HEALTH_CENTER"]),
    permissionMiddleware("MANAGE_FAMILIES"),
    deleteFamilyController
);

module.exports = router;
