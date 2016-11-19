'use strict';

angular.module('readers-block')
  .factory('loginFactory', function ($q, $log, $http, $rootScope, $timeout) {
  var database = firebase.database();
  var auth = firebase.auth();
  var user = {'uid':'', 'name':'', 'email':'', 'img':'', 'active':false}
  var env = {'loggedIn':false};
  var cars = {};
  var observerCallbacks = [];

  // call this to notify observers
  var notifyObservers = function(){
    angular.forEach(observerCallbacks, function(callback){
      callback();
    });
  };

  // Loads this user's cars
  var loadCars = function() {
    console.log('load cars');
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
  };

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
              'alias': u.email
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
    },
    checkSignedIn: function() {
      if (auth.currentUser) {
        return true;
      }
      return false;
    },
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
    getUser: function() {
      return user;
    },
    getEnv: function() {
      return env;
    },
    getCars: function() {
      return cars;
    },
    updateProfile: function(usr) {
      database.ref('members/'+usr.uid).update(usr)
        .then(function() {
      }.bind(this)).catch(function(error) {
        console.error('Error writing new meeting to Firebase Database', error);
      });
    },
    registerObserverCallback: function(callback){
      observerCallbacks.push(callback);
    }
  };

  return service
});

