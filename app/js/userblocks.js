'use strict';
angular.module('readers-block')
  .controller('UserBlocksCtrl', function ($scope, $http, loginFactory){
    $scope.userBlocks = [];
    $scope.newBlock = {
      title: "",
      description: "",
      tags: ""
    };

    $scope.createNewBlock = function() {
      $scope.userBlocks.push($scope.newBlock);
      $scope.newBlock = {};
    }

});
