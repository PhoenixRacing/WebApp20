var mongoose = require('mongoose');

var dataSchema = mongoose.Schema({

});

// define the schema
var userSchema = mongoose.Schema({
    username: String,
    password: String,
    email: String,
    data: [dataSchema]
});
 
// expose the model for users
module.exports = {
	User : mongoose.model('User', userSchema),
	Data : mongoose.model('Data', dataSchema)
};