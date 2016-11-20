var expect = require('chai').expect;
var chai = require('chai');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);

var app = require('../server');


describe('Readers Block API', function() {
  it('should responde with a 200 Status code at landing request', function(done) {
    chai.request(app)
      .get('/')
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        done();
      });
  });
  it('should allow you to search for a book', function(done) {
    var bookName = "Game of Thrones";
    chai.request(app)
      .get('/api/findbook/' + bookName)
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res).to.be.a('object');
        expect(res.body).to.not.be.null;
        expect(res.body).to.be.a('object');
        expect(res.body).to.have.keys('results');
        expect(res.body.results).to.have.all.keys('books', 'query');
        done();
      });
  });
  it('should respond with an error with invalid results', function(done) {
    var bookName = "asdi8912en;awd[]";
    chai.request(app)
      .get('/api/findbook/' + bookName)
      .end(function(err, res) {
        expect(res).to.have.status(200);
        expect(err).to.be.null;
        expect(res.body).to.be.a('object');
        expect(res.body.results).to.equal("Results Not Found");
        done();
      });
  });

  it('should respond with events in the area', function(done) {
    chai.request(app)
      .get('/api/events/93313')
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.have.not.be.null;
        expect(res.body).to.have.keys('events');
        console.log(res.body);
        done();
      });
  });
});
