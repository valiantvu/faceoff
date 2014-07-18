angular.module('faceoff.thread', [
	'ionic'
	])

.controller('ThreadController', function($scope, $state, $stateParams, API) {
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
});