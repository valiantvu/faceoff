angular.module('faceoff.newthread', [
	'ionic',
	'services'
	])

.config(function($compileProvider){
  $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
})

.controller('NewThreadController', function($scope, friends, FriendsService, $rootScope, $state, $ionicModal, Camera, $timeout) {

  $scope = $rootScope;
  $scope.friends = friends;
  // a better way using services and injection through resolve:
    // http://learn.ionicframework.com/formulas/sharing-data-between-views/

  // make countdown timer that visually updates on page, before launching camera

  $scope.shoot = function() {
    // check for device type and launch webcam or phone cam here

    // using getRandomPicture instead of getPicture for faster testing
    Camera.getRandomPicture().then(function(imageURI) {
      $rootScope.newThreadImageURI = imageURI;
      $state.go('newthreadselect');
    }, function(err) {
      console.err(err);
    });
  };

  $scope.selectFriend = function(friend) {
    FriendsService.setSelected(friend);
    $state.go('newthreadconfirm');
  };

  // if ($state.current.name === 'newthreadgetready') {
  //   $timeout($scope.shoot, 500);
  // }

});