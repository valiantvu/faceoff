angular.module('faceoff.newthreadconfirm', [
	'ionic',
	'services'
	])

.config(function($compileProvider){
  $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
})

.controller('NTConfirmController', function($scope, $state, $rootScope) {

  $scope.selectedFriend = $rootScope.selectedFriend;
  $scope.capturedImageURI = $rootScope.capturedImageURI;
  
  $scope.confirm = function() {
    // start a new thread on server now
    console.log("Start a new thread with data: " + JSON.stringify($scope.selectedFriend));

    $state.go('menu.status');
  }

});