'use strict';

angular.module('readers-block')
  .factory('blockFactory', function ($q, $log, $http, $rootScope, $timeout) {
  var database = firebase.database();
  var auth = firebase.auth();
  var observerCallbacks = [];

  var querySingleBlock = function(blockId) {
    var uid = auth.currentUser.uid;
    console.log(blockId);
    return "Hello World";
  };
  
  // call this to notify observers
  var notifyObservers = function(){
    angular.forEach(observerCallbacks, function(callback){
      callback();
    });
  };

  //add block param
  var addBlock = function(newUserBlock) {
    var uid = auth.currentUser.uid;

    var blockRef = database.ref('users/'+uid+'/blocks').set(newUserBlock);
    blockRef.set(newUserBlock).then(
      function(success) {
        notifyObservers();
      },
      function(error) {
      });
  };

  //add block param
  var updateBlock = function(newUserBlock) {
    var uid = auth.currentUser.uid;

    database.ref('users/'+uid+"/blocks/").set(newUserBlock).then(
        function(success) {
        },
        function(error) {
        });

  };

  var deleteBlock = function(blockId) {
    var uid = auth.currentUser.uid;
    database.ref('users/'+uid+"/blocks/"+blockId).remove();
  };



  var addBookToBlock = function(newBook, blockId) {
    var uid = auth.currentUser.uid;

    var bookRef = database.ref('users').child(uid)
                          .child('blocks').child(blockId)
                          .child('books').push();
    console.log('Pushing onto books list');
    bookRef.set(newBook).then(
      function(success) {
        console.log('Success!');
        notifyObservers();
      },
      function(error) {
        console.log('ERROR');
      });

    // bookRef.on('child_added', notifyObservers());
  };
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
    update: function(newUserBlock) {
        console.log(newUserBlock);
       updateBlock(newUserBlock);
    },
    addBook: function(newBook, blockId) {
      console.log('Adding Book');
      addBookToBlock(newBook, blockId);
    },
    delete: function(blockId) {
      deleteBlock(blockId);
    },
    getEnv: function() {
      return env;
    },
    getSingleBlock: function(blockId) {
      return querySingleBlock(blockId);
    },
    registerObserverCallback: function(callback){
      observerCallbacks.push(callback);
    }
  };

  return service
});
