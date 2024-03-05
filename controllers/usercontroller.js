const conn = require("./../util/dbconn"); // Import database connection module
const util = require("util"); // Import util module
const userController = require("../controllers/usercontroller"); // Import user controller module
const bcrypt = require("bcrypt"); // Import bcrypt module for password hashing
const axios = require("axios"); // Import axios module for making HTTP requests

// Render login page
exports.getLogin = (req, res) => {
  res.render("login", { errorMessage: null }); // Render login page with error message as null
};

// Handle POST requests to /login
exports.postLogin = async (req, res) => {
  try {
    const { email, password } = req.body; // Extract email and password from request body

    const endpoint = `http://localhost:3002/login`; // Define API endpoint

    // Send POST request to API endpoint
    const response = await axios.post(
      endpoint,
      { email, password },
      { validateStatus: (status) => status < 500 }
    );

    const status = response.status; // Extract response status

    if (status === 200) {
      const user = response.data.result[0]; // Extract user data from response

      console.log(password);
      console.log(user.user_password);

      try {
        // Compare hashed password with input password using bcrypt
        const passwordMatch = await bcrypt.compare(
          password,
          user.user_password
        );
        if (passwordMatch) {
          // Passwords match, authenticate the user
          const session = req.session; // Get session object
          session.isloggedin = true; // Set isloggedin to true
          session.userid = user.user_id; // Set userid
          session.firstname = user.first_name; // Set firstname
          //console.log(`postLogin: session: ${session}`);

          var orig_route = session.route; // Get original route from session
          console.log(`postLogin: orig_route: ${orig_route}`);

          if(!orig_route) {
            orig_route = '/home'; // Set default route if original route is not set
          }
          res.redirect(`${orig_route}`); // Redirect to original route
        } else {
          // Passwords do not match, render login page with error message
          res.render("login", { errorMessage: "Invalid email or password" });
        }
      } catch (error) {
        console.error("Error comparing passwords:", error);
        res.status(500).send("Internal Server Error"); 
      }
    } else {
      console.log(response.status);
      console.log(response.data);
      // Invalid email or password, render login page with error message
      res.render("login", { errorMessage: "Invalid email or password" });
    }
  } catch (error) {
    console.log(`Error making API request ${error}`); // Log error if request fails
  }
};

// Render register page
exports.getRegister = (req, res) => {
  res.render("register", { errorMessage: null });
};

// Handle POST requests to /register
exports.postRegister = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body; // Extract user data from request body

    // Hash the user's password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds
    console.log(password);
    console.log(hashedPassword);

    // Axios call 1: Check if the email already exists in the database
    const emailCheckEndpoint = `http://localhost:3002/login`;
    const emailCheckResponse = await axios.post(emailCheckEndpoint, { email, password }, {validateStatus: (status) => status < 500 });

    if (emailCheckResponse.status === 200) {
      console.log(emailCheckResponse.status);
      console.log(emailCheckResponse.data);
      return res.render("register", { errorMessage: "Email address is already in use" });
    }

    // Axios call 2: Insert the new user if the email is not in use
    const registerEndpoint = `http://localhost:3002/register`;
    const registerResponse = await axios.post(registerEndpoint, { firstName, lastName, email, hashedPassword }, { validateStatus: (status) => status < 500 });

    if (registerResponse.status !== 200) {
      console.log(registerResponse.status);
      console.log(registerResponse.data);
      return res.status(500).send("Internal Server Error");
    }

    // Axios call 3: Query the database to pull out necessary info for session (mainly user_id)
    const loginEndpoint = `http://localhost:3002/login`;
    const userInfoResponse = await axios.post(loginEndpoint, { email, password }, { validateStatus: (status) => status < 500 });


    if (userInfoResponse.status === 200) {
      const user = userInfoResponse.data.result[0];
      console.log(user);

      // Set session variables
      req.session.isloggedin = true;
      req.session.userid = user.user_id;
      req.session.firstname = user.first_name;


      return res.render("homepage", { user: req.session });
    } else {
      console.log(userInfoResponse.status);
      console.log(userInfoResponse.data);
      return res.status(500).send("Internal Server Error");
    }
  } catch (error) {
    console.log(`Error making API request ${error}`);
    return res.status(500).send("Internal Server Error");
  }
};

// Handle user logout
exports.getLogout = (req, res) => {
  req.session.destroy(() => {
    res.render("login", { errorMessage: null });
  });
};

module.exports = userController; // Export user controller module
