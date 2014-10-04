angular.module('SignoutAppModule', [])
  .controller('LogoutCtrl', ['$scope', '$state','OpenFB', '$rootScope','localStorageService', function ($scope, $state,OpenFB,$rootScope, localStorageService) {
    
    localStorageService.clearAll();
   	OpenFB.logout();
   	if(!angular.isUndefined($rootScope.authClient))
   		$rootScope.authClient.logout();
    $state.go('app.login');
  }]);

  