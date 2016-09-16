var mongoose = require('mongoose');

var galleryImageSchema = mongoose.Schema({
    title: String,
    date: Date,
    description: String,
    url: String
});

module.exports = {
	GalleryImageSchema: galleryImageSchema,
	GalleryImage: mongoose.model('GalleryImage', galleryImageSchema)
}