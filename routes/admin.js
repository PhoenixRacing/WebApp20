var path = require('path');
var fs = require('fs');
var multiparty = require('multiparty');
var models = require('./../models/models.js');
var User = models.User;
var admin = require("express").Router()

admin.get("/", isLoggedIn, isAdmin, function(req, res) {
	console.log(req.user);
	res.sendStatus(200);
});

admin.post("/edit", function(req, res) {
	// this route takes an admin userId and another userId and a boolean to give or revoke admin priveledges
	var adminId = req.body.adminId;
	var userId = req.body.userId;
	var isAdmin = req.body.isAdmin;

	User.findOne({'_id':adminId}, function(err, admin) {
		if (err) {
			console.log(err);
			res.sendStatus(500);
			return;
		}

		if (!admin || !admin.admin) {
			res.sendStatus(401);
			return;
		}

		User.findOne({'_id':userId}, function(err, user) {
			if (err) {
				console.log(err);
				res.sendStatus(500);
				return;
			}

			user.admin = isAdmin;
			console.log(user.admin);
			user.save(function(err, savedUser) {
				if (err) {
					console.log(err);
					res.sendStatus(500);
					return;
				}

				res.send(savedUser);
				return;
			});
		});
	});
});

admin.post("/deleteUser", function(req, res) {
	// this route takes an admin userId and another userId and a boolean to give or revoke admin priveledges
	var adminId = req.body.adminId;
	var userId = req.body.userId;

	User.findOne({'_id':adminId}, function(err, admin) {
		if (err) {
			console.log(err);
			res.sendStatus(500);
			return;
		}

		if (!admin || !admin.admin) { // only for admins
			res.sendStatus(401);
			return;
		}

		User.findOne({'_id':userId}, function(err, user) {
			if (err) {
				console.log(err);
				res.sendStatus(500);
				return;
			}

			console.log(user);
			user.remove(function(err) {
				if (err) {
					console.log(err);
					res.sendStatus(500);
					return;
				}

				res.sendStatus(200);
				return;
			});
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

module.exports = admin;