var path = require('path');
var fs = require('fs');
var multiparty = require('multiparty');
var models = require('./../models/models.js');
var passport = require('passport');
var User = models.User;
var auth = require("express").Router()

auth.get("/isAuthenticated", function(req, res) {
	if (!req.user) {
		res.sendStatus(500);
	} else {
		res.sendStatus(200);
	}
});

auth.get("/isAdmin", function(req, res) {
	if (!req.user) {
		res.sendStatus(500);
	} else if (!req.user.admin) {
		res.sendStatus(401);
	} else {
		res.sendStatus(200);
	}
});

auth.get("/login", function(req, res) {
	res.sendFile(path.join(__dirname, '../views', 'login.html'));
});

auth.post('/login', function(req, res, next) {
  passport.authenticate('local-login', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) { return res.redirect('/auth/login?error=Try%20again'); }
    req.logIn(user, function(err) {
      if (err) { return next(err); }

      console.log(req.query);

      return res.redirect('/profile');
    });
  })(req, res, next);
});

auth.get("/signup", function(req, res) {
	res.sendFile(path.join(__dirname, '../views', 'signup.html'));
});

auth.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/profile', // redirect to the secure profile section
    failureRedirect : '/auth/signup', // redirect back to the signup page if there is an error
}));

auth.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/');
});

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

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

module.exports = auth;