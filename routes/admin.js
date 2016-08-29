var admin = require("express").Router();

var fs = require('fs');
var multiparty = require('multiparty');
var path = require('path');

var authHelper = require('./../helpers/authHelper');
var User = require('./../models/userModel').User;

admin.post("/edit", function(req, res) {
	// this route takes an admin userId and another userId and a boolean to give or revoke admin priveledges
	var adminId = req.user ? req.user._id : req.body.adminId;
	var userId = req.body.userId;
	var isAdmin = req.body.isAdmin;

	User.findOne({'_id':adminId}, function(err, admin) {
		if (err) {
			console.log(err);
			res.sendStatus(500);
			return;
		}

		console.log(admin);

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
	var adminId = req.user ? req.user._id : req.body.adminId;
	var userId = req.body.userId;
	console.log(userId);

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

			console.log("hi");
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

module.exports = admin;