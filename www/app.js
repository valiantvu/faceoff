// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('app', [
  'ionic', 
  'services', // break up later
  'ngCordova',
  'faceoff.signup',
  'faceoff.newthread',
  'faceoff.menu',
  'faceoff.status',
  'faceoff.thread'
  ])

.config(function($compileProvider, $stateProvider, $urlRouterProvider) {
  $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);

  $stateProvider

    // sign up
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

    // new thread
    .state('newthreadgetready', {
      url: "/getready",
      templateUrl: "components/new_thread/getready.html",
      controller: 'NewThreadController',
      resolve: {
        friends: function() { return [] }
      }
    })

    .state('newthreadselect', {
      url: "/selectfriend",
      templateUrl: "components/new_thread/selectfriend.html",
      controller: 'NewThreadController',
      resolve: {
        friends: function(FriendsService) {
          return FriendsService.all();
        }
      }
    })

    .state('newthreadconfirm', {
      url: "/confirm",
      templateUrl: "components/new_thread/confirm.html",
      controller: 'NewThreadController',
      resolve: {
        friends: function() { return [] }
      }
    })

    // thread
    .state('thread', {
      url: "/thread",
      templateUrl: "components/thread/thread.html",
      controller: 'ThreadController'
    })

    //Sidebar Child Views
    .state('menu', {
      url: "/",
      abstract: true,
      templateUrl: "components/menu/menu.html",
      controller: 'MenuController'
    })

    .state('menu.status', {
      url: "status",
      views: {
        'menuContent' :{
          templateUrl: "components/status/status.html",
          controller: 'StatusController'
        }
      },
      resolve: {
        threads: function(ThreadsService) {
          return ThreadsService.all();
        }
      }
    })

  // Default route
  $urlRouterProvider.otherwise('/signup');
})

.run(function($ionicPlatform, Device) {
  $ionicPlatform.ready(function() {
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
    // Grab and set all device details (ie uuid)
    Device.set(ionic.Platform.device());
  });
});