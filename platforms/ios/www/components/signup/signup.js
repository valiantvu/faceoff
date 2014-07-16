angular.module('faceoff.signup', [
	'ionic',
	'services'
	])

.controller('SignUpController', function($scope, $state, user, AccountService, Contacts, $ionicPopup, Device) {

	$scope.user = user;

	$scope.doPhone = function() {
		// validate phone number format
		var PHONE_REGEXP = /^[(]{0,1}[0-9]{3}[)\.\- ]{0,1}[0-9]{3}[\.\- ]{0,1}[0-9]{4}$/;
		if (PHONE_REGEXP.test($scope.user.phone)) {
			AccountService.updateUser($scope.user);
			$state.go('signupname');
		} else {
			$scope.invalidPhone();
		}

	};

	$scope.completeSignUp = function() {

		if (user.first.length > 0 && user.last.length > 0) {
			// get UUID of phone, update signupData

			// post signup data to server
				// success
					// write the signupData to local storage
					// go to cameranew
				// error
					// show error in modal

			$state.go('newthreadgetready');
		} else {
			$scope.invalidName();
		}

	};

	$scope.logContacts = function() {
		// Contacts.find().then(function(contacts) {
		// 	console.log("CONTACTS ", contacts);
		// }, function(err) {
		// 	console.log(err);
		// });

		// testing
		console.log('XCODE');
		var localUser = JSON.parse(localStorage.getItem('user'));
		console.log('Local User uuid is ', localUser.uuid);
		console.log('Test is ', localUser.test);

		Contacts.log();
	};

// show alert for invalid phone
 $scope.invalidPhone = function() {
   $ionicPopup.alert({
     title: 'Invalid Phone Number',
     template: 'Phone number must be 10 digits.'
   }).then(function(res) {
     console.log('Try Again');
   });
 };

 // shor alert for invalid names
 $scope.invalidName = function() {
   $ionicPopup.alert({
     title: 'Name Required',
     template: 'First and Last name required.'
   }).then(function(res) {
     console.log('Try Again');
   });
 };
});