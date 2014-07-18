angular.module('faceoff.confirmthread', [
	'ionic',
	'services'
	])

.config(function($compileProvider){
  $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
})

.controller('ConfirmController', function($scope, friends, $state, Camera, API) {

  $scope.friends = friends;
  $scope.user = JSON.parse(window.localStorage.getItem('deviceUser'));
  var registeredFriend = false;

  $scope.confirmSend = function(friend) {
    if (registeredFriend) {
      API.searchForThread($scope.user.id, $scope.friends._id).success(function(foundThread) {
        if (foundThread) {
          // console.log('find',foundThread);
          createNewPhoto(foundThread._id, $scope.user.id, foundThread.creator);
        }
        else {
          createNewThread();
        }
      })  
    }
    else {
      createNewThread();
    }
  };

  var createNewThread = function() {
    API.newThread([$scope.user.phone, $scope.friends.phone])
      .success(function(newThread) {
        console.log(newThread);
        var threadId = newThread.data._id;
        var ownerId = newThread.data.participants[0];
        createNewPhoto(threadId, ownerId);
      })
      .error(function(error) {
        console.log(error);
      })
  }

  var createNewPhoto = function(threadId, userId, creator) {
    // Remove this line when we have real photos to send.
    Camera.getRandomPicture().then(function(image) {
      API.newPhoto(threadId, userId, image)
        .success(function(data) {
          if (creator) {
            if (userId === creator) {
              console.log("WHHAAT")
              API.recipientRead(threadId, false);
            }
            else {
              console.log("HUGHHH")
              API.creatorRead(threadId, false);
            }
          }
          $state.go('menu.status');
        })
        .error(function(error) {
          console.log(error);
        });
    });
  }

  var init = function() {
    // Search database for the friend using their phone number.
    API.searchForUser({phone: $scope.friends.phone}).success(function(foundFriend) {
      // If friend is found use their info for the scope.
      if (foundFriend) {
        // console.log('FoundFriend', foundFriend);
        registeredFriend = true;
        $scope.friends = foundFriend;
      }
    })
  }
  init();

});