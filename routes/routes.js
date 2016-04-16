var app = require("express").Router();
var path = require('path');
var models = require('./../models/models.js');
var authHelper = require('./../utils/authHelper.js');
var User = models.User;
var GalleryImage = models.GalleryImage;

app.get('/index', function(req, res) {
	res.send("HI");
});

app.get("/profile", authHelper.isLoggedIn, function(req, res) {
	console.log(req.user);
	res.sendFile(path.join(__dirname, '../views', 'profile.html'));
});

app.get("/team", function(req, res) {
	User.find({}, function(err, users) {
		if (err) {
			res.sendStatus(500);
			return;
		}
		var response = [];
		users.map(function(value, index, array) {
			response.push({
				"email":value.email,
				"_id":value._id,
				"firstName":value.firstName,
				"lastName":value.lastName,
				"username":value.username,
				"major":value.major,
				"admin":value.admin
			});
		});
		res.json(response);
		return;
	});
});

app.get("/gallerydata", function(req, res) {
	GalleryImage.find({}, function(err, images) {
		if (err) {
			res.sendStatus(500);
			return;
		}
		console.log(images);
		res.json(images);
		return;
	});
});

module.exports = app;
