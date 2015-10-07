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
var models = require('./models/models.js');
var User = models.User;
var Data = models.Data;

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

//Middleware
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// configure passport 
require('./config/passport')(passport);

// this sets up all of the routes
var routes = require('./routes/routes.js');
routes(app, passport);

//API routes that angular will use to get and post data 
app.get("/api/home", function(req, res) {
	res.send("Hello world");
});

app.get("/api/sawyerssecretroute", function(req, res) {
	res.send("Go back, this is a secret");
});

var PORT = process.env.PORT || 3000;

app.listen(process.env.PORT || PORT);
console.log('Listening on Port', PORT);