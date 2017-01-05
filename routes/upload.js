var app = require("express").Router();

var fs = require('fs');
var multiparty = require('multiparty');
var path = require('path');
var imagejs = require("imagejs");

var authHelper = require('./../utils/authHelper.js');
var aws = require('./../utils/aws.js');
var GalleryImage = require('./../models/galleryModel.js').GalleryImage;

app.post("/profileimage", authHelper.isLoggedIn, function(req, res) {
    var form = new multiparty.Form();

    form.parse(req, function(err, fields, files) {

        var img = files.image[0];
        var filename = img.originalFilename.split(".");
        var filetype = filename[filename.length-1].toLowerCase();

        // figure out if it's actually an image
        var allowedTypes = ["jpg","jpeg","png","gif"];
        if (allowedTypes.indexOf(filetype) == -1) {
            errorHelper.sendError(req, res, 'File must be an image', 400);

            // delete the temp file
            fs.unlink(img.path, function() {});
            return;
        }

        var newImgPath = path.join(path.dirname(img.path), 'temp'+path.win32.basename(img.path));

        var bitmap = new imagejs.Bitmap();
        bitmap.readFile(img.path)
            .then(function() {
                var thumbnail = bitmap.resize({
                    width: 250, height: 250,
                    algorithm: "nearestNeighbor"
                });
                return thumbnail.writeFile(newImgPath);
            })
            .then(function() {
                fs.readFile(newImgPath, function (err, data) {
                    // Delete the files, we have the data
                    fs.unlink(img.path, function() {});
                    fs.unlink(newImgPath, function() {});

                    if (err) {
                        return errorHelper.sendError(req, res, 'Server error', 500);
                    }

                    // rename the file to milliseconds
                    var time = new Date().getTime();

                    aws.s3.upload({
                        Key : String(new Date().getTime()),
                        Body : data
                    }, function(err, d) {
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

        // imagejs.open(img.path).then(function(image) {
        //     console.log('lwip.open');
        //     console.log(image);
        //     return errorHelper.sendError(req, res, 'Server error', 500);
        // })
        // .catch(function(err) {
        //     return errorHelper.sendError(req, res, err, 500);
        // });

    });
});

app.post("/galleryimage", authHelper.isAdmin, function(req, res) {
    var form = new multiparty.Form();

    form.parse(req, function(err, fields, files) {
        var title = fields.title;
        var description = fields.description;
        var img = files.image[0];

        var filename = img.originalFilename.split(".");
        var filetype = filename[filename.length-1].toLowerCase();

        // figure out if it's actually an image
        var allowedTypes = ["jpg","jpeg","png","gif"];
        if (allowedTypes.indexOf(filetype) == -1) {
            errorHelper.sendError(req, res, 'File must be an image.', 400);

            // delete the temp file
            fs.unlink(img.path, function() {});
            return;
        }

        fs.readFile(img.path, function (err, data) {

            if (err) {
                return errorHelper.sendError(req, res, 'Server error', 500);
            }

            // rename the file to milliseconds
            var galleryImage = new GalleryImage();
            galleryImage.title = title;
            galleryImage.description = description;
            galleryImage.date = new Date();

            aws.s3.upload({
                Key : String(new Date().getTime()),
                Body : data
            }, function(err, d) {
                if (err) {
                    return errorHelper.sendError(req, res, 'Server error', 500);
                }

                // Update question
                galleryImage.url = d.Location;
                galleryImage.save(function(err, img) {
                    if (err) {
                        return errorHelper.sendError(req, res, 'Server error', 500);
                    }

                    res.sendStatus(200);
                    return;
                });
            });

            // delete the temp file
            fs.unlink(img.path, function() {});
        });
    });

});

app.delete("/galleryimage", authHelper.isAdmin, function(req, res) {

});

module.exports = app;
