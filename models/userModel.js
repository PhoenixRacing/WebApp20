var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var dataSchema = require('./dataModel').DataSchema;

var userSchema = mongoose.Schema({
	username: String,
    password: String,
    email: String,
    major: String,
    graduatingClass: Number,
    admin: Boolean,
    title: String,
    teamCaptain: Boolean,
    systemLead: Boolean,
    purchaseManager: Boolean,
    shownInTeamPage: Boolean,
    image: String,
    data: [dataSchema]
});

userSchema.methods.generateHash = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
	return bcrypt.compareSync(password, this.password);
};

// expose the model for users
module.exports = {
	UserSchema : userSchema,
	User : mongoose.model('User', userSchema)
};
