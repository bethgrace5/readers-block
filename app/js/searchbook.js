'use strict';
angular.module('readers-block')
  .controller('SearchBookCtrl', function ($scope, $http, loginFactory, blockFactory){
    $scope.bookResults = [];

    $scope.findBook = function() {
      var bookTitle = $scope.search.book_title;
      $http.get('/api/findbook/' + bookTitle).then(function(res) {
        if (res.status == 200) {
          $scope.bookResults = res.data.results.books;
        } else if (res.status == 500) {
          //TODO
          //Make more elegant
          $scope.bookResults = {title: "Error No Results Found"};
        }
      });
    };

    $scope.addBookToBlock = function(book) {
      
    }

});
