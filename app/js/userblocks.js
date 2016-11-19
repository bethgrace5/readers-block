'use strict';
angular.module('readers-block')
  .controller('UserBlocksCtrl', function ($scope, $http, loginFactory){
    $scope.newBlock = {
      title: "",
      description: "",
      tags: ""
    };
});
