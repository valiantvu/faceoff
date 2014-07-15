angular.module('services2', ['services'])

.factory('AccountService', ['FriendsService', function(FriendsService) {
  var user = {};

  return {
    updateUser: function(user) {
      user = user;
    },
    searchContacts: function() {
      var user = FriendsService.all()[0]; // perform search  { id: 0, first: 'Tim', last: 'McGruff' }; // 
      return user;
    }
  }
}]);
