angular.module('faceoff.thread', [
	'ionic'
	])

.controller('ThreadController', function($scope, thread, Camera, $timeout) {
  console.log("THREAD " ,thread)
	$scope.thread = thread; // current user is the first object in array
  $scope.photos = [];
  for (var i = 0; i < 4; i++) {
    Camera.getRandomPicture().then(function(imageURL) {
      var random = Math.floor(Math.random() * 1000);
      var photoObj = {};
      photoObj.photoURL = imageURL;
      photoObj.createdAt = new Date(new Date() - random*1000000);
      photoObj.owner = $scope.thread[random%2]
      $scope.photos.push(photoObj);
    })
  }
  $timeout(function() {
    console.log('THREAD PHOTOS: ', $scope.photos);
  },200)
});