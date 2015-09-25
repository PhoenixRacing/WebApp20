//Require npm modules 
var express = require("express");
var path = require("path");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require('passport');
var session = require('express-session');

// custom modules
var dbConfig = require('./database/db.js');

// setup things
mongoose.connect(dbConfig.url);

//route files will go here
// var dataCollection = require('./routes/data.js')

// Initialize express app
var app = express();

//Passport setup
app.use(session({
	secret: 'NotASecret;)',
	name: 'TrojanHorse',
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user._id);
});
 
passport.deserializeUser(function(id, done) {
  User.findOne({ '_id' : id }, function(err, user) {
    done(err, user);
  });
});

//Middleware
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));


//API routes that angular will use to get and post data 
app.get("/api/home", function(req, res) {
	res.send("Hello world");
});

var PORT = 3000;

app.listen(process.env.PORT || PORT);
console.log('Listening on Port', PORT);