var mongoose = require('mongoose');

var purchaseSchema = mongoose.Schema({
    user: String,
    item_name: String,
    url: String,
    cost: Number,
    date: Date,
    status: String,
    quantity: Number,
    notes: String
});

// expose the model for users
module.exports = {
	PurchaseSchema: purchaseSchema,
	Purchase: mongoose.model('Purchase', purchaseSchema)
};