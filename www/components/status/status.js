angular.module('faceoff.status', [
	'ionic',
	'services'
	])

.controller('StatusController', function($scope, threads) {

	console.log("THREADS ", threads);
	$scope.threads = threads;

});