'use strict';

angular.module('readers-block')
  .factory('blockFactory', function ($q, $log, $http, $rootScope, $timeout) {
  var database = firebase.database();
  var auth = firebase.auth();
  var observerCallbacks = [];

  // call this to notify observers
  var notifyObservers = function(){
    angular.forEach(observerCallbacks, function(callback){
      callback();
    });
  };

  // Loads this user's cars
  //add block param
  var addBlock = function(newUserBlock) {
    var uid = auth.currentUser.uid;

    var blockRef = database.ref('users').child(uid).child('blocks').push();
    blockRef.set(newUserBlock).then(
      function(success) {
        notifyObservers();
      },
      function(error) {
      });

    /*
            database.ref('users').child(u.uid).child('blocks').push({
              'last_login': new Date()
            }).then(
              function() {
                deferred.resolve('successful');
              }.bind(this)).catch(function(error) {
                deferred.reject('error');
            });

    var carsRef = database.ref('cars/' + user.uid); // Reference to the /cars/ database path.
    carsRef.off(); // Make sure we remove all previous listeners.
    var setCar = function(data) {
      console.log(data.key);
      cars[data.key] = data.val();
      notifyObservers();
    }.bind(this);
    var removeCar = function(data) {
      delete cars[data.key];
      notifyObservers();
    }.bind(this);

    carsRef.on('child_added', setCar);
    carsRef.on('child_removed', removeCar);
    */
  };

  var service = {
    approveRequest: function(key, value) {
      database.ref('members/'+key).update({
        name: value.name,
      email: value.email,
      added: (new Date()),
      lastLogin: '',
      bio: value.name + ' hasn\'t written a bio yet.',
      phone: '',
      position: 'member'
      }).then(function() {
        database.ref('requests/'+key).remove();
      }.bind(this)).catch(function(error) {
        console.error('Error writing new message to Firebase Database', error);
      });
    },
    denyRequest: function(key, value) {
      database.ref('requests/'+key).remove();
    },
    add: function(newUserBlock) {
       addBlock(newUserBlock);
    },
    getEnv: function() {
      return env;
    },
    registerObserverCallback: function(callback){
      observerCallbacks.push(callback);
    }
  };

  return service
});
