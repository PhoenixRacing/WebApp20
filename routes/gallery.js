var gallery = require("express").Router()

var authHelper = require('../utils/authHelper')
var GalleryImage = require('../models/galleryModel').GalleryImage;

gallery.post('/data', function(req, res) {
	GalleryImage.find({}, function(err, images) {
		if (err) {
			res.sendStatus(500);
			return;
		}

		res.send(images);
	});
});

gallery.post('/new', function(req, res) {
	GalleryImage.find({}, function(err, images) {
		if (err) {
			res.sendStatus(500);
			return;
		}

		res.send(images);
	});
});

gallery.post('/delete', authHelper.isAdmin, function(req, res) {
	GalleryImage.remove({'_id': req.body.imageId}, function(err) {
		if (err) {
			res.sendStatus(500);
			return;
		}

		res.sendStatus(200);
	});
});

module.exports = gallery;
