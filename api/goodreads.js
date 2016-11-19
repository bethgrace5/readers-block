"use strict";
var request = require('request');
var parseString = require('xml2js').parseString;
var util = require('util');

var GOODREADS_API_KEY = "E3QFYNfsVhaQ8WUTE9DOxA";

//only used for write access to Goodreads
var GOODREADS_SECRET_KEY = "6pdfhf6T2OIs7deZEHetGHeuedmB0kBIVnRo8Eo3fM";

function GoodReads() {
  var self = this;
  self.searchurl = "https://www.goodreads.com/search.xml?key="+GOODREADS_API_KEY+"&q=";
  self.getBook = function(title, cb) {
    var url = self.searchurl + splitTitle(title);
    sendGetRequest(url).then(function(xmlResponse) {
      parseResponse(xmlResponse).then(function(booksToReturn) {
        return cb(null, booksToReturn);
      }, function(xmlErr) {
        return cb(xmlErr, null);
      })
    }, function(getErr) {
      return cb(getErr, null);
    })
  };

  /**
  * @name splitTitle
  * @param String - a space seperate string
  * @returns a URl-encoded string ready to send to GoodReads API
  */
  function splitTitle(title) {
    return title.split(" ").join("+")
  }

  /**
  * @name sendGetRequest
  * @param url - A url to send GET request to
  * @returns Promise
  */
  function sendGetRequest(url) {
    console.log(url);
    return new Promise(function(resolve, reject) {
      request.get(url, function(err, status, body) {
        if (err) {
          reject(err);
        }
        resolve(body);
      });
    });
  }

  /**
  * @name parseResponse
  * @param XML
  * @returns Promise
  * @overview parse XML return it as a JSON
  */
  function parseResponse(xmlResponse) {
    return new Promise(function(resolve, reject) {
      parseString(xmlResponse, function(err, result) {
        if (err) {
          console.log(err);
          reject(err);
        }
        var queryStr = result.GoodreadsResponse.search[0].query[0]
        var bookResults = buildBookObjects(queryStr, result.GoodreadsResponse.search[0].results[0].work)
        resolve(bookResults);
      });
    });
  }

  /**
  * @name buildBookObjects
  * @param
  */
  function buildBookObjects(queryStr, booksRes) {
    var objToReturn = {};
    objToReturn.books = booksRes.map(function(book) {
      var b = {};
      b.title = book.best_book[0].title.join();
      b.author = book.best_book[0].author[0].name.join();
      b.thumbnail_image = book.best_book[0].small_image_url.join();
      b.full_image = book.best_book[0].image_url.join();
      return b;
    });
    objToReturn.query = queryStr;
    return objToReturn;
  }
}


module.exports = new GoodReads();
