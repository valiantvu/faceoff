angular.module('services', ['ngCordova', 'ionic'])

.factory('AccountService', ['$state', function($state) {
  
  return {
    authAndRoute: function() {
      var user = JSON.parse(window.localStorage.getItem('deviceUser'));
      // we assume user is from local storage
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

  // allWithPhone

  // userMatching(phone)

  var logEach = function(contacts) {
    for(var i = 0; i < contacts.length; i++) {
      console.log(contacts[i].name.givenName);
      console.log(contacts[i].name.familyName);
      if (contacts[i].phoneNumbers) {
        for (var j = 0; j < contacts[i].phoneNumbers.length; j++) {
          console.log(contacts[i].phoneNumbers[j].value);
        }
      }
    }
  };

  return {
    // with promises
    find: function() {
      console.log("Promisified Contacts");
      var q = $q.defer();

      var fields = ['id', 'displayName'];

      navigator.contacts.find(fields, function(contacts) {
        q.resolve(contacts);
      }, function(err) {
        q.reject(err);
      });

      return q.promise;
    },
    // without promises
    log: function() {
      console.log("Basic Contacts");
      var fields = ['id', 'displayName'];
      var options = { multiple: true };
      navigator.contacts.find(fields, function(contacts) {
        console.log("Received Contacts");
        console.log("Success ", logEach(contacts));//JSON.stringify(contacts));
      }, function(err) {
        console.log(err);
      }, options);
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

// Custom service to make device information available at any time
// and expose device type
.factory('Device', function() {
  var device = {};

  return {
    // available: model, platform, uuid, version
    get: function(key) {
      return device;
    },
    getItem: function(key) {
      return device[key];
    },
    set: function(obj) {
      device = obj;
    },
    setItem: function(key, value) {
      device[key] = value;
    },
    isPhone: function() {
      return device.type === 'phone';
    },
    user: function(obj) {
      if (obj) {
        window.localStorage.setItem('deviceUser', JSON.stringify(obj));
      } else {
        return JSON.parse(window.localStorage.getItem('deviceUser'));
      }
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
  apiCall.newPhoto = function(threadId, ownerId, photoURI) {
    return $http({
      url: 'http://localhost:9000/api/photos',
      method: 'POST',
      data: {
        threadId: threadId,
        owner: ownerId,
        url: photoURI
      }
      // headers: {
      //   'Content-Type': 'multipart/form-data'
      // },
      // transformRequest: formDataObject
    });
  };

  apiCall.getUser = function(userId) {
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

  apiCall.getThreadData = function(threadId) {
    return $http({
      url: 'http://localhost:9000/api/threads/all/' + threadId,
      method: 'GET'
    });
  };

  apiCall.getAllThreadsData = function(threadId) {
    return $http({
      url: 'http://localhost:9000/api/users/threads/' + threadId,
      method: 'GET'
    });
  };

  /************************
   *** SAMPLE API Calls ***
   ************************
    API.getAllUsers()
      .success(function(data) {
        console.log(data);
      })
      .error(function(error) {
        console.log(error);
      });

    API.newThread()
      .success(function(newThread) {
        console.log(newThread);
        var threadId = newThread.data._id;
        var ownerId = newThread.data.participants[0];
        // Remove this line when we have real photos to send.
        Camera.getRandomPicture().then(function(image) {
          API.newPhoto(threadId, ownerId, image)
            .success(function(data) {
              console.log(data);
            })
            .error(function(error) {
              console.log(error);
            });
        })
      })
      .error(function(error) {
        console.log('error');
        console.log(error);
      })

    newPhoto only test.
    API.newPhoto("53c741465a44899857fb64a8", "53c741465a44899857fb64a6")
      .success(function(data) {
        console.log(data);
      })
      .error(function(error) {
        console.log(error);
      })
    
    API.getThread('53c741465a44899857fb64a8')
      .success(function(data) {
        console.log(data);
      })
      .error(function(error) {
        console.log(error);
      });

    API.getUser('53c741465a44899857fb64a6')
      .success(function(data) {
        console.log(data);
      })
      .error(function(error) {
        console.log(error);
      });

    API.getAllThreadsData('53c7794489f357de7dbf6186')
      .success(function(data) {
        console.log(data);
      })
      .error(function(error) {
        console.log(error);
      });
  */  

  return apiCall;
})
