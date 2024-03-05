const express = require("express");
const controller = require('../controllers/basiccontroller');
const router = express.Router();

// Define routes and their corresponding controller functions
router.get("/", controller.getDefault);
router.get("/landing", controller.getLandingPage);
router.get("/home", controller.getHomePage);

module.exports = router;