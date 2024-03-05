const express = require("express");
const controller = require('../controllers/usercontroller');
const router = express.Router();

// Define routes and their corresponding controller functions
router.get("/login", controller.getLogin);
router.get("/register", controller.getRegister);
router.get('/logout', controller.getLogout);

router.post("/login", controller.postLogin);
router.post("/register", controller.postRegister);

module.exports = router;