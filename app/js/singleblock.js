'use strict';
angular.module('readers-block')
  .controller('SingleBlockCtrl', function ($scope, $http, $timeout, loginFactory, blockFactory, $location){
    $scope.user = loginFactory.getUser();
    $scope.blockId = $location.search().block;
    $scope.singleBlock = $scope.user.blocks[$scope.blockId];

    $scope.empty = function() {
      return _.isEmpty($scope.singleBlock.books);
    }

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
      var newBook = {};
      newBook.title = book.title;
      newBook.author = book.author;
      newBook.thumbnail_image = book.thumbnail_image;
      blockFactory.addBook(newBook, $scope.blockId);
      updateBookList(newBook);
    };

    //TODO
    //Workaround for updating the View
    //Probably bad practice
    function updateBookList(newBook) {
      $scope.singleBlock.books.push(newBook);
    }

});
