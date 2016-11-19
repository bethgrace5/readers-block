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

  function buildBookObjects(queryStr, booksRes) {
    var bs = booksRes.map(function(book) {
      // var b = {};
      // b['title'] = book_best_book[0].title;
      var b = {};
      b['title'] = book.best_book[0].title;
      b['author'] = book.best_book[0].author[0].name;
      b['thumbnail_image'] = book.best_book[0].small_image_url;
      b['full_image'] = book.best_book[0].image_url;
      return b;
    });
    console.log(bs);
    return bs;
  }
}





module.exports = new GoodReads();
/*
<work>
<id type="integer">1466917</id>
<books_count type="integer">257</books_count>
<ratings_count type="integer">1295593</ratings_count>
<text_reviews_count type="integer">44180</text_reviews_count>
<original_publication_year type="integer">1996</original_publication_year>
<original_publication_month type="integer">8</original_publication_month>
<original_publication_day type="integer">6</original_publication_day>
<average_rating>4.44</average_rating>
<best_book type="Book">
<id type="integer">13496</id>
<title>A Game of Thrones (A Song of Ice and Fire, #1)</title>
<author>
<id type="integer">346732</id>
<name>George R.R. Martin</name>
</author>
<image_url>https://images.gr-assets.com/books/1436732693m/13496.jpg</image_url>
<small_image_url>https://images.gr-assets.com/books/1436732693s/13496.jpg</small_image_url>
</best_book>
</work>

title
author.name
*/
