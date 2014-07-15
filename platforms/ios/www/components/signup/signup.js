angular.module('faceoff.signup', [
	'ionic'
	])

.controller('SignUpController', function($scope, $state) {

	$scope.signupData = {};

	$scope.doPhone = function() {
		// temporary
		$state.go('signupname');
		
		// if valid phone format
			// get contacts from phone (service)
			// if matching phone found
				// set $scope.singupData.first
				// set $scope.singupData.last
			// go to next screen

	};

	$scope.completeSignUp = function() {

		// get UUID of phone, update signupData

		// post signup data to server
			// success
				// write the signupData to local storage
				// go to cameranew
			// error
				// show error in modal

		$state.go('newthreadgetready');
	};

});