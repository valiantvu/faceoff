angular.module('faceoff.cameranew', [
	'ionic',
	'services'
	])

.controller('CameraNewController', function($scope, $state, Camera, $timeout) {

	// make countdown timer that visually updates on page, before launching camera

	$scope.shoot = function() {
		// check for device type and launch webcam or phone cam here
		console.log("LAUNCH CAMERA");
		// temporary
		$state.go('friendselect');

    Camera.getPicture().then(function(imageURI) {
      console.log("Image URI ", imageURI);
      // $scope.photos.push({uri: imageURI, createdAt: 11});
    }, function(err) {
      console.err(err);
    });

	};

	$timeout($scope.shoot, 3000);

});