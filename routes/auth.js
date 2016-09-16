var auth = require("express").Router()

var fs = require('fs');
var multiparty = require('multiparty');
var passport = require('passport');
var path = require('path');

var models = require('./../models/userModel').User;

auth.post("/isAuthenticated", function(req, res) {
	if (!req.user) {
		res.sendStatus(401);
	} else {
		res.sendStatus(200);
	}
});

auth.post("/isAdmin", function(req, res) {
	if (!req.user) {
		res.sendStatus(500);
	} else if (!req.user.admin) {
		res.sendStatus(401);
	} else {
		res.sendStatus(200);
	}
});

auth.post('/login', function(req, res, next) {
  passport.authenticate('local-login', function(err, user, info) {
    if (err) {
    	return next(err);
    }
    if (!user) {
    	return res.sendStatus(401);
    }
    req.logIn(user, function(err) {
      if (err) {
      	return next(err);
      }

      return res.redirect('/');
    });
  })(req, res, next);
});

auth.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/',
    failureRedirect : '/signup',
}));

auth.post('/logout', function(req, res) {
	req.logout();
	res.redirect('/');
});

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/login');
}

function isAdmin(req, res, next) {
	if (!req.user) {
		res.redirect('/login');
		return;
	}

	if (!req.user.admin) {
		res.redirect('/');
		return;
	}

	return next();
}

module.exports = auth;
