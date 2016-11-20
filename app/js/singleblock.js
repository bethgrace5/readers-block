'use strict';
angular.module('readers-block')
  .controller('SingleBlockCtrl', function ($scope, $http, $timeout, loginFactory, blockFactory, $location){
    //look into main for watch/observables
    $scope.user = loginFactory.getUser();
    $scope.blockId = $location.search().block;
    $scope.singleBlock = $scope.user.blocks[$scope.blockId];
    console.log($scope.singleBlock);

});
