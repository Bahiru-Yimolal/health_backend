const express = require("express");
const {
  createCommitteeConroller,
  assignCommitteeController,
  getAllCommitteController,
  updateCommitteeNameController,
  unassignCommitteeController,
  getAllCommitteeLeadersController,
  resetCommitteeLeaderPasswordController,
  createAttendanceController,
  getUserAttendanceController,
  getCommitteeAttendanceController,
  getAttendanceByHealthCenterController,
  getAttendanceReportController,
  updateAttendanceCommentController
} = require("../controllers/committeeControllers");
const {
  validateCommitteInput,
  validateAssignCommittee,
  validateUpdateCommitteInput,
  validateAttendanceInput,
} = require("../validators/healthCenterValidators");

const { protect, verifySubcityLeader } = require("../middlewares/authMiddleware");

const router = express.Router();

// Route to create a group
router
  .route("/")
  .post(
    protect,
    verifySubcityLeader,
    validateCommitteInput,
    createCommitteeConroller
  );
router
  .route("/user/:user_id/:page/:limit")
  .get(protect, getUserAttendanceController);
router
  .route("/committee/:committee_id/:page/:limit")
  .get(protect, getCommitteeAttendanceController);

router
  .route("/healthCenter/:page/:limit")
  .get(protect, getAttendanceByHealthCenterController);

router
  .route("/create-attencance")
  .post(
    protect,
    validateAttendanceInput,
    createAttendanceController
  );

router
  .route("/attendance/comment/:attendance_id")
  .patch(protect, updateAttendanceCommentController);

router
  .route("/attendance/report")
  .post(protect, getAttendanceReportController);

router
  .route("/assign/")
  .patch(
    protect,
    verifySubcityLeader,
    validateAssignCommittee,
    assignCommitteeController
  );
router.route("/:healthCenter_id").get(protect, verifySubcityLeader, getAllCommitteController);
router
  .route("/updateName/:committee_id")
  .patch(
    protect,
    verifySubcityLeader,
    validateUpdateCommitteInput,
    updateCommitteeNameController
  );
router
  .route("/unassign/:user_id")
  .patch(protect, verifySubcityLeader, unassignCommitteeController);

router
  .route("/resetPassword")
  .patch(protect, verifySubcityLeader, resetCommitteeLeaderPasswordController);

router
  .route("/allCommitteeLeaders")
  .get(protect, verifySubcityLeader, getAllCommitteeLeadersController);


module.exports = router;
