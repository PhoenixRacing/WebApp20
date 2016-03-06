var app = require("express").Router();
var path = require('path');
var fs = require('fs');
var multiparty = require('multiparty');
var aws = require('./../utils/aws.js');
var authHelper = require('./../utils/authHelper.js');

app.get("/image", authHelper.isLoggedIn, function(req, res) {
	res.sendFile(path.join(__dirname, '../views', 'uploadImage.html'));
});

app.post("/image", authHelper.isLoggedIn, function(req, res) {
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
			fs.unlink(img.path, function() {});
			res.redirect("/upload/image");
			return;
		}

		fs.readFile(img.path, function (err, data) {

			if (err) {
				console.log(err);
				return;
			}

			// rename the file to milliseconds
			var time = new Date().getTime();
			var newPath = path.join(__dirname, '../uploads', String(time) + "." + filetype);

			fs.writeFile(newPath, data, function (err) {
				if (err) {
					console.log(err);
				}

				aws.s3.upload({
					Key : String(time),
					Body : data
				}, function(err, d) {
		            if (err) {
		            	console.log(err);
						res.redirect("/upload/image");
		            	return;
		            }
		            
		            // Update question
		            console.log(d);
		            console.log(d.Location);
					res.redirect("/upload/image");
		        });

			});

			// delete the temp file
			fs.unlink(img.path, function() {});
		});
	});

});

module.exports = app;
