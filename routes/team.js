var team = require('express').Router();

var User = require('../models/userModel').User;

team.post("/data", function(req, res) {
	User.find({}, function(err, users) {
		if (err) {
			res.sendStatus(500);
			return;
		}

		// Don't send the password back. Using map prevents this.
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

module.exports = team;