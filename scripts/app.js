'use strict';

angular.module('readers-block', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize'
  ])
.config(function ($routeProvider, $logProvider, $compileProvider) {

  /* Routes */
  $routeProvider.when('/', {
    templateUrl: 'views/landing.html',
    controller: 'MainCtrl',
    controllerAs: 'main'
  }).when('/account', {
    templateUrl: 'views/account.html',
    controller: 'AccountCtrl',
    controllerAs: 'account'
  }).otherwise({
    redirectTo: '/'
  });

  /* Logging */
  $logProvider.debugEnabled(true);

  /* Increase application performance when false, default is true */
  $compileProvider.debugInfoEnabled(true);

})
