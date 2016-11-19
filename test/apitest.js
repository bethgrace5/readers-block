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
      .get('/api/find_books/' + bookName)
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
      .get('/api/find_books/' + bookName)
      .end(function(err, res) {
        expect(res).to.have.status(500);
        expect(err).to.not.be.null;
        expect(res.body).to.be.a('object');
        expect(res.body).to.have.keys('error');
        done();
      });
  });
})
