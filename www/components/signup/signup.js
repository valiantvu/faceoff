angular.module('faceoff.signup', [
	'ionic',
	'services'
	])

.controller('SignUpController', function(Contacts, $scope, $state, $ionicPopup, Device) {

	$scope.user = Device.user();

	$scope.doPhone = function() {
		// validate phone number format
		var PHONE_REGEXP = /^[(]{0,1}[0-9]{3}[)\.\- ]{0,1}[0-9]{3}[\.\- ]{0,1}[0-9]{4}$/;
		if (PHONE_REGEXP.test($scope.user.phone)) {
			// update user in local storage
			var deviceUser = Device.user();
			deviceUser.phone = $scope.user.phone;
			Device.user(deviceUser);
			
			$state.go('signupname');
		} else {
			$scope.invalidPhone();
		}

	};

	$scope.completeSignUp = function() {

		if ($scope.user.first.length > 0 && $scope.user.last.length > 0) {
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