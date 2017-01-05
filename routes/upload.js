var app = require("express").Router();

var fs = require('fs');
var multiparty = require('multiparty');

var authHelper = require('./../utils/authHelper.js');
var GalleryImage = require('./../models/galleryModel.js').GalleryImage;
var imageHelper = require('./../utils/imageHelper');

app.post("/profileimage", authHelper.isLoggedIn, function(req, res) {
    var form = new multiparty.Form();

    form.parse(req, function(err, fields, files) {
        var img = files.image[0];

        if (!imageHelper.isImage(img.originalFilename)) {
            errorHelper.sendError(req, res, 'File must be an image', 400);

            // delete the temp file
            fs.unlink(img.path, function() {});
            return;
        }

        imageHelper.resizeImage(img.path, 250, 250, function (err, data) {
            if (err) {
                return errorHelper.sendError(req, res, 'Server error', 500);
            }

            imageHelper.uploadImageToS3(data, function(err, d) {
                if (err) {
                    return errorHelper.sendError(req, res, 'Server error', 500);
                }

                // Update question
                req.user.image = d.Location;
                req.user.save(function(err, u) {
                    if (err) {
                        return errorHelper.sendError(req, res, 'Server error', 500);
                    }
                    res.sendStatus(200);
                });
            });
        });
    });
});

app.post("/galleryimage", authHelper.isAdmin, function(req, res) {
    var form = new multiparty.Form();

    form.parse(req, function(err, fields, files) {
        var title = fields.title;
        var description = fields.description;
        var img = files.image[0];

        if (!imageHelper.isImage(img.originalFilename)) {
            errorHelper.sendError(req, res, 'File must be an image.', 400);

            // delete the temp file
            fs.unlink(img.path, function() {});
            return;
        }

        imageHelper.resizeImage(img.path, 900, 600, function (err, data) {
            if (err) {
                return errorHelper.sendError(req, res, 'Server error', 500);
            }

            imageHelper.uploadImageToS3(data, function(err, d) {
                if (err) {
                    return errorHelper.sendError(req, res, 'Server error', 500);
                }

                var galleryImage = new GalleryImage();
                galleryImage.title = title;
                galleryImage.description = description;
                galleryImage.date = new Date();
                galleryImage.url = d.Location;

                galleryImage.save(function(err, u) {
                    if (err) {
                        return errorHelper.sendError(req, res, 'Server error', 500);
                    }
                    res.sendStatus(200);
                });
            });
        });
    });

});

app.delete("/galleryimage", authHelper.isAdmin, function(req, res) {

});

module.exports = app;
