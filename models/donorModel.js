var mongoose = require('mongoose');

var donorSchema = mongoose.Schema({
	name: String,
	image: String,
	isCorporate: Boolean
});

// expose the model for users
module.exports = {
	DonorSchema: donorSchema,
	Donor: mongoose.model('Donor', donorSchema)
};
