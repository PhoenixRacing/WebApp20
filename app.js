/*
Entry point into the express app. Run using either
node app.js or nodemon app.js
*/

//Import the necessary libraries for the app
var express = require('express'), //Makes the magic happen
		logger = require('morgan'), //So we can actually see whats happening on the command line
		path = require('path'), //makes it easier to write the path to things
		mongoose = require('mongoose'), //Javascript Mongo db library
		bodyParser = require('body-parser'), 
		cookieParser = require('cookie-parser'),
		session = require('express-session'), //Sessions for user login
		passport = require('passport') //passport to handle actual login

//Schemas will go here

//routefiles will go here


//initialize the app and connect DB
var app = express();
var mongoURI = process.env.MONGOURI || "mongodb://localhost/test";
var PORT = process.env.PORT || 3000;
mongoose.connect(mongoURI);

//attach userful middleware
app.use(logger('dev'));
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// app.use(session({
//     secret: 'This is not a secret ;)',
//     resave: false,
//     saveUninitialized: true
// }));
// app.use(passport.initialize());
// app.use(passport.session());

app.get('/', function(req, res){
  var url = path.resolve( __dirname + '/views/index.html');
  res.sendFile(url);
})
//start the app
app.listen(PORT, function() {
  console.log("Application running on port:", PORT);
});