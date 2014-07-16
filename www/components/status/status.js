angular.module('faceoff.status', [
	'ionic',
	'services'
	])

.controller('StatusController', function($scope, $state, threads, ThreadsService, $http) {

	console.log("THREADS ", threads);
	$scope.threads = threads;

	$scope.selectThread = function(thread) {
		ThreadsService.setSelected(thread);
		$state.go('thread');
	}

  $scope.clickMe = function() {
    $http.get("http://tradingfaces.herokuapp.com/api/users")
              .success(function(data) {
                console.log(data);
              })
              .error(function(error) {
                console.log(error);
              })
  }

});