//Require npm modules 
var express = require("express");
var path = require("path");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");


//route files will go here
// var dataCollection = require('./routes/data.js')

// Initialize express app
var app = express();

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