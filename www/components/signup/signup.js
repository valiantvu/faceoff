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
			// update user in local storage
			var deviceUser = JSON.parse(window.localStorage.getItem('deviceUser'));
			deviceUser.phone = $scope.user.phone;
			window.localStorage.setItem('deviceUser', JSON.stringify(deviceUser));
			// for now, 
			AccountService.updateUser($scope.user);
			$state.go('signupname');
		} else {
			$scope.invalidPhone();
		}

	};

	$scope.completeSignUp = function() {

		if (user.first.length > 0 && user.last.length > 0) {
			// update local user

			// post signup data to server
				// success
					// update local storage
					// go to cameranew
				// error
					// show error in modal

			$state.go('newthreadgetready');
		} else {
			$scope.invalidName();
		}

	};

	$scope.test = function() {
		console.log("Platform ", JSON.stringify(navigator.userAgent));
		console.log("Platform ", navigator.userAgent);

		// testing local storage
		var deviceUser = JSON.parse(window.localStorage.getItem('deviceUser'));
		console.log('Device User Status: ', deviceUser.status);
		console.log('Device User UUID: ', deviceUser.uuid);
		console.log('Device User TYPE: ', Device.isPhone());

		// testing contacts
		// Contacts.find().then(function(contacts) {
		// 	console.log("CONTACTS ", JSON.parse(contacts));
		// }, function(err) {
		// 	console.log(err);
		// });
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

 // show alert for invalid names
 $scope.invalidName = function() {
   $ionicPopup.alert({
     title: 'Name Required',
     template: 'First and Last name required.'
   }).then(function(res) {
     console.log('Try Again');
   });
 };
});