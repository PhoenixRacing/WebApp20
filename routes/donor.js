var donor = require('express').Router();

var fs = require('fs');
var multiparty = require('multiparty');

var authHelper = require('./../utils/authHelper.js');
var Donor = require('../models/donorModel').Donor;
var imageHelper = require('./../utils/imageHelper');
var errorHelper = require('./../utils/errorHelper');

donor.post('/data', function(req, res) {
    Donor.find({}, function(err, donors) {
        if (err) {
            return errorHelper.sendError(res, 'Server error', 500);
        }

        var corporateDonors = [];
        var familyDonors = [];

        for (var i in donors) {
            var donor = donors[i];
            if (donor.isCorporate) {
                corporateDonors.push(donor);
            } else {
                familyDonors.push(donor);
            }
        }

        res.send({'corporateDonors': corporateDonors, 'familyDonors': familyDonors});
    })
});

donor.post('/new', authHelper.isAdmin, function(req, res) {
    var form = new multiparty.Form();

    form.parse(req, function(err, fields, files) {
        var donorName = fields.donorName;
        // idk why
        var isCorporate = fields.isCorporate == 'true';
        var img = files.image[0];

        if (!imageHelper.isImage(img.originalFilename)) {
            errorHelper.sendError(res, 'File must be an image.', 400);

            // delete the temp file
            fs.unlink(img.path, function() {});
            return;
        }

        imageHelper.resizeImage(img.path, 400, 200, function (err, data) {
            if (err) {
                return errorHelper.sendError(res, 'Server error', 500);
            }

            imageHelper.uploadImageToS3(data, function(err, data) {
                if (err) {
                    return errorHelper.sendError(res, 'Server error', 500);
                }

                var d = new Donor();
                d.name = donorName;
                d.isCorporate = isCorporate;
                d.image = data.Location;

                d.save(function(err, savedDonor) {
                    if (err) {
                        return errorHelper.sendError(res, 'Server error', 500);
                    }

                    res.sendStatus(200);
                });
            });
        });
    });

});

donor.post('/newNoImage', authHelper.isAdmin, function(req, res) {
    var donorName = req.body.donorName;
    var isCorporate = req.body.isCorporate;

    var d = new Donor();
    d.name = donorName;
    d.isCorporate = isCorporate;

    d.save(function(err, savedDonor) {
        if (err) {
            return errorHelper.sendError(res, 'Server error', 500);
        }

        res.sendStatus(200);
    });

});

donor.post('/delete', function(req, res) {
    Donor.remove({'_id': req.body.donorId}, function(err, savedDonor) {
        if (err) {
            return errorHelper.sendError(res, 'Server error', 500);
        }

        res.sendStatus(200);
    });
});

module.exports = donor;
