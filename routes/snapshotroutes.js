const express = require("express");
const controller = require('../controllers/snapshotcontroller');
const { isAuth } = require('./../middleware/auth')

const router = express.Router();

// Define routes and their corresponding controller functions
router.get("/record", isAuth, controller.getRecordSnapshot);
router.get("/history", isAuth, controller.getSnapshotHistory);
router.get("/viewsnapshot/:id", isAuth, controller.getViewSnapshot);
router.get("/yourtrends", isAuth, controller.getYourTrends);
router.get("/editsnapshot/:id", isAuth, controller.getEditSnapshot);

router.post("/record", controller.postRecordSnapshot);
router.post("/updatesnapshot/:id", controller.postUpdateSnapshot);
router.post("/deletesnapshot/:id", controller.postDeleteSnapshot);

module.exports = router;
