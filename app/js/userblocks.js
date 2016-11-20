'use strict';
angular.module('readers-block')
  .controller('UserBlocksCtrl', function ($scope, $http, loginFactory, blockFactory){
    $scope.newBlock = {
      title: "",
      description: "",
      tags: ""
    };

    $scope.createNewBlock = function() {
      // blockFactory.add($scope.newBlock);
      updateBlockList($scope.newBlock);
      $scope.newBlock = {};
    };

    $scope.deleteBlock = function(blockId) {
      blockFactory.delete(blockId);
    };

    //TODO
    //Workaround for updating the View
    //Probably bad practice
    function updateBlockList(newBook) {
      $scope.user.blocks['workaround'] = newBook;
    }
});
