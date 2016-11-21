'use strict';

angular.module('readers-block')
  .factory('loginFactory', function ($q, $log, $http, $rootScope, $timeout, blockFactory) {
  var database = firebase.database();
  var auth = firebase.auth();
  var user = {'uid':'', 'name':'', 'email':'', 'img':'', 'active':false}
  var env = {'loggedIn':false};
  var observerCallbacks = [];

  // call this to notify observers
  var notifyObservers = function(){
    angular.forEach(observerCallbacks, function(callback){
      callback();
    });
  };

  // updates that user is subscribed
  var subscribe = function(s) {
    var id = auth.currentUser.uid;
    var deferred = $q.defer();
    database.ref('users').child(id).once('value',
      function(snapshot) {
        // get the user data
        // this user exists, update login date
        database.ref('users').child(id).update({
          'subscribed': s
        }).then(function() {
          deferred.resolve('successful');
        }.bind(this)).catch(function(error) {
          deferred.reject('error');
        });
      });
    return deferred.promise;
  }

  // updates login date for existing users (also adds info for new users)
  var updateLoginDate = function(u) {
    var deferred = $q.defer();
    database.ref('users').child(u.uid).once('value',
        function(snapshot) {
          // get the user data
          user = snapshot.val();
          // this user exists, update login date
          if (snapshot.exists()) {
            database.ref('users').child(u.uid).update({
              'last_login': new Date()
            }).then(
              function() {
                deferred.resolve('successful');
              }.bind(this)).catch(function(error) {
                deferred.reject('error');
            });
          }
          // this user is new, add all their info with default email alias
          else {
            database.ref('users').child(u.uid).update({
              'last_login': new Date(),
              'img': u.photoURL,
              'email': u.email,
              'name': u.displayName,
              'alias': u.email,
              'subscribed': false,
              'blocks' : [{
                'books' : []
                'description' : "zzzzzz",
                'tags' : "zzzzzzzz",
                'title' : "zzzzzzz",
                'ratings' : {
                  'community_rating': 0,
                  'user_rating': 0
                }
              }]
              }).then(
                function() {
                deferred.resolve('successful');
              }.bind(this)).catch(function(error) {
                deferred.reject('error');
            });
          }
        })
    return deferred.promise;
  }

  // Triggers when the auth state change for instance when the member signs-in or signs-out.
  var onAuthStateChanged = function(currentUser) {
    if (currentUser) {
      updateLoginDate(currentUser).then(
        // The user exists and is verified
        function(success) {
          database.ref('users').child(currentUser.uid).once('value',
            function(data) {
              env.loggedIn = true;
              notifyObservers();
            }).then(
            function() {
              // none
            }.bind(this)).catch(
              function(error) {
                console.error('user is not a member', error);
              });
        // The user is not verified
        },
        function(error) {
          user.uid = currentUser.uid;
          user.name = currentUser.displayName;
          user.email = currentUser.email;
          user.img = currentUser.photoURL;
          env.loggedIn = true;
        });
    }
    else { // User is signed out!
      user = {'uid':'', 'name':'', 'email':'', 'img':'', 'active':false}
      notifyObservers();
    }
  };
  auth.onAuthStateChanged(onAuthStateChanged.bind(this));

  var service = {
    signIn: {
      'google': function() {
        var provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider);
      },
      'username': function() {
      }
    },
    signOut: function() {
      auth.signOut();
      env.loggedIn = false;
      notifyObservers();
    },
    updateBookList: function() {
      console.log('Updating book list');
      updateLoginDate(user);
    },
    checkSignedIn: function() {
      if (auth.currentUser) {
        return true;
      }
      return false;
    },
    getUser: function() {
      return user;
    },
    subscribe: function(s) {
      subscribe(s);
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
