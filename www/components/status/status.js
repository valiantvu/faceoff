angular.module('faceoff.status', [
	'ionic',
	'services'
	])

.controller('StatusController', function($scope, $state, API) {

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
    // Mark thread as read before navigating to thread view.
    if ($scope.user.id === thread.creator) {
      API.creatorRead(thread._id, true);
    }
    else {
      API.recipientRead(thread._id, true);
    }
		$state.go('thread', {threadId: thread._id});
	};

  /*
  // Used in testing for seeding a user with data. 
  // Uncomment here and in status.html to add seed data to database.
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
  */
});