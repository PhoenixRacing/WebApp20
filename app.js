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

var PORT = process.env.PORT || 3000;
var mongoURI = process.env.MONGOURI || "mongodb://localhost/test";

mongoose.connect(mongoURI);

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

app.listen(PORT);
console.log('Listening on Port', PORT);