angular.module('SigninAppModule', ['sfdcService','pushmodule'])
  .controller('LoginCtrl', ['$scope', 'userStore', '$state' ,'OpenFB','push', function ($scope, userStore, $state,OpenFB, push) {
    
    $scope.isLoginDone = true;
    //$state.go("app.home");
    OpenFB.get('/me').success(function (user) {
          var userInfoData = {name : user.name, email: user.email, imageurl:encodeURIComponent('https://graph.facebook.com/'+user.id+ '/picture?width=400&height=400')};
    //stateChanged = true;
          userStore.setUserInfo(userInfoData,function(data){
            //$scope.isLoginDone  = true;
            //$scope.$apply();
            state.go("app.home");
            
          });
      }).error(function(err){
        $scope.isLoginDone = false;

      });

    $scope.facebookLogin = function () {
          $scope.isLoginDone  = true;
          OpenFB.login('email,read_stream,publish_stream').then(
              function () {
                  OpenFB.get('/me').success(function (user) {

                      var result = push.registerPush(function (result) {
                        if (result.type === 'registration') {
                            //alert('result:' + JSON.stringify(result));
                            //alert('result Id :' + result.id + '--' + result.device);
                            var userInfoData = {name : user.name, email: user.email, imageurl:encodeURIComponent('https://graph.facebook.com/'+user.id+ '/picture?width=400&height=400'),token:result.id,device:result.device};
                            userStore.setUserInfo(userInfoData,function(data){

                              $state.go("app.home");
                            });
                          //alert('==device info===' + JSON.stringify(result));
                          
                        }
                      });
                  });
                },
              function () {
                  alert('OpenFB login failed');
              });
      };

  }]);