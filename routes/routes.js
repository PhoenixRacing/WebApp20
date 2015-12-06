var path = require('path');
var fs = require('fs');
var multiparty = require('multiparty');
var passport = require('passport');
var app = require("express").Router()

app.get('/index', function(req, res) {
	res.send("HI");
});

app.get("/login", function(req, res) {
	console.log("Get login");
	res.sendFile(path.join(__dirname, '../views', 'login.html'));
});

app.post('/login', passport.authenticate('local-login', {
    successRedirect : '/profile', // redirect to the secure profile section
    failureRedirect : '/login', // redirect back to the signup page if there is an error
}));

app.get("/signup", function(req, res) {
	console.log("Get signup");
	res.sendFile(path.join(__dirname, '../views', 'signup.html'));
});

app.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/profile', // redirect to the secure profile section
    failureRedirect : '/signup', // redirect back to the signup page if there is an error
}));

app.get("/profile", isLoggedIn, function(req, res) {
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
				"lastName":value.lastName
			})
		});
		res.json(response);
		return;
	});
});

app.get("/uploadImage", function(req, res) {//isLoggedIn, function(req, res) {
	res.sendFile(path.join(__dirname, '../views', 'uploadImage.html'));
});

app.post("/uploadImage", function(req, res) {//isLoggedIn, function(req, res) {
	var form = new multiparty.Form();

	form.parse(req, function(err, fields, files) {

		var img = files.image[0];
		console.log(img);
		var filename = img.originalFilename.split(".")
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

		fs.readFile(img.path, function (err, data) {

			// delete the temp file
			fs.unlink(img.path, null);

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
				res.redirect("/uploadImage");
			});
		});
	});

})

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

module.exports = app;