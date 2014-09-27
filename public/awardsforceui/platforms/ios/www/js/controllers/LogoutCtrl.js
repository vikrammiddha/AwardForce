angular.module('SignoutAppModule', [])
  .controller('LogoutCtrl', ['$scope', '$state','$rootScope','$window', function ($scope, $state, $rootScope,$window) {
    
    $rootScope.authClient.logout();
    $state.go('app.login');
    //$window.open('https://mail.google.com/mail/u/0/?logout&hl=en');
  }]);

  