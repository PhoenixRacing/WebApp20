var purchase = require('express').Router();

var purchase = require('../models/purchaseModel').Purchase;

purchase.post('/data', function(req, res) {
	purchase.find({}, function(err, purchases) {
		if (err) {
			res.sendStatus(500);
			return;
		}

		res.send(purchases);
	})
});

purchase.post('/new', function(req, res) {
	var d = new Purchase();
	d.name = req.body.purchaseName;
	d.image = req.body.purchaseImage;

	d.save(function(err, savedpurchase) {
		if (err) {
			res.sendStatus(500);
			return;
		}

		res.sendStatus(200);
	});
});

purchase.post('/delete', function(req, res) {
	purchase.remove({'_id': req.body.purchaseId}, function(err, savedpurchase) {
		if (err) {
			res.sendStatus(500);
			return;
		}

		res.sendStatus(200);
	});
});

module.exports = purchase;
