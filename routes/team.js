var team = require('express').Router();

var authHelper = require('./../utils/authHelper')
var userResponse = require('./../utils/userResponse');
var User = require('../models/userModel').User;

team.post("/data", function(req, res) {
    User.find({}, function(err, users) {
        if (err) {
            return errorHelper.sendError(res, 'Server error', 500);
        }

        // Don't send the password back. Using map prevents this.
        var response = [];
        console.log(users);

        res.json(users.map(userResponse.userMap));
        return;
    });
});

team.post("/delete", authHelper.isAdmin, function(req, res) {
    User.remove({"_id": req.body.userId}, function(err, user) {
        if (err) {
            return errorHelper.sendError(res, 'Server error', 500);
        }

        res.sendStatus(200);
    });
});

team.post("/editAdmin", authHelper.isAdmin, function(req, res) {
    User.findOne({"_id": req.body.userId}, function(err, user) {
        if (err) {
            res.sendStatus(500);
            return;
        }

        user.admin = req.body.admin;
        user.save(function(err, u) {
            if (err) {
                res.sendStatus(500);
                return;
            }

            res.sendStatus(200);
        });
    });
});

team.post("/editPurchaseManager", authHelper.isAdmin, function(req, res) {
    User.findOne({"_id": req.body.userId}, function(err, user) {
        if (err) {
            res.sendStatus(500);
            return;
        }

        user.purchaseManager = req.body.purchaseManager;
        user.save(function(err, u) {
            if (err) {
                res.sendStatus(500);
                return;
            }

            res.sendStatus(200);
        });
    });
});

module.exports = team;
