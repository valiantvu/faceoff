// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('app', [
  'ionic', 
  'services', // break up later
  'faceoff.signup',
  'faceoff.cameranew',
  'faceoff.friends',
  'faceoff.menu',
  'faceoff.status'
  ])

.config(function($compileProvider, $stateProvider, $urlRouterProvider) {
  $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);

  $stateProvider

    .state('signupphone', {
      url: "/signup",
      templateUrl: "components/signup/signupphone.html",
      controller: 'SignUpController'
    })

    .state('signupname', {
      url: "/signup",
      templateUrl: "components/signup/signupname.html",
      controller: 'SignUpController'
    })

    .state('cameranew', {
      url: "/newphoto",
      templateUrl: "components/camera_new/cameranew.html",
      controller: 'CameraNewController'
    })

    .state('friendselect', {
      url: "/friends",
      templateUrl: "components/friends/friendselect.html",
      controller: 'FriendsController'
    })

    .state('friendchallenge', {
      url: "/friends",
      templateUrl: "components/friends/friendchallenge.html",
      controller: 'FriendsController'
    })
    //sidebar views
    .state('menu', {
      url: "/",
      abstract: true,
      templateUrl: "components/menu/menu.html",
      controller: 'MenuController'
    })

    .state('menu.status', {
      url: "/status",
      views: {
        'menuContent' :{
          templateUrl: "components/status/status.html",
          controller: 'StatusController'
        }
      }
    })

  // Default route
  $urlRouterProvider.otherwise('/signup');
})

.run(function($ionicPlatform, Device) {
  console.log("RUNNING APP");
  $ionicPlatform.ready(function() {
    console.log("PLATFORM READY");
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
    // Grab and set all device details (ie uuid)
    Device.set(ionic.Platform.device());
  });
});