var purchase = require('express').Router();
var authHelper = require('../utils/authHelper');
var Purchase = require('../models/purchaseModel').Purchase;

purchase.post('/newpurchase', authHelper.isLoggedIn, function(req, res) {
	var p = new Purchase();
	p.name = req.body.name;
	p.item_name = req.body.item_name;
	p.link = req.body.link;
	p.price = req.body.price;
	p.date = req.body.date;
	p.status = req.body.status;
	p.count = req.body.count;
	p.urgency = req.body.urgency;
	p.info = req.body.info;

	p.save(function(err, savedpurchase) {
		if (err) {
            return errorHelper.sendError(req, res, 'Server error', 500);
		}

		res.sendStatus(200);
	});
	console.log('Success')
});

purchase.get('/data', function(req, res){
	Purchase.find({}, function(err, purchases) {
		if (err) {
            return errorHelper.sendError(req, res, 'Server error', 500);
		}

		res.send(purchases);
	})
});

module.exports = purchase;
