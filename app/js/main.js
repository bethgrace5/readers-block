'use strict';
angular.module('readers-block')
  .controller('MainCtrl', function ($scope, $rootScope, $timeout, $location, loginFactory, blockFactory){
  $scope.activeTab = 'home';

  $scope.isActive = function(item) {
    if (item == $scope.activeTab) {
      return 'active';
    }
  }

  $scope.close = function(tab) {
    $scope.activeTab = tab;
    $('#navbar').collapse('hide');
  }

  $scope.user = loginFactory.getUser();
  $scope.env = loginFactory.getEnv();

  $scope.messageInput = '';
  $scope.msg = {};
  $scope.meetings = {};
  $scope.members = {};
  $scope.allCars = {};
  $scope.LOADING_IMAGE_URL = 'https://www.google.com/images/spin-32.gif';

  $scope.signIn = function(method) {
    loginFactory.signIn[method]();
  }
  $scope.signOut = function() {
    loginFactory.signOut();
  }

  $scope.addBlock = function() {
    blockFactory.add();
  }

  $scope.deleteCar = function(key, value) {
    $scope.database.ref('cars/'+$scope.user.uid+'/'+key).remove();
  }
  $scope.updateCar = function(key, value) {
    $scope.database.ref('cars/'+$scope.user.uid+'/'+key).update({
      car: value.car,
      type: value.type,
      onDate: (new Date())
    }).then(function() {
      // Clear message text field and SEND button state.
    }.bind(this)).catch(function(error) {
      console.error('Error writing new meeting to Firebase Database', error);
    });
  }


  $scope.deleteMeeting = function(key, value) {
    $scope.database.ref('meetings/'+key).remove();
  }
  $scope.updateMeeting = function(key, value) {
    $scope.database.ref('meetings/'+key).update({
      place: value.place,
      updated: (new Date())
    }).then(function() {
      // Clear message text field and SEND button state.
    }.bind(this)).catch(function(error) {
      console.error('Error writing new meeting to Firebase Database', error);
    });
  }

  $scope.addMeeting = function(e) {
    $scope.database.ref('meetings').push({
      place: 'thisplace',
      onDate: (new Date())
    }).then(function() {
      // Clear message text field and SEND button state.
    }.bind(this)).catch(function(error) {
      console.error('Error writing new meeting to Firebase Database', error);
    });
  }


  // Loads cars
  $scope.loadAllCars = function() {
    this.carsRef = $scope.database.ref('cars'); // Reference to the /messages/ database path.
    this.carsRef.off(); // Make sure we remove all previous listeners.
    // Loads the last 12 messages and listen for new ones.
    var setCars = function(data) {
      $scope.allCars[data.key] = data.val();
      $timeout(function() {
        $scope.$apply();
      },100);
    }.bind(this);
    var removeCars = function(data) {
      delete $scope.allCars[data.key];
      $timeout(function() {
        $scope.$apply();
      },100);
    }.bind(this);
    this.carsRef.on('child_added', setCars);
    this.carsRef.on('child_removed', removeCars);
  };

  // Loads members
  $scope.loadMembers = function() {
    this.membersRef = $scope.database.ref('members'); // Reference to the /messages/ database path.
    this.membersRef.off(); // Make sure we remove all previous listeners.
    // Loads the last 12 messages and listen for new ones.
    var setMember = function(data) {
      $scope.members[data.key] = data.val();
    }.bind(this);
    var removeMember = function(data) {
      delete $scope.members[data.key];
    }.bind(this);
    this.membersRef.on('child_added', setMember);
    this.membersRef.on('child_removed', removeMember);
  };

  // Loads chat messages history and listens for upcoming ones.
  $scope.loadMessages = function() {
    this.messagesRef = $scope.database.ref('messages'); // Reference to the /messages/ database path.
    this.messagesRef.off(); // Make sure we remove all previous listeners.
    // Loads the last 12 messages and listen for new ones.
    var setMessage = function(data) {
      var val = data.val();
      this.displayMessage(data.key, val.name, val.text, val.photoUrl, val.imageUrl);
    }.bind(this);
    this.messagesRef.limitToLast(12).on('child_added', setMessage);
    this.messagesRef.limitToLast(12).on('child_changed', setMessage);
  };

  // Loads cars
  $scope.loadCars = function() {
    this.carsRef = $scope.database.ref('cars/'+$scope.user.uid); // Reference to the /messages/ database path.
    this.carsRef.off(); // Make sure we remove all previous listeners.
    // Loads the last 12 messages and listen for new ones.
    var setCar = function(data) {
      $scope.cars[data.key] = data.val();
      $timeout(function() {
        $scope.$apply();
      },100);
    }.bind(this);
    var removeCar = function(data) {
      delete $scope.cars[data.key];
      $timeout(function() {
        $scope.$apply();
      },100);
    }.bind(this);
    this.carsRef.on('child_added', setCar);
    this.carsRef.on('child_removed', removeCar);
  };

  // Loads meetings
  $scope.loadMeetings = function() {
    this.meetingsRef = $scope.database.ref('meetings'); // Reference to the /messages/ database path.
    this.meetingsRef.off(); // Make sure we remove all previous listeners.
    // Loads the last 12 messages and listen for new ones.
    var setMeeting = function(data) {
      $scope.meetings[data.key] = data.val();
      $timeout(function() {
        $scope.$apply();
      },100);
    }.bind(this);
    var removeMeeting = function(data) {
      delete $scope.meetings[data.key];
      $timeout(function() {
        $scope.$apply();
      },100);
    }.bind(this);
    this.meetingsRef.on('child_added', setMeeting);
    this.meetingsRef.on('child_removed', removeMeeting);
  };

  // Saves a new message on the Firebase DB.
  $scope.saveMessage = function(e) {
    e.preventDefault();
    // Check that the user entered a message and is signed in.
    if ($scope.messageInput && loginFactory.checkSignedIn()) {
      var currentUser = $scope.auth.currentUser;
      // Add a new message entry to the Firebase Database.
      this.messagesRef.push({
        name: currentUser.displayName,
        text: $scope.messageInput,
        photoUrl: currentUser.photoURL || '/images/profile_placeholder.png'
      }).then(function() {
        // Clear message text field and SEND button state.
        $scope.messageInput = '';
      }.bind(this)).catch(function(error) {
        console.error('Error writing new message to Firebase Database', error);
      });
    }
  };

  // Saves a new message containing an image URI in Firebase.
  // This first saves the image in Firebase storage.
  $scope.saveImageMessage = function(file) {
    // Check if the file is an image.
    if (!file.type.match('image.*')) {
      var data = { message: 'You can only share images' };
      alert(data.message);
      return;
    }
    // Check if the user is signed-in
    if (loginFactory.checkSignedIn()) {
      // We add a message with a loading icon that will get updated with the shared image.
      var currentUser = $scope.auth.currentUser;
      this.messagesRef.push({
        name: currentUser.displayName,
        imageUrl: $scope.LOADING_IMAGE_URL,
        photoUrl: currentUser.photoURL || '/images/profile_placeholder.png'
      }).then(function(data) {
        // Upload the image to Firebase Storage.
        var uploadTask = $scope.storage.ref(currentUser.uid + '/' + Date.now() + '/' + file.name)
            .put(file, {'contentType': file.type});
        // Listen for upload completion.
        uploadTask.on('state_changed', null, function(error) {
          console.error('There was an error uploading a file to Firebase Storage:', error);
        }, function() {
          // Get the file's Storage URI and update the chat message placeholder.
          var filePath = uploadTask.snapshot.metadata.fullPath;
          data.update({imageUrl: $scope.storage.ref(filePath).toString()});
        }.bind(this));
      }.bind(this));
    }
  };

  // Displays a Message in the UI.
  $scope.displayMessage = function(key, name, text, picUrl, imageUri) {
    $scope.msg[key] = {'name':name, 'text':text, 'picUrl':picUrl, 'imageUri':imageUri};
    $timeout(function() {
      $scope.$apply();
    });
  };

  // Checks that the Firebase SDK has been correctly setup and configured.
  $scope.checkSetup = function() {
    if (!window.firebase || !(firebase.app instanceof Function) || !window.config) {
      window.alert('You have not configured and imported the Firebase SDK. ' +
          'Make sure you go through the codelab setup instructions.');
    } else if (config.storageBucket === '') {
      window.alert('Your Firebase Storage bucket has not been enabled. Sorry about that. This is ' +
          'actually a Firebase bug that occurs rarely. ' +
          'Please go and re-generate the Firebase initialisation snippet (step 4 of the codelab) ' +
          'and make sure the storageBucket attribute is not empty. ' +
          'You may also need to visit the Storage tab and paste the name of your bucket which is ' +
          'displayed there.');
    }
  };

  $scope.database = firebase.database();
  $scope.storage = firebase.storage();
  $scope.checkSetup();

  $scope.approveRequest = function(key, value) {
    loginFactory.approveRequest(key, value);
  }
  $scope.denyRequest = function(key, value) {
    loginFactory.denyRequest(key, value);
  }

  blockFactory.registerObserverCallback(
    function() {
      $timeout(function() {
        $scope.user = loginFactory.getUser();
        $scope.env = loginFactory.getEnv();
        $scope.$apply();
      });
    }
  );
  loginFactory.registerObserverCallback(
      function() {
        $timeout(function() {
          $scope.user = loginFactory.getUser();
          $scope.env = loginFactory.getEnv();
          $scope.$apply();
        });
      }
    );

  $scope.emailSubscription = function() {
    if($scope.user.subscribed) {
      emailUnsubscribe();
      return;
    }

    Patchwork.callPlatformMethod({
        platformId: MAILCHIMP_PLATFORM_ID,
        method: "subscribers",
        action: "POST",
        params: {email_address: $scope.user.email}
    }).then(function(responseJSON) {
      return new Promise(function(resolve, reject) {
        alert("Subscribed Successfully. Please check your email for confirmation.");
        console.log('calling add-subscriber for ' + $scope.user.email);
        loginFactory.subscribe(true);
        $scope.user.subscribed = true;
        $scope.$apply();
        resolve();
      });
    });
  }

  function emailUnsubscribe() {
    Patchwork.callPlatformMethod({
        platformId: MAILCHIMP_PLATFORM_ID,
        method: "subscribers",
        action: "DELETE",
        params: {email_address: $scope.user.email}
    }).then(function(responseJSON) {
      return new Promise(function(resolve, reject) {
        alert("Unsubscribed Successfully. Please check your email for confirmation.");
        console.log('calling delete-subscriber for ' + $scope.user.email);
        loginFactory.subscribe(false);
        $scope.user.subscribed = false;
        $scope.$apply();
        resolve();
      });
    });
  }

});
