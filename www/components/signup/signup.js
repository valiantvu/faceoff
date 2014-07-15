angular.module('faceoff.signup', [
	'ionic',
	'services'
	])

.controller('SignUpController', function($scope, $state, user, AccountService) {

	$scope.user = user;

	$scope.doPhone = function() {
		// phone must be validated by now
		AccountService.updateUser($scope.user);
		$state.go('signupname');

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