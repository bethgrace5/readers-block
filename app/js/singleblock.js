'use strict';
angular.module('readers-block')
  .controller('SingleBlockCtrl', function ($scope, $http, $timeout, loginFactory, blockFactory, $location){
    // blockFactory.registerObserverCallback(
    //   function() {
    //     $timeout(function() {
    //       console.log('----Updating Stuff----')
    //       $scope.user = loginFactory.getUser();
    //       $scope.env = loginFactory.getEnv();
    //       $scope.$apply();
    //     });
    //   }
    // );
    //look into main for watch/observables
    $scope.user = loginFactory.getUser();
    $scope.blockId = $location.search().block;
    $scope.singleBlock = $scope.user.blocks[$scope.blockId];

    $scope.findBook = function() {
      $scope.bookResults = [];
      var bookTitle = $scope.search.book_title;
      $http.get('/api/find_books/' + bookTitle).then(function(res) {
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
      var newBook = {};
      newBook.title = book.title;
      newBook.author = book.author;
      newBook.thumbnail_image = book.thumbnail_image;
      console.log('Sending book to factory');
      blockFactory.addBook(newBook, $scope.blockId);
    }

});
