angular.module('SigninAppModule', ['directive.g+signin','sfdcService'])
  .controller('LoginCtrl', ['$scope', 'userStore', '$state', function ($scope, userStore, $state) {
    $scope.$on('event:google-plus-signin-success', function (event, authResult) {
      $scope.getUserInfo();
      // User successfully authorized the G+ App!
      console.log('Signed in!' + JSON.stringify(authResult));
    });
    $scope.$on('event:google-plus-signin-failure', function (event, authResult) {
      // User has not authorized the G+ App!
      console.log('Not signed into Google Plus.');
    });

    $scope.processUserInfo = function(userInfo) {
    // You can check user info for domain.
    //if(userInfo['domain'] == 'mycompanydomain.com') {
        // Hello colleague!
    //}
      var userInfoData = {name : userInfo.displayName, email: userInfo.emails[0].value, imageurl:encodeURIComponent(userInfo.image.url)};
      userStore.setUserInfo(userInfoData,function(data){
        console.log('===user info is set now==' + JSON.stringify(data));
        $state.go("app.home");
      });
    // Or use his email address to send e-mails to his primary e-mail address.
      //sendEMail(userInfo['emails'][0]['value']);
    }
     
    // When callback is received, process user info.
    $scope.userInfoCallback = function(userInfo) {
        $scope.$apply(function() {
            $scope.processUserInfo(userInfo);
        });
    };
     
    // Request user info.
    $scope.getUserInfo = function() {
        gapi.client.request(
            {
                'path':'/plus/v1/people/me',
                'method':'GET',
                'callback': $scope.userInfoCallback
            }
        );
    };

  }]);