var app = require("express").Router();
var Purchase = require('../models/models.js').Purchase;

app.post("/purchase", function(req, res) {//isLoggedIn, function(req, res) {
	var newPurchase = new Purchase({
    user: req.body.user, // replace with logged in user!
    itemName: req.body.item,
    url: req.body.url,
    cost: req.body.cost,
    date: new Date(),
    quantity: req.body.quantity,
	status: "Received",
    notes: req.body.notes
	});

	newPurchase.save(function (err) {
		if (err) {
			res.status(500).send(err);
			console.log(err);
			return;
		}
	});

	return res.json(newPurchase);
});

app.get("/purchase", function(req, res) {//isLoggedIn, function(req, res) {
	Purchase.find({}, function(err, purchases) {
		if (err) {
			res.status(500).send(err);
			console.log(err);
			return;
		}

		return res.json(purchases);
	});
});

app.put("/purchase/:id", function(req, res) {//isLoggedIn, function(req, res) {
	var purchaseId = req.params.id;

	var update = {
    itemName: req.body.item,
    url: req.body.url,
    cost: req.body.cost,
    quantity: req.body.quantity,
		status: req.body.status,
    notes: req.body.notes
	};

	Purchase.findById(purchaseId, function(err, purchase) {
		if (err) {
			res.status(500).send(err);
			console.log(err);
			return;
		}
		else {
			if (purchase) {
				if (update.itemName)
					purchase.itemName = update.itemName;
				if (update.url)
					purchase.url = update.url;
				if (update.cost)
					purchase.cost = update.cost;
				if (update.quantity)
					purchase.quantity = update.quantity;
				if (update.status)
					purchase.status = update.status;
				if (update.notes)
					purchase.notes = update.notes;
				purchase.save(function(err) {
					if (err) {
						res.status(500).send(err);
						console.log(err);
						return;
					}
				});
				return res.json(purchase);
			}
			else {
				res.send("Could not find purchase");
			}
		}
	});
});

app.delete("/purchase/:id", function(req, res) {//isLoggedIn, function(req, res) {
	var purchaseId = req.params.id;

	Purchase.findById(purchaseId, function(err, purchase) {
		if (err) {
			res.status(500).send(err);
			console.log(err);
			return;
		}
		else {
			if (purchase) {
				purchase.remove({ _id: purchase._id }, function(err) {
					if (err) {
						res.status(500).send(err);
						console.log(err);
						return;
					}
					res.send("Purchase deleted");
				});
			}
			else {
				res.send("Could not find purchase");
			}
		}
	});
});

module.exports = app;
