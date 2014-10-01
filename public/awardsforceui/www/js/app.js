// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('awards', ['ionic', 'home-controller', 'user-profile-controller', 'openfb', 'SigninAppModule', 'SignoutAppModule'])

.run(function ($rootScope, $state, $ionicPlatform, $window, OpenFB) {

      OpenFB.init('1527683587467548');

      $ionicPlatform.ready(function () {
          if (window.StatusBar) {
              StatusBar.styleDefault();
          }
      });

      $rootScope.$on('$stateChangeStart', function(event, toState) {
          if (toState.name !== "app.login" && toState.name !== "app.logout" && !$window.sessionStorage['fbtoken']) {
              $state.go('app.login');
              event.preventDefault();
          }
      });

      $rootScope.$on('OAuthException', function() {
          $state.go('app.login');
      });

  })

.config(function($stateProvider, $urlRouterProvider, $httpProvider) {
  $httpProvider.defaults.useXDomain = true;

      //Remove the header used to identify ajax call  that would prevent CORS from working
  delete $httpProvider.defaults.headers.common['X-Requested-With'];
  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

    // setup an abstract state for the tabs directive
    .state('app', {
      url: "/app",
      abstract: true,
      templateUrl: "templates/menu.html",
      
    })

    .state('app.home', {
      url: "/home",
      views: {
        'menuContent' :{
          templateUrl: "templates/home.html",
          controller: "homeController",
          data: {
            // This tells Auth0 that this state requires the user to be logged in.
            // If the user isn't logged in and he tries to access this state
            // he'll be redirected to the login page
            requiresLogin: true
          }
        }
      }
    })

    .state('app.profile', {
      url: "/profile",
      views: {
        'menuContent' :{
          templateUrl: "templates/userprofile.html",
          controller: "userProfileController"
        }
      }
    })

    .state('app.login', {
      url: "/login",
      views: {
        'menuContent' :{
            templateUrl: "templates/login.html",
            controller: "LoginCtrl"
        }
      }
    })

    .state('app.logout', {
      url: "/logout",
      views: {
        'menuContent' :{
            templateUrl: "templates/logout.html",
            controller: "LogoutCtrl"
        }
      }
    });

    
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/login');

})


.config(['$httpProvider', function ($httpProvider) {
  //Reset headers to avoid OPTIONS request (aka preflight)
  $httpProvider.defaults.headers.common = {};
  $httpProvider.defaults.headers.post = {};
  $httpProvider.defaults.headers.put = {};
  $httpProvider.defaults.headers.patch = {};
}]);

