var gallery = require("express").Router()

var authHelper = require('../utils/authHelper')
var GalleryImage = require('../models/galleryModel').GalleryImage;
var errorHelper = require('./../utils/errorHelper');

gallery.post('/data', function(req, res) {
    GalleryImage.find({}, function(err, images) {
        if (err) {
            return errorHelper.sendError(res, 'Server error', 500);
        }

        res.send(images);
    });
});

gallery.post('/delete', authHelper.isAdmin, function(req, res) {
    GalleryImage.remove({'_id': req.body.imageId}, function(err) {
        if (err) {
            return errorHelper.sendError(res, 'Server error', 500);
        }

        res.sendStatus(200);
    });
});

module.exports = gallery;
