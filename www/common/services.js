angular.module('services', ['ngCordova', 'ionic'])

.factory('AccountService', ['FriendsService', '$cordovaContacts', '$state', function(FriendsService, $cordovaContacts, $state) {
  
  // Some fake testing data
  var dummyUsers = [
    { id: 0, status: 'fresh', UUID: '1234' },
    { id: 1, first: 'G.I.', last: 'Joe', status: 'pending', UUID: '2345', phone: 1112223333 },
    { id: 2, first: 'Miss', last: 'Frizzle', status: 'confirmed', UUID: '3456', phone: 2223334444 },
    { id: 3, first: 'Ash', last: 'Ketchum', status: 'confirmed', UUID: '4567', phone: 3334445555 }
  ];

  var user = dummyUsers[0];
  // if no user in local storage create one now, add uuid
  // set user equal to user in local storage for fast access (assuming local storage can only be accessed with a promise)

  return {
    updateUser: function(user) {
      user = user;
    },
    searchContacts: function() {
      var user = FriendsService.all()[0]; // perform search
      return user;
    },
    logContacts: function() {
      console.log("LOGGING");
      $cordovaContacts.find({fields: ['id', 'displayName']}).then(function(contacts) {
        console.log("SUCCESS ", contacts);
      }, function(err) {
        console.log("ERROR ", err);
      });
      console.log("ASYNC BABY");
    },
    authAndRoute: function() {
      if (user.status === 'fresh') {
        $state.go('signupphone');
      } else if (user.status === 'pending') {
        // update from server now, THEN check again:
          if (user.status === 'confirmed') {
            $state.go('menu.status');
          } else {
            $state.go('confirmaccount');
          }
      } else if (user.status === 'confirmed') {
        $state.go('menu.status');
      }
    }
  }
}])

.factory('ThreadsService', function() {
  // Some fake testing data
  var seedImgPath = 'img/seedFaces/'
  var currentUser = {
    id: 4, first: 'Dave', last: 'G-W', phone: '5552221111'
  }
  var threads = [
    { id: 0, first: 'Scruff', last: 'McGruff', new: true, photos: [seedImgPath+'1.jpg', seedImgPath+'9.jpg', seedImgPath+'5.jpg', seedImgPath+'10.jpg'] },
    { id: 1, first: 'G.I.', last: 'Joe', new: false, photos: [seedImgPath+'10.jpg', seedImgPath+'4.jpg', seedImgPath+'6.jpg', seedImgPath+'7.jpg'] },
    { id: 2, first: 'Miss', last: 'Frizzle', new: true, photos: [seedImgPath+'3.jpg', seedImgPath+'8.jpg', seedImgPath+'12.jpg', seedImgPath+'1.jpg'] },
    { id: 3, first: 'Ash', last: 'Ketchum', new: false, photos: [seedImgPath+'5.jpg', seedImgPath+'9.jpg', seedImgPath+'11.jpg', seedImgPath+'2.jpg'] }
  ];

  var selectedThread = { first: 'Empty at First'};

  return {
    all: function() {
      return threads;
    },
    setSelected: function(thread) {
      selectedThread = [currentUser, thread]
    },
    getSelected: function() {
      return selectedThread;
    }
  }
})

.factory('FriendsService', function() {
  // Some fake testing data
  var contacts = [
    { id: 0, first: 'Tim', last: 'McGruff', phone: '7778880001' },
    { id: 1, first: 'James', last: 'Joe' , phone: '2223334444' },
    { id: 2, first: 'Swill', last: 'Frizzle', phone: '3334445555' },
    { id: 3, first: 'Relf', last: 'Ketchum', phone: '1114446666' }
  ];

  var selectedFriend = { first: 'No one yet' };

  return {
    all: function() {
      return contacts;
    },
    setSelected: function(friend) {
      selectedFriend = friend;
    },
    getSelected: function() {
      return selectedFriend;
    }
  }
})

.factory('Contacts', ['$q', function($q) {

  return {
    // with promises
    find: function() {
      console.log("Promisified Contacts");
      var q = $q.defer();

      var options = ['id', 'displayName'];

      navigator.contacts.find(function(contacts) {
        q.resolve(contacts);
      }, function(err) {
        q.reject(err);
      });

      return q.promise;
    },
    // without promises
    log: function() {
      console.log("Basic Contacts");
      navigator.contacts.find(['id', 'displayName'], function(contacts) {
        console.log("Success ", contacts);
      }, function(err) {
        console.log(err);
      });
    }
  }
}])

.factory('Camera', ['$q', function($q) {
 
  return {
    // opens photo view and returns a promise, promise returns a URI
    getPicture: function(options) {
      var q = $q.defer();
      
      if (options === undefined) {
        // cameraDirection: "1" for front-facing, "2" for user-facing
        // destinationType: Camera.DestinationType.DATA_URL
        options = {
          cameraDirection: 1,
          quality: 75,
          targetWidth: 320,
          targetHeight: 320,
          saveToPhotoAlbum: true,
          destinationType: Camera.DestinationType.FILE_URI, 
          sourceType : Camera.PictureSourceType.CAMERA, 
          allowEdit : false
        }; 
      }
      
      navigator.camera.getPicture(function(result) {
        // Do any magic you need
        q.resolve(result);
      }, function(err) {
        q.reject(err);
      }, options);
      
      return q.promise;
    },
    // for development purposes, a "virtual promise"
    getRandomPicture: function() {
      var q = $q.defer();
      var numImages = 26;
      var directory = 'img/seedFaces/';
      var index = Math.ceil(Math.random()*numImages);
      q.resolve(directory+index+'.jpg');
      return q.promise;
    }
  }
}])

// service to make device information available at any time
.factory('Device', function() {
  var device;

  return {
    // available: model, platform, uuid, version
    get: function(key) {
      return device[key];
    },
    set: function(obj) {
      device = obj;
    }
  }
})

// Workaround attempt for sending multipart form data. Currently not used.
.factory('formDataObject', function() {
  return function(data) {
    var fd = new FormData();
    angular.forEach(data, function(value, key) {
      fd.append(key, value);
    });
    return fd;
  };
})

.factory('API', function($http, formDataObject) {
  var apiCall = {};

  apiCall.getAllUsers = function() {
    return $http.get('http://localhost:9000/api/users');
  };

  apiCall.newThread = function() {
    return $http({
      url: 'http://localhost:9000/api/threads',
      method: 'POST',
      data: {
        participants: [1002003000, 1112223333]
      }
    });
  };

  // Does not work for multipart forms.
  apiCall.newPhoto = function(threadId, ownerId) {
    return $http({
      url: 'http://localhost:9000/api/photos',
      method: 'POST',
      data: {
        threadId: threadId,
        owner: ownerId,
        url: 'http://blog.jimdo.com/wp-content/uploads/2014/01/tree-247122.jpg'
      }
      // headers: {
      //   'Content-Type': 'multipart/form-data'
      // },
      // transformRequest: formDataObject
    });
  };

  apiCall.getAllThreads = function(userId) {
    return $http({
      url: 'http://localhost:9000/api/users/' + userId,
      method: 'GET'
    });
  };

  apiCall.getThread = function(threadId) {
    return $http({
      url: 'http://localhost:9000/api/threads/' + threadId,
      method: 'GET'
    });
  };

  return apiCall;
})
