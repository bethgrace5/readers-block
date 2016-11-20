'use strict';
angular.module('readers-block')
  .controller('UserBlocksCtrl', function ($scope, $http, loginFactory, blockFactory){
    $scope.newBlock = {
      title: "",
      description: "",
      tags: ""
    };

    $scope.createNewBlock = function() {
      blockFactory.add($scope.newBlock);
      $scope.newBlock = {};
    };

    $scope.deleteBlock = function(blockId) {
      $scope.user.blocks.splice(blockId, 1);
      blockFactory.update($scope.user.blocks);
    };
});
