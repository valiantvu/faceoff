angular.module('faceoff.signupname', [
	'ionic',
	'services'
	])

.controller('SignUpNameController', function(Contacts, $scope, $state, $ionicPopup, Device) {

	$scope.user = Device.user(); // has phone, status, uuid, first(blank), last(blank)

	// Match device user's phone to name in contacts and update scope
	// Goal: App onboarding process reduced to a single user-provided field (phone)
	if (Device.isPhone()) {
		Contacts.getAll().then(function(contacts) {
			var match = Contacts.userMatchingPhone(contacts, Device.user().phone);
			if (match) {
				$scope.user.first = match.first;
				$scope.user.last = match.last;
			}
		}).catch(function(err) { console.log(err); });
	}

	$scope.completeSignUp = function() {

		if ($scope.user.first && $scope.user.first.length > 0 && $scope.user.last.length > 0) {
			// update local user
			Device.user($scope.user);

			// post signup data to server
				// success
					// update device user (status is now pending)
					// go to cameranew
				// error
					// show error in modal
			
			$state.go('newthreadgetready');
		} else {
			$scope.invalidName();
		}

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