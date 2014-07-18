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
      API.searchForThread($scope.user.id, $scope.friends.id).success(function(foundThread) {
        if (foundThread) {
          console.log('find',foundThread);
          Camera.getRandomPicture().then(function(image) {
            console.log('-------', foundThread._id);
            console.log('-------', $scope.user.id);
            console.log('-------', image);
            API.newPhoto(foundThread._id, $scope.user.id, image)
              .success(function(data) {
                console.log(data);
                $state.go('menu.status');
              })
              .error(function(error) {
                console.log(error);
              });
          });

        }
        else {
          API.newThread([$scope.user.phone, $scope.friends.phone])
            .success(function(newThread) {
              console.log(newThread);
              var threadId = newThread.data._id;
              var ownerId = newThread.data.participants[0];
              console.log(threadId)
              console.log(ownerId)
              // Remove this line when we have real photos to send.
              Camera.getRandomPicture().then(function(image) {
                API.newPhoto(threadId, ownerId, image)
                  .success(function(data) {
                    console.log(data);
                    $state.go('menu.status');
                  })
                  .error(function(error) {
                    console.log(error);
                  });
              })
            })
            .error(function(error) {
              console.log('error');
              console.log(error);
            })
        }
      })
      
    }
    else {
      API.newThread([$scope.user.phone, $scope.friends.phone])
        .success(function(newThread) {
          console.log(newThread);
          var threadId = newThread.data._id;
          var ownerId = newThread.data.participants[0];
          console.log(threadId)
          console.log(ownerId)
          // Remove this line when we have real photos to send.
          Camera.getRandomPicture().then(function(image) {
            API.newPhoto(threadId, ownerId, image)
              .success(function(data) {
                console.log(data);
                $state.go('menu.status');
              })
              .error(function(error) {
                console.log(error);
              });
          })
        })
        .error(function(error) {
          console.log('error');
          console.log(error);
        })
    }
  };

  var init = function() {
    // Search database for the friend using their phone number.
    API.searchForUser({phone: $scope.friends.phone}).success(function(foundFriend) {
      // If friend is found use their info for the scope.
      if (foundFriend) {
        console.log('FoundFriend', foundFriend);
        registeredFriend = true;
        $scope.friends = foundFriend;
      }
    })
  }
  init();

});