angular.module('faceoff.signup', [
	'ionic'
	])

.controller('SignUpController', function($scope, $state) {

	$scope.signupData = {};

	$scope.doPhone = function() {
		// temporary
		$state.go('signupname');
		// if validate phone format
		// go to next screen
	};

	$scope.completeSignUp = function() {
		$state.go('cameranew');
	};

});