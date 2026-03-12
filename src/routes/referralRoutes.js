const express = require("express");
const referralController = require("../controllers/referralController");
const { protect, permissionMiddleware } = require("../middlewares/authMiddleware");
const { validateReferralFeedbackInput, validateReferralQuery } = require("../validators/referralValidators");

const router = express.Router();

// Role: Health Center (Facility) Worker/Admin
router.get(
    "/incoming",
    protect,
    permissionMiddleware("RECEIVE_REFERRALS"),
    validateReferralQuery,
    referralController.getIncomingReferrals
);

router.patch(
    "/:id/feedback",
    protect,
    permissionMiddleware("RECEIVE_REFERRALS"),
    validateReferralFeedbackInput,
    referralController.provideReferralFeedback
);



// Role: PC Worker
router.get(
    "/sent",
    protect,
    permissionMiddleware("MANAGE_VISITS"),
    validateReferralQuery,
    referralController.getSentReferrals
);

// General
router.get(
    "/stats",
    protect,
    permissionMiddleware("MANAGE_VISITS"),
    referralController.getReferralStats
);

router.get(
    "/:id",
    protect,
    permissionMiddleware("MANAGE_VISITS"),
    referralController.getReferralDetails
);

module.exports = router;
