var mongoose = require('mongoose');

var purchaseSchema = mongoose.Schema({
    name: String,
    item_name: String,
    link: String,
    price: String,
    date: Date,
    status: String,
    count: Number,
    urgency: String,
    info: String
});

// expose the model for users
module.exports = {
	PurchaseSchema: purchaseSchema,
	Purchase: mongoose.model('Purchase', purchaseSchema)
};
