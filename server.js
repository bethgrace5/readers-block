var express = require('express');
var server = express();
var Router = express.Router();
var GoodReads = require('./api/goodreads');

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

//GET /api/find_books/bookname
Router.get('/find_books/:name', function(req, res) {
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

//Mount middleware for /api/ routing
server.use('/api', Router);

server.listen(port, function() {
  console.log('The Spice Must Flow on port ' + server.get('port'));
});

//Expose the server object for testing
module.exports = server;
