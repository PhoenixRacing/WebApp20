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
var favicon = require('serve-favicon');

// custom modules
var dbConfig = require('./database/db.js');
var auth;
if (!process.env.HEROKU_ENV) {
  auth = require('./auth.js');
}
var User = require('./models/userModel.js').User;
var Data = require('./models/dataModel.js').Data;

// setup things
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || dbConfig.url);

// Initialize express app
var app = express();

var PORT = process.env.PORT || 3000;
//Passport setup
app.use(session({
	secret: process.env.SECRET_KEY || auth.secret,
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

app.use(favicon(path.join(__dirname, 'public/images/favicon.ico')));

// this sets up all of the routes
var routes = require('./routes/routes.js');
var authRoutes = require('./routes/auth.js');
var donor = require('./routes/donor.js');
var team = require('./routes/team.js');
var purchase = require('./routes/purchases.js');
var upload = require('./routes/upload.js');
var gallery = require('./routes/gallery.js');
var profile = require('./routes/profile.js');

app.use("/", routes);
app.use("/auth", authRoutes);
app.use("/donor", donor);
app.use("/team", team);
app.use("/purchase", purchase);
app.use("/upload", upload);
app.use('/gallery', gallery);
app.use('/profile', profile);

app.get("/test", function(req, res) {
  var url = path.resolve( __dirname + '/test.html');
  res.sendFile(url);
});

app.get("/test/JSON", function(req, res) {
  console.log("Sending file");
  var url = path.resolve(__dirname + '/cad.json');
  res.sendFile(url);
});

app.get("*", function(req, res) {
  var url = path.resolve(__dirname + '/public/index.html');
  res.sendFile(url);
});

app.listen(PORT);
console.log('Listening on Port', PORT);
