const conn = require("../util/dbconn");
const basicController = require('../controllers/basiccontroller');


exports.getDefault = (req, res) => {
  res.render("landingpage");
};

exports.getLandingPage = (req, res) => {
  res.render("landingpage");
};

exports.getHomePage = (req, res) => {

  var userInfo = {};
  const { isloggedin, userid, firstname } = req.session;
  console.log(`User data from session: ${isloggedin}, ${userid}, ${firstname}`);

  userInfo = { isloggedin: isloggedin, userid: userid, firstname: firstname };
  
  res.render("homepage", { user: userInfo });
};

module.exports = basicController;