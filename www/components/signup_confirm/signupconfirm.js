angular.module('faceoff.signupconfirm', [
	'ionic',
	'services'
	])

.controller('SignUpConfirmController', function($scope, $state, $ionicPopup, Device, API) {

	$scope.user = Device.user();

	$scope.finish = function() {
		console.log("Confirming code: ", $scope.user.confirmCode);
		if($scope.user.confirmCode.toString().length === 4) {
			API.confirmUser(Device.user()._id, $scope.user.confirmCode).then(function(response) {
				console.log("Success Code Validated ", JSON.stringify(respnose));
				var user = response.data;
				if (user.status = 'confirmed') {
					Device.user(user);
					$state.go('newthreadgetready');
				} else {
					$scope.invalidCode();
				}
			}).catch(function(err) {
				console.log('Error ', JSON.stringify(err));
			});
		} else {
			console.log("form invalid");
		}
	};

	$scope.invalidCode = function() {
   $ionicPopup.alert({
     title: 'Sorry',
     template: 'That code did not match the code we sent you.'
   }).then(function(res) {
     console.log('Try Again');
   });
 };

});