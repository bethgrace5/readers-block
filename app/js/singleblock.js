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

    // remove invalid angular key ($$hashKey) that won't set in firebase
    function cleanBlockList() {
      var blocks = _.map($scope.user.blocks, function(item, index) {
        item.books = _.map(item.books, function(book, i) {
          return _.omit(book, '$$hashKey');
        });
        return _.omit(item, '$$hashKey');
      });
      return blocks;
    };

    $scope.deleteBook = function(id) {
      console.log($scope.user.blocks[$scope.blockId].books[id]);
      $scope.user.blocks[$scope.blockId].books.splice(id, 1);
      blockFactory.update(cleanBlockList());
    }

    $scope.addBookToBlock = function(book) {
      var newBook = {};
      newBook.title = book.title;
      newBook.author = book.author;
      newBook.thumbnail_image = book.thumbnail_image;
      newBook.rating: {
       community_rating: 2.5,
       user_rating: 3 
      },
      updateBookList(newBook);
    };

    //TODO
    //Workaround for updating the View
    //Probably bad practice
    function updateBookList(newBook) {
      $scope.user.blocks[$scope.blockId].books.unshift(newBook);
      blockFactory.update(cleanBlockList());
    }

});
