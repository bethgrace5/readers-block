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
    templateUrl: 'app/views/landing.html',
    controller: 'MainCtrl',
    controllerAs: 'main'
  }).when('/account', {
    templateUrl: 'app/views/account.html',
    controller: 'AccountCtrl',
    controllerAs: 'account'
  }).when('/searchbook', {
    templateUrl: 'app/views/createblock.html',
    controller: 'SearchBookCtrl',
    controllerAs: 'searchbook'
  }).when('/landing', {
    templateUrl: 'app/views/landing.html',
    controller: 'LandingCtrl',
    controllerAs: 'landing'
  }).when('/myblocks', {
    templateUrl: 'app/views/userblocks.html',
    controller: 'UserBlocksCtrl',
    controllerAs: 'userblocks'
  }).when('/myblocks/block', {
    templateUrl: 'app/views/singleblock.html',
    controller: 'SingleBlockCtrl',
    controllerAs: 'singleblock'
  })
  .otherwise({
    redirectTo: '/'
  });

  /* Logging */
  $logProvider.debugEnabled(true);

  /* Increase application performance when false, default is true */
  $compileProvider.debugInfoEnabled(true);

})
