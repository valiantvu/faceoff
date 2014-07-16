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
  'faceoff.startup',
  'faceoff.signup',
  'faceoff.newthread',
  'faceoff.menu',
  'faceoff.status',
  'faceoff.thread',
  'faceoff.confirmaccount'
  ])

.config(function($compileProvider, $stateProvider, $urlRouterProvider) {
  $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);

  $stateProvider

    // start up
    .state('startup', {
      url: "/startup",
      templateUrl: "components/startup/startup.html",
      controller: 'StartUpController'
    })

    // sign up
    .state('signupphone', {
      url: '/signup',
      templateUrl: 'components/signup/signupphone.html',
      controller: 'SignUpController',
      resolve: {
        user: function(AccountService) { return {}; }
      }
    })

    .state('signupname', {
      url: '/signup',
      templateUrl: 'components/signup/signupname.html',
      controller: 'SignUpController',
      resolve: {
        user: function(AccountService) {
          return AccountService.searchContacts();
        }
      }
    })

    // confirm account
    .state('confirmaccount', {
      url: "/confirmaccount",
      templateUrl: "components/confirm_account/confirmaccount.html",
      controller: 'ConfirmAccountController'
    })

    // new thread
    .state('newthreadgetready', {
      url: '/getready',
      templateUrl: 'components/new_thread/getready.html',
      controller: 'NewThreadController',
      resolve: {
        friends: function() { return [] }
      }
    })

    // reply thread
    .state('replyphoto', {
      url: '/getready/:recipientId',
      templateUrl: 'components/new_thread/getready.html',
      controller: 'NewThreadController',
      resolve: {
        friends: function() { return [] }
      }
    })

    .state('newthreadselect', {
      url: '/selectfriend',
      templateUrl: 'components/new_thread/selectfriend.html',
      controller: 'NewThreadController',
      resolve: {
        friends: function(FriendsService) {
          return FriendsService.all();
        }
      }
    })

    .state('newthreadconfirm', {
      url: '/confirm/:friendId',
      templateUrl: 'components/new_thread/confirm.html',
      controller: 'NewThreadController',
      resolve: {
        friends: function(FriendsService) {  // friends is only one friend in this case
          return FriendsService.getSelected(); // need to refactor to get friend using ID.
        }
      }
    })

    // thread
    .state('thread', {
      url: '/thread',
      templateUrl: 'components/thread/thread.html',
      controller: 'ThreadController',
      resolve: {
        thread: function(ThreadsService) {
          return ThreadsService.getSelected();
        }
      }
    })

    //Sidebar Child Views
    .state('menu', {
      url: '/',
      abstract: true,
      templateUrl: 'components/menu/menu.html',
      controller: 'MenuController'
    })

    .state('menu.status', {
      url: 'status',
      views: {
        'menuContent': {
          templateUrl: 'components/status/status.html',
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
  $urlRouterProvider.otherwise('/startup');
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