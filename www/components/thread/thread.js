angular.module('faceoff.thread', [
	'ionic'
	])

.controller('ThreadController', function($scope, thread) {

	$scope.thread = [thread]; // thread is only a single name for now

});