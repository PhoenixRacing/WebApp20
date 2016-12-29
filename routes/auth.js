var auth = require("express").Router()

var fs = require('fs');
var multiparty = require('multiparty');
var passport = require('passport');
var path = require('path');

var emailHelper = require('./../utils/emailHelper');
var errorHelper = require('./../utils/errorHelper');
var passwordHelper = require('./../utils/passwordHelper');
var User = require('./../models/userModel').User;

auth.post("/isAuthenticated", function(req, res) {
    if (!req.user) {
        return errorHelper.sendError(req, res, 'Unauthenticated user', 401);
    } else {
        return res.sendStatus(200);
    }
});

auth.post("/isAdmin", function(req, res) {
    if (!req.user) {
        return errorHelper.sendError(req, res, "User isn't logged in", 500);
    } else if (!req.user.admin) {
        return errorHelper.sendError(req, res, "User isn't an admin", 401);
    } else {
        return res.sendStatus(200);
    }
});

auth.post('/login', function(req, res, next) {
  passport.authenticate('local-login', function(err, user, info) {
    if (err) {
        return next(err);
    }
    if (!user) {
        return errorHelper.sendError(req, res, "User doesn't exists", 401);
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

auth.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

auth.post('/logout', function(req, res) {
    req.logout();
    res.sendStatus(200);
});

// POST /auth/forgotPassword
// @description -- This route resets the password of the user to a new alphanumeric password and emails them the new password.
// @param req.body.email -- The email of the user who's password should be reset.
// @returns 200 if successful, 500 if error, 404 if no email, 400 if invalid password.
auth.post('/forgotPassword', function(req, res) {
    var email = req.body.email;
    var password = req.body.password;

    User.findOne({ 'email' :  email }, function(err, user) {
        if (err) {
            return errorHelper.sendError(req, res, 'Error looking up user', 500);
        }

        if (!user) {
            return errorHelper.sendError(req, res, 'No user with that email', 401);
        }

        var newPassword = Math.random().toString(36).slice(2, 10);
        user.password = user.generateHash(newPassword);
        user.save(function(err, newUser) {
            emailHelper.sendEmail(email, "Password Reset for Olin Baja", "We've reset your password. Your new password is:\n\n"+newPassword+"\n\nPlease log in to the Olin Baja site and change your password as soon as possible.");
            return res.sendStatus(200);
        });
    });
});

// POST /auth/resetPassword
// @param req.body.email -- The email of the user who's password should be reset
// @param req.body.oldPassword -- The user's current password.
// @param req.body.newPassword -- The password for this to be set to.
// @returns 200 if successful, 500 if error, 404 if no email, 401 if wrong password, 400 if invalid new password.
auth.post('/resetPassword', function(req, res) {
    var email = req.body.email;
    var oldPassword = req.body.oldPassword;
    var newPassword = req.body.newPassword;

    User.findOne({ 'email' :  email }, function(err, user) {
        if (err) {
            return errorHelper.sendError(req, res, 'Error looking up user', 500);
        }

        if (!user) {
            return errorHelper.sendError(req, res, 'No user with that email', 404);
        }

        if (!user.validPassword(oldPassword)) {
            return errorHelper.sendError(req, res, 'Incorrect password', 401);
        }

        if (!passwordHelper.isPasswordValid(newPassword)) {
            return errorHelper.sendError(req, res, passwordHelper.passwordError(newPassword), 400);
        }

        user.password = user.generateHash(newPassword);
        user.save(function(err, newUser) {
            res.sendStatus(200);
            return;
        });
    });
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
