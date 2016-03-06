var AWS = require('aws-sdk');
AWS.config.region = 'us-east-1'

var s3 = new AWS.S3({
	apiVersion: '2006-03-01',
	params: {
		Bucket: 'webapp20',
		ACL: 'public-read'
	}
});

module.exports = {
    s3: s3
}