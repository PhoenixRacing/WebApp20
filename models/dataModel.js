var mongoose = require('mongoose');

var dataSchema = mongoose.Schema({

});

// expose the model for users
module.exports = {
	DataSchema: dataSchema,
	Data: mongoose.model('Data', dataSchema)
};