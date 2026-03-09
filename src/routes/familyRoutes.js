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
    levelGuard(["HEALTH_CENTER"]),
    permissionMiddleware("MANAGE_FAMILIES"),
    validateFamilyCreationInput,
    createFamilyController
);

// Update Family
router.put(
    "/:id",
    protect,
    assignmentMiddleware,
    levelGuard(["HEALTH_CENTER"]),
    permissionMiddleware("MANAGE_FAMILIES"),
    validateFamilyUpdateInput,
    updateFamilyController
);

module.exports = router;
