var purchase = require('express').Router();
var authHelper = require('../utils/authHelper');
var Purchase = require('../models/purchaseModel').Purchase;
var emailHelper = require('../utils/emailHelper');
var User = require('../models/userModel').User;

purchase.post('/newpurchase', authHelper.isLoggedIn, function(req, res) {
    var p = new Purchase();
    p.name = req.user.username;
    p.userId = req.user._id;
    p.item_name = req.body.item_name;
    p.link = req.body.link;
    p.price = req.body.price;
    p.date = new Date();
    p.status = "Incomplete";
    p.count = req.body.count;
    p.urgency = req.body.urgency;
    p.info = req.body.info;

    p.save(function(err, savedpurchase) {
        if (err) {
            return errorHelper.sendError(res, 'Server error', 500);
        }
        User.findOne({purchaseManager: true}, function(err, pManager){
            console.log(pManager);
            console.log(pManager.email);
            emailHelper.sendEmail(pManager.email, 'New Baja Purchase Request', 'New purchase request from ' + p.name + ' for ' + p.item_name + '\nPrice: ' + p.price +
                '.  \nLink: ' + p.link + '\nQuantity: ' + p.count + '\nUrgency: ' + p.urgency + '\nAdditional info: ' + p.info);
            console.log('Success');
            res.sendStatus(200);
        });
    });
});

purchase.post('/data', authHelper.isPurchaseManaging, function(req, res){
    Purchase.find({}, function(err, purchases) {
        if (err) {
            return errorHelper.sendError(res, 'Server error', 500);
        }

        res.send(purchases);
    });
});

purchase.post('/update', authHelper.isPurchaseManaging, function(req, res) {
    var purchaseId = req.body.purchaseId;
    var newStatus = req.body.newStatus;

    Purchase.findOne({ '_id': purchaseId }).exec().then(function(purchase) {
        purchase.status = newStatus;
        return purchase.save();
    })
    .then(function(purchase) {
        res.sendStatus(200);
    })
    .catch(function(err) {
        return errorHelper.sendError(res, 'Server error', 500);
    });
});

purchase.post('/delete', authHelper.isPurchaseManaging, function(req, res) {
    var purchaseId = req.body.purchaseId;

    Purchase.remove({ '_id': purchaseId }).then(function(purchase) {
        res.sendStatus(200);
    })
    .catch(function(err) {
        return errorHelper.sendError(res, 'Server error', 500);
    });
});

module.exports = purchase;
