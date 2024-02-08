const conn = require("./../util/dbconn");
const util = require("util");
const userController = require("../controllers/usercontroller");
const bcrypt = require('bcrypt');

exports.getLogin = (req, res) => {
  res.render("login", { errorMessage: null });
};

// Handle POST requests to /login
exports.postLogin = async (req, res) => {
  const { email, password } = req.body;

  // Query the database to check if the user exists
  const loginSQL = "SELECT * FROM users WHERE email_address=?";
  conn.query(loginSQL, [email], async (err, result) => {
    if (err) {
      console.error("Database query error:", err.message);
      res.status(500).send("Internal Server Error");
      return;
    }

    if (result.length > 0) {
      // User exists, now compare the passwords
      const user = result[0];
      try {
        const passwordMatch = await bcrypt.compare(password, user.user_password);
        if (passwordMatch) {
          // Passwords match, authenticate the user
          req.session.isloggedin = true;
          req.session.userid = user.user_id;
          req.session.firstname = user.first_name;
          res.render("homepage", { user: req.session }); // Pass data if needed
        } else {
          // Passwords do not match
          res.render("login", { errorMessage: "Invalid email or password" });
        }
      } catch (error) {
        console.error("Error comparing passwords:", error);
        res.status(500).send("Internal Server Error");
      }
    } else {
      // User does not exist
      res.render("login", { errorMessage: "Invalid email or password" });
    }
  });
};

exports.getRegister = (req, res) => {
  res.render("register", { errorMessage: null });
};

// Route to handle user registration (POST method)
exports.postRegister = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Hash the user's password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds
    
    const vals = [firstName, lastName, email, hashedPassword]; 

    // Check if the email already exists in the database
    const checkEmailSQL = `SELECT * FROM users WHERE email_address = ?`;

    // Use promisify to convert the callback-based query to a promise-based one
    const queryAsync = util.promisify(conn.query).bind(conn);

    // Instead of a callback, we use await to get the result of the query
    const rows = await queryAsync(checkEmailSQL, [email]);

    // If there is an existing user with the same email, handle accordingly
    if (rows.length > 0) {
      return res.render("register", {
        errorMessage: "Email address is already in use",
      });
    }

    // Insert the new user if the email is not in use
    const insertSQL = `INSERT INTO users (first_name, last_name, email_address, user_password) VALUES (?, ?, ?, ?)`;

    // Instead of a callback, we use await to ensure the query is completed before proceeding
    await queryAsync(insertSQL, vals);


    // Query the database to pull out necessary info for session (mainly user_id)
    const loginSQL =
    "SELECT * FROM users WHERE email_address=? AND user_password=?";
  conn.query(loginSQL, [email, hashedPassword], (err, result) => {
    if (err) {
      console.error("Database query error:", err.message);
      res.status(500).send("Internal Server Error");
      return;
    }
      
      const user = req.session;
      user.isloggedin = true;
      user.userid = result[0].user_id
      user.firstname = result[0].first_name;
      console.log(user);

      res.render("homepage", { user: user }); 

  });

    //res.render("homepage", { data: firstName });
  } catch (error) {
    // Handle errors in a centralised location
    console.error("Error in postRegister:", error);
    res.status(500).send("Internal Server Error");
  }
};

exports.getLogout = (req, res) => {

  req.session.destroy(() => {
    res.render("login", { errorMessage: null });
  })
  
};

module.exports = userController;
