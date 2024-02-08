const express = require("express");
const controller = require('../controllers/snapshotcontroller');
const router = express.Router();

router.get("/record", controller.getRecordSnapshot);
router.get("/history", controller.getSnapshotHistory);
router.get("/viewsnapshot/:id", controller.getViewSnapshot);
router.get("/yourtrends", controller.getYourTrends);
router.get("/editsnapshot/:id", controller.getEditSnapshot);

router.post("/record", controller.postRecordSnapshot);
router.post("/updatesnapshot/:id", controller.postUpdateSnapshot);
router.post("/deletesnapshot/:id", controller.postDeleteSnapshot);

module.exports = router;
