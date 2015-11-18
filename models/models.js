var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var dataSchema = mongoose.Schema({

});

// define the schema
var userSchema = mongoose.Schema({
    username: String,
    password: String,
    email: String,
    admin: Boolean,
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
	User : mongoose.model('User', userSchema),
	Data : mongoose.model('Data', dataSchema)
};
