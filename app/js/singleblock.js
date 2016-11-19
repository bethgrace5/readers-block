'use strict';
angular.module('readers-block')
  .controller('SingleBlockCtrl', function ($scope, $http, loginFactory, blockFactory, $location){
    $scope.blockId = $location.search().block;
    blockFactory.getSingleBlock($scope.blockId);

});
