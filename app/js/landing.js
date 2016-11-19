'use strict';
angular.module('readers-block')
  .controller('LandingCtrl', function ($scope, loginFactory){
    
    if(loginFactory.registerObserverCallback == true)
        $('.user-block').show();

});