var profile = require('express').Router();

var User = require('../models/userModel').User;

profile.post('/edit', function(req, res) {
    var userId;
    if (req.user) {
        userId = req.user._id;
    } else {
        userId = req.body.userId;
    }

    if (!userId) {
        return errorHelper.sendError(req, res, "No user id supplied", 400);
    }
    if (!req.body.edits) {
        return errorHelper.sendError(req, res, "No edits supplied", 400);
    }

    User.findOne({ '_id': userId }, function(err, user) {
        if (err) {
            return errorHelper.sendError(req, res, 'Error finding user', 500);
        }

        if (!user) {
            return errorHelper.sendError(req, res, "Couldn't find user with that id", 401);
        }

        var editableFields = ["major", "username"];
        var keys = Object.keys(req.body.edits)
        for (var i in keys) {
            var key = keys[i];
            if (editableFields.indexOf(key) > -1) {
                user[key] = req.body.edits[key];
            }
        }

        user.save(function(err, u) {
            if (err) {
                return errorHelper.sendError(req, res, 'Error finding user', 500);
            }

            res.send(u);
        });
    })
});

module.exports = profile;
