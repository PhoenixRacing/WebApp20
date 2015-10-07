var path = require('path');

module.exports = function(app, passport) {

	app.get('/index', function(req, res) {
		res.send("HI");
	});

	app.get("/login", function(req, res) {
		console.log("Get login")
		//res.send("HELLO");
		res.sendFile(path.join(__dirname, '../views', 'login.html'));
	});

    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/index', // redirect back to the signup page if there is an error
    }));

	app.get("/profile", isLoggedIn, function(req, res) {
		res.sendFile("/views/login.html");
	});

	// route middleware to make sure a user is logged in
	function isLoggedIn(req, res, next) {

	    // if user is authenticated in the session, carry on 
	    if (req.isAuthenticated())
	        return next();

	    // if they aren't redirect them to the home page
	    res.redirect('/');
	}
}