var app = require("express").Router();

var fs = require('fs');
var multiparty = require('multiparty');
var passport = require('passport');
var path = require('path');

var authHelper = require('./../utils/authHelper');
var Purchase = require('../models/purchaseModel').Purchase;
var User = require('../models/userModel').User;

app.get("/uploadImage", function(req, res) {//isLoggedIn, function(req, res) {
	res.sendFile(path.join(__dirname, '../views', 'uploadImage.html'));
});

app.post("/uploadImage", function(req, res) {//isLoggedIn, function(req, res) {
	var form = new multiparty.Form();

	form.parse(req, function(err, fields, files) {

		var img = files.image[0];
		console.log(img);
		var filename = img.originalFilename.split(".");
		var filetype = filename[filename.length-1].toLowerCase();

		// figure out if it's actually an image
		var allowedTypes = ["jpg","jpeg","png","gif"];
		if (allowedTypes.indexOf(filetype) == -1) {
			console.log("ERROR. File must be an image.");

			// delete the temp file
			fs.unlink(img.path, null);
			res.redirect("/uploadImage");
			return;
		}
		console.log(images);
		res.json(images);
		return;
	});
});

module.exports = app;
