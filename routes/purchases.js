var purchase = require('express').Router();
var authHelper = require('../helpers/authHelper');
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
			console.log(err);
			res.sendStatus(500);
			return;
		}

		res.sendStatus(200);
	});
	console.log('Success')
});

purchase.get('/data', function(req, res){
	Purchase.find({}, function(err, purchases) {
		if (err) {
			res.sendStatus(500);
			return;
		}

		res.send(purchases);
	})
});

module.exports = purchase;
