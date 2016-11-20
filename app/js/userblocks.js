'use strict';
angular.module('readers-block')
  .controller('UserBlocksCtrl', function ($scope, $http, loginFactory, blockFactory){
    $scope.newBlock = { title: "", description: "", tags: "" };
    $scope.editing = false;

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

    $scope.editBlock = function(blockId) {
      $scope.editing = true;
      $scope.newBlock = $scope.user.blocks[blockId];
    }

    $scope.createNewBlock = function() {
      if ($scope.editing == false) {
        $scope.user.blocks.unshift($scope.newBlock);
      }
      blockFactory.update(cleanBlockList());
      $scope.editing = false;
      $scope.newBlock = {};
    };

    $scope.deleteBlock = function(blockId) {
      $scope.user.blocks.splice(blockId, 1);
      blockFactory.update(cleanBlockList());
    };

});
