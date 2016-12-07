
var auth;
if (!process.env.HEROKU_ENV) {
	auth = require('./../auth.js');
}
var nodemailer = require('nodemailer');


function sendEmail(to, subject, body) {
// create reusable transporter object using the default SMTP transport
	var email = process.env.BOT_EMAIL || auth.gmailEmail;
	var password = process.env.BOT_PASSWORD || auth.gmailPassword;
	var transporter = nodemailer.createTransport('smtps://'+email+':'+password+'@smtp.gmail.com');

	// setup e-mail data with unicode symbols
	var mailOptions = {
	    from: '"Olin Baja Bot" <'+email+'>', // sender address
	    to: to, // list of receivers
	    subject: subject, // Subject line
	    text: body, // plaintext body
	};

	// send mail with defined transport object
	transporter.sendMail(mailOptions, function(error, info){
	    if(error){
	        return console.log(error);
	    }
	    console.log('Message sent: ' + info.response);
	});
}

module.exports = {
	sendEmail: sendEmail
};
