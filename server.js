var express = require('express');
var server = express();
var colors = require('colors');

var Router = express.Router();
var GoodReads = require('./api/goodreads');
var quotes = require('./quotes');


//Set port to env variable or default 3000
var port = process.env.PORT || 3000;
server.set('port', port);

//Use current working directory for static file lookup
server.use(express.static(__dirname));

//Accept GET requests for landing page
server.get('/', function(req, res) {
  res.sendFile(__dirname + "index.html");
});

//Handle /api/ requests by sending a simple hello message
Router.get('/', function(req, res) {
  res.json({ msg: "Readers Block API "});
});
//GET /api/findbook/bookname
Router.get('/findbook/:name', function(req, res) {
  var book_name = req.params.name;
  GoodReads.getBook(book_name, function(err, results) {
    if (err) {
      //$http will not consume response unless its a 200 it seems like
      //Send a results not found message instead of a 404 status code
      res.status(200).json({results: "Results Not Found" });
    }
    res.status(200).json({results});
  })
});

Router.get('/events/:zipcode', function(req, res) {
  var zipcode = req.params.zipcode;
  GoodReads.getEvents(zipcode, function(err, listOfEvents) {
    if (err) {
      res.status(404).json({ error: err });
    }
    res.status(200).json({ events: listOfEvents });
  });
});

Router.get('/*', function(req, res) {
  res.status(404).json({ msg: "Not Found"});
});

//Mount middleware for /api/ routing
server.use('/api', Router);

server.listen(port, function() {
  console.log("##########################".green);
  console.log("###### READERS BLOCK #####".blue);
  console.log("##########################".green);
  var idx = Math.floor(Math.random() * quotes.length);
  if (idx > quotes.length) {
    console.log("Server running on " + server.get('port') );
  } else {

    console.log(colors.bold(quotes[idx] + "" + server.get('port')) );
  }
});

//Expose the server object for testing
module.exports = server;
