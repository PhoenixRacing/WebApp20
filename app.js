//Require npm modules 
var express = require("express");
var path = require("path");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require('passport');
var session = require('express-session');
var flash = require('connect-flash');

// custom modules
var dbConfig = require('./database/db.js');
var auth = require('./auth.js');
var models = require('./models/models.js');
var User = models.User;
var Data = models.Data;

// setup things
mongoose.connect(dbConfig.url);

//route files will go here
// var dataCollection = require('./routes/data.js')

// Initialize express app
var app = express();

var PORT = process.env.PORT || 3000;
//Passport setup
app.use(session({
	secret: auth.secret,
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
app.use(flash());

// configure passport 
require('./config/passport')(passport);

// this sets up all of the routes
var routes = require('./routes/routes.js');
var admin = require('./routes/admin.js');
app.use("/", routes);
app.use("/admin", admin);

//API routes that angular will use to get and post data 
app.get("/api/home", function(req, res) {
	res.send("Hello world");
});

app.get("/test", function(req, res) {
  var url = path.resolve( __dirname + '/test.html');
  res.sendFile(url);
});

app.get("/test/JSON", function(req, res) {
  var url = path.resolve(__dirname + '/cad.json');
  res.sendFile(url);
})

app.get('/api/completedPurchases', function(req, res) {
	
});

app.post('/api/addPurchase', function(req, res) {

});

app.get("/api/sawyerssecretroute", function(req, res) {
	res.send("Go back, this is a secret");
});

app.listen(PORT);
console.log('Listening on Port', PORT);