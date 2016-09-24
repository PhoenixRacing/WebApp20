var mongoose = require('mongoose');

var purchaseSchema = mongoose.Schema({
    name: String,
    item_name: String,
    link: String,
    price: Number,
    date: Date,
    status: String,
    count: Number,
    info: String
});

// expose the model for users
module.exports = {
	PurchaseSchema: purchaseSchema,
	Purchase: mongoose.model('Purchase', purchaseSchema)
};
