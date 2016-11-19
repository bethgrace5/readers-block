'use strict';
angular.module('readers-block')
  .controller('BlockCtrl', function ($scope, $http, loginFactory){
    $scope.bookResults = [];

    $scope.findBook = function() {
      var bookTitle = $scope.search.book_title;
      $http.get('/api/find_books/' + bookTitle).then(function(res) {
        if (res.status == 200) {
          $scope.bookResults = res.data.results.books;
        }
      });
    };


});
