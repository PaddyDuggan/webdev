const express = require("express");
const controller = require('../controllers/basiccontroller');
const router = express.Router();

router.get("/", controller.getDefault);
router.get("/landing", controller.getLandingPage);
router.get("/home", controller.getHomePage);

module.exports = router;