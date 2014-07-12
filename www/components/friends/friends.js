angular.module('faceoff.friends', [
	'ionic',
	'services'
	])

.controller('FriendsController', function($scope, $state, $ionicModal) {

  $ionicModal.fromTemplateUrl('components/friends/friendchallenge.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

});