angular.module('faceoff.status', [
	'ionic',
	'services'
	])

.controller('StatusController', function($scope, $state, threads, ThreadsService) {

	console.log("THREADS ", threads);
	$scope.threads = threads;

	$scope.selectThread = function(thread) {
		ThreadsService.setSelected(thread);
		$state.go('thread');
	}

});