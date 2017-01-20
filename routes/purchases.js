var purchase = require('express').Router();
var authHelper = require('../utils/authHelper');
var Purchase = require('../models/purchaseModel').Purchase;
var emailHelper = require('../utils/emailHelper');
var User = require('../models/userModel').User;

purchase.post('/newpurchase', authHelper.isLoggedIn, function(req, res) {
    var p = new Purchase();
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
            return errorHelper.sendError(req, res, 'Server error', 500);
        }
        User.findOne({purchaseManager: true}, function(err, pManager){
            emailHelper.sendEmail(pManager.email, 'New Baja Purchase Request', 'New purchase request from ' + req.user.username + ' for ' + p.item_name + '\nPrice: ' + p.price +
                '.  \nLink: ' + p.link + '\nQuantity: ' + p.count + '\nUrgency: ' + p.urgency + '\nAdditional info: ' + p.info);
            res.sendStatus(200);
        });
    });
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
