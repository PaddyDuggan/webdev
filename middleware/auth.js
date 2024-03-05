// Middleware function to check if the user is authenticated
exports.isAuth = (req, res, next) => {

    const { isloggedin } = req.session;

    if (!isloggedin == true) { 
        // If the user is not logged in, store the current route in the session object
        req.session.route = req.originalUrl;
        // Redirect the user to the login page
        res.redirect("/login");
    };

    // Call the next middleware function in the stack
    next();
};