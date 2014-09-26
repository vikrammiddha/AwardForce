angular.module('SignoutAppModule', [])
  .controller('LogoutCtrl', ['$scope', '$state','$timeout', function ($scope, $state, $timeout) {
    
    var myRef = new Firebase("https://brilliant-heat-9974.firebaseio.com");
    authClient = new FirebaseSimpleLogin(myRef, function(error, user) { 
      
       authClient.logout();
       $state.go('app.login');
    });
    
  }]);