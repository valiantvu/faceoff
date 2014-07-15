angular.module('services', [])

.factory('ThreadsService', function() {
  // Some fake testing data
  var threads = [
    { id: 0, first: 'Scruff', last: 'McGruff' },
    { id: 1, first: 'G.I.', last: 'Joe' },
    { id: 2, first: 'Miss', last: 'Frizzle' },
    { id: 3, first: 'Ash', last: 'Ketchum'  }
  ];

  var selectedThread = { first: 'Empty at First'};

  return {
    all: function() {
      return threads;
    },
    setSelected: function(thread) {
      selectedThread = thread;
    },
    getSelected: function() {
      return selectedThread;
    }
  }
})

.factory('FriendsService', function() {
  // Some fake testing data
  var contacts = [
    { id: 0, first: 'Tim', last: 'McGruff' },
    { id: 1, first: 'James', last: 'Joe' },
    { id: 2, first: 'Swill', last: 'Frizzle' },
    { id: 3, first: 'Relf', last: 'Ketchum'  }
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
});
