var gallery = require("express").Router()

gallery.post('/data', function(req, res) {
	Gallery.find({}, function(err, images) {
		if (err) {
			res.sendStatus(500);
			return;
		}

		res.send(images);
	});
});

module.exports = gallery;
