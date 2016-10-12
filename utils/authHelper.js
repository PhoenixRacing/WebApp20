

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()) {
        return next();
    }

    // if they aren't redirect them to the home page
    res.redirect('/auth/login');
}

function isAdmin(req, res, next) {
	if (!req.user) {
		res.redirect('/auth/login');
		return;
	}

	if (!req.user.admin) {
		res.redirect('/');
		return;
	}

	return next();
}

module.exports = {
	'isLoggedIn' : isLoggedIn,
	'isAdmin' : isAdmin
}