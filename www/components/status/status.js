angular.module('faceoff.status', [
	'ionic',
	'services'
	])

.controller('StatusController', function($scope, $state, threads, ThreadsService, $http, API, $q, Camera) {

  $scope.user = JSON.parse(window.localStorage.getItem('deviceUser'));

  var init = function() {
    API.getAllThreadsData($scope.user.id)
      .success(function(data) {
        $scope.threads = data.threads;
      })
      .error(function(error) {
        console.log(error);
      });
  }
  init();

	$scope.selectThread = function(thread) {
		$state.go('thread', {threadId: thread._id});
	};

  // Used in testing for seeding a user with data.
  $scope.seedDataBase = function() {
    var userData = {
      first: 'Dave',
      last: 'G-W',
      phone: 5553331234,
      email: 'dave@me.com',
      status: 'confirmed',
      threads: [],
      uuid: 'dave123'
    }
    API.newUser(userData);
  }
});