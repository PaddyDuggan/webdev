const express = require('express'); // Import Express framework
const morgan = require('morgan'); // Import Morgan for logging
const path = require('path'); // Import Path for file paths
const dotenv = require('dotenv').config({ path: './config.env'}); // Load environment variables from config file
const basicRouter = require('./routes/basicroutes'); // Import basic routes
const snapshotRouter = require('./routes/snapshotroutes'); // Import snapshot routes
const userRouter = require('./routes/userroutes'); // Import user routes
const bodyParser = require('body-parser'); // Import body-parser for parsing request bodies
const session = require("express-session"); // Import express-session for managing sessions

const app = express(); // Initialize express app

app.set('view engine', 'ejs'); // Set EJS as the view engine

// Serve static files from the specified directories
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.static(path.join(__dirname, '/css')));
app.use(express.static(path.join(__dirname, '/navbar')));

app.use(morgan('tiny')); // Log HTTP requests to the console

app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Middleware for parsing JSON and form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Session middleware with configuration
app.use(
    session({
      secret: "mysecretkey1234", // Secret key for session encryption
      resave: false, // Do not save session if unmodified
      saveUninitialized: false, // Do not save new sessions
      expires: new Date(Date.now() + 3600000), // Session will expire in one hour
    })
);

app.use(basicRouter); // Use basic router middleware
app.use(snapshotRouter); // Use snapshot router middleware
app.use(userRouter); // Use user router middleware

// Start the server and listen on the specified port
app.listen(process.env.PORT, (err) => {
    if(err) return console.log(err);
    console.log(`Express web server listening on port ${process.env.PORT}`);
});

