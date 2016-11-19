var express = require('express');
var server = express();
var Router = express.Router();
var GoodReads = require('./api/goodreads');

var port = process.env.PORT || 3000;
server.set('port', port);

server.use(express.static(__dirname));

server.get('/', function(req, res) {
  res.sendFile(__dirname + "index.html");
});


Router.get('/', function(req, res) {
  res.json({ msg: "Readers Block API "});
});

Router.get('/find_books/:name', function(req, res) {
  var book_name = req.params.name;
  GoodReads.getBook(book_name, function(err, results) {
    if (err) {
      res.json({ error: err});
    }
    res.json({ res: results});
  })
});

server.use('/api', Router);


server.listen(port, function() {
  console.log('Server running on ' + server.get('port'));
});



module.exports = server;
