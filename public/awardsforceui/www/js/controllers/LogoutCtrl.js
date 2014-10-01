angular.module('SignoutAppModule', [])
  .controller('LogoutCtrl', ['$scope', '$state','OpenFB', function ($scope, $state,OpenFB) {
    
   	OpenFB.logout();
    $state.go('app.login');
  }]);

  