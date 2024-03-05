const conn = require("../util/dbconn"); // Import database connection module
const basicController = require('../controllers/basiccontroller'); // Import basic controller module

// Render default route
exports.getDefault = (req, res) => {
  res.render("landingpage");
};

// Render landing page
exports.getLandingPage = (req, res) => {
  res.render("landingpage");
};

// Render home page
exports.getHomePage = (req, res) => {
  var userInfo = {}; // Initialize user info object
  const { isloggedin, userid, firstname } = req.session; // Extract session data
  console.log(`User data from session: ${isloggedin}, ${userid}, ${firstname}`); // Log session data
  userInfo = { isloggedin: isloggedin, userid: userid, firstname: firstname }; // Assign session data to user info object
  res.render("homepage", { user: userInfo }); // Render home page with user info
};

module.exports = basicController; // Export basic controller module
