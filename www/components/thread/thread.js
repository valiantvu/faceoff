angular.module('faceoff.thread', [
	'ionic'
	])

.controller('ThreadController', function($scope, $state, $stateParams, API, $ionicModal) {
  var init = function() {
    // Get all the thread data needed to generate view.
    API.getThreadData($stateParams.threadId)
      .success(function(data) {
        $scope.participants = data.participants;
        $scope.photos = data.photos;
      })
      .error(function(error) {
        console.log(error);
      });
  }
  init();

  $scope.replyPhoto = function(recipient) {
    $state.go('newthreadgetready');
  };

  $scope.layoutDone = function() {
    var photos = document.querySelectorAll('#loaded-image');
    for (var i = 0; i < photos.length; i++) {
      photos[i].addEventListener('load', function(e) {
        var image = e.target;
        var src = image.getAttribute('src');
        var imgCanvas = document.createElement("canvas"),
        imgContext = imgCanvas.getContext("2d");

        // Make sure canvas is as big as the picture
        imgCanvas.width = image.width;
        imgCanvas.height = image.height;
     
        // Draw image into canvas element
        imgContext.drawImage(image, 0, 0, image.width, image.height);
     
        // Get canvas contents as a data URL
        var imgAsDataURL = imgCanvas.toDataURL("image/jpeg");
     
        // Save image into localStorage
        try {
            localStorage.setItem(src, imgAsDataURL);
        }
        catch (e) {
            console.log("Storage failed: " + e);
        }
      }, false);
    }
  };

  $ionicModal.fromTemplateUrl('my-modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });
    $scope.openModal = function(url) {
      $scope.modal.url = url;
      $scope.modal.show();
    };
    $scope.closeModal = function() {
      $scope.modal.hide();
    };
    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
      $scope.modal.remove();
    });
})

.directive('repeatDone', function() {
  return function(scope, element, attrs) {
    if (scope.$last) { // all are rendered
      scope.$eval(attrs.repeatDone);
    }
  }
});
