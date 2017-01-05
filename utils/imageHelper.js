
var aws = require('./aws.js');
var fs = require('fs');
var imagejs = require("imagejs");
var path = require('path');

function resizeImage(imgPath, width, height, callback) {
    var newImgPath = path.join(path.dirname(imgPath), 'temp'+path.win32.basename(imgPath));

    var bitmap = new imagejs.Bitmap();
    bitmap.readFile(imgPath)
        .then(function() {
            var thumbnail = bitmap.resize({
                width: width, height: height,
                algorithm: "bicubicInterpolation"
            });
            return thumbnail.writeFile(newImgPath);
        })
        .then(function() {
            fs.readFile(newImgPath, function(err, data) {
                // We have the data, delete the files
                fs.unlink(imgPath, function() {});
                fs.unlink(newImgPath, function() {});

                callback(err, data);
            });
        });
}

function uploadImageToS3(data, callback) {
    // rename the file to milliseconds
    var time = new Date().getTime();

    aws.s3.upload({
        Key : String(new Date().getTime()),
        Body : data
    }, callback);
}

function isImage(imgPath) {
    var filename = path.win32.basename(imgPath).split(".");
    var filetype = filename[filename.length-1].toLowerCase();

    // figure out if it's actually an image
    var allowedTypes = ["jpg","jpeg","png","gif"];

    return allowedTypes.indexOf(filetype) > -1
}

module.exports = {
    resizeImage: resizeImage,
    uploadImageToS3: uploadImageToS3,
    isImage: isImage
}