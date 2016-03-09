var app = require("express").Router();
var path = require('path');
var fs = require('fs');
var multiparty = require('multiparty');
var aws = require('./../utils/aws.js');
var authHelper = require('./../utils/authHelper.js');
var GalleryImage = require('./../models/models.js').GalleryImage;

app.get("/profileimage", authHelper.isLoggedIn, function(req, res) {
	res.sendFile(path.join(__dirname, '../views', 'uploadProfile.html'));
});

app.post("/profileimage", authHelper.isLoggedIn, function(req, res) {
	var form = new multiparty.Form();

	form.parse(req, function(err, fields, files) {

		var img = files.image[0];
		var filename = img.originalFilename.split(".");
		var filetype = filename[filename.length-1].toLowerCase();

		// figure out if it's actually an image
		var allowedTypes = ["jpg","jpeg","png","gif"];
		if (allowedTypes.indexOf(filetype) == -1) {
			console.log("ERROR. File must be an image.");

			// delete the temp file
			fs.unlink(img.path, function() {});
			res.redirect("/upload/profileimage");
			return;
		}

		fs.readFile(img.path, function (err, data) {

			if (err) {
				console.log(err);
				return;
			}

			// rename the file to milliseconds
			var time = new Date().getTime();

			aws.s3.upload({
				Key : String(time),
				Body : data
			}, function(err, d) {
	            if (err) {
	            	console.log(err);
					res.redirect("/upload/profileimage");
	            	return;
	            }
	            
	            // Update question
	            req.user.image = d.Location;
	            req.user.save(function(err, u) {
	            	if (err) {
	            		console.log(err);
	            	}
	            	console.log(u);
					res.redirect("/upload/profileimage");
	            });
	        });

			// delete the temp file
			fs.unlink(img.path, function() {});
		});
	});

});

app.get("/galleryimage", authHelper.isAdmin, function(req, res) {
	res.sendFile(path.join(__dirname, '../views', 'uploadGallery.html'));
});

app.post("/galleryimage", authHelper.isAdmin, function(req, res) {
	var form = new multiparty.Form();

	form.parse(req, function(err, fields, files) {
		var title = fields.title[0];
		var description = fields.description[0];
		var img = files.image[0];

		var filename = img.originalFilename.split(".");
		var filetype = filename[filename.length-1].toLowerCase();

		// figure out if it's actually an image
		var allowedTypes = ["jpg","jpeg","png","gif"];
		if (allowedTypes.indexOf(filetype) == -1) {
			console.log("ERROR. File must be an image.");

			// delete the temp file
			fs.unlink(img.path, function() {});
			res.redirect("/upload/galleryimage");
			return;
		}

		fs.readFile(img.path, function (err, data) {

			if (err) {
				console.log(err);
				return;
			}

			// rename the file to milliseconds
			var galleryImage = new GalleryImage();
			galleryImage.title = title;
			galleryImage.description = description;
			galleryImage.date = new Date();

			aws.s3.upload({
				Key : String(new Date().getTime()),
				Body : data
			}, function(err, d) {
	            if (err) {
	            	console.log(err);
					res.redirect("/upload/galleryimage");
	            	return;
	            }
	            
	            // Update question
	            galleryImage.url = d.Location;
	            galleryImage.save(function(err, img) {
					res.redirect("/upload/galleryimage");
					return;
	            });
	        });

			// delete the temp file
			fs.unlink(img.path, function() {});
		});
	});

});

app.delete("/galleryimage", authHelper.isAdmin, function(req, res) {

});

module.exports = app;
