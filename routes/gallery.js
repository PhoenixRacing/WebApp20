var gallery = require("express").Router()

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

module.exports = gallery;
