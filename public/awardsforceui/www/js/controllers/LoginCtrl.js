angular.module('SigninAppModule', ['sfdcService'])
  .controller('LoginCtrl', ['$scope', 'userStore', '$state' ,'OpenFB', function ($scope, userStore, $state,OpenFB) {
    
    $scope.isLoginDone = false;

    $scope.facebookLogin = function () {
          $scope.isLoginDone  = true;
          OpenFB.login('email,read_stream,publish_stream').then(
              function () {
                  OpenFB.get('/me').success(function (user) {
                      var userInfoData = {name : user.name, email: user.email, imageurl:encodeURIComponent('https://graph.facebook.com/'+user.id+ '/picture?width=400&height=400')};
                //stateChanged = true;
                      userStore.setUserInfo(userInfoData,function(data){
                        //$scope.isLoginDone  = true;
                        //$scope.$apply();
                        $state.go("app.home");
                      });
                  });
                },
              function () {
                  alert('OpenFB login failed');
              });
      };

  }]);