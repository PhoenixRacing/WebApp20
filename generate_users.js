var mongoose = require('mongoose');
var User = require('./models/userModel').User;

var user = new User();
user.username = 'Bob';
user.password = '';
user.email = '';
user.major = '';
user.admin = true;
user.requestDisplayInTeamPage = true;
user.shownInTeamPage = true;
user.image = '';

user.save(function(err, img) {
					console.log('errored');
	            });

console.log(JSON.stringify(user));