'use strict';
angular.module('readers-block')
  .controller('SearchBookCtrl', function ($scope, $http, loginFactory, blockFactory){
    $scope.bookResults = [];

    $scope.findBook = function() {
      $scope.bookResults = [];
      var bookTitle = $scope.search.book_title;
      $http.get('/api/findbook/' + bookTitle).then(function(res) {
        if (res.status == 200) {
          if (res.data.results.books) {
            $scope.bookResults = res.data.results.books;
          } else {
            $scope.flashMessage = {
              type: "alert alert-danger",
              msg: "No Results Found"
            };
          }
        } else {
          console.log(res);
          //Do some error handling
          //Flash message?
        }
      });
    };

    $scope.addBookToBlock = function(book) {

    }

});
