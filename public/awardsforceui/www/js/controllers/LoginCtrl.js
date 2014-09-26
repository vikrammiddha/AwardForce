angular.module('SigninAppModule', ['sfdcService'])
  .controller('LoginCtrl', ['$scope', 'userStore', '$state' ,function ($scope, userStore, $state) {
    
    //var stateChanged = false;
    


    $scope.login = function(){
        var myRef = new Firebase("https://brilliant-heat-9974.firebaseio.com");
        var authClient = new FirebaseSimpleLogin(myRef, function(error, user) { 
          console.log('===user 0 ===' + JSON.stringify(user));
          if(user != null){
            var userInfoData = {name : user.displayName, email: user.thirdPartyUserData.email, imageurl:encodeURIComponent(user.thirdPartyUserData.picture)};
                //stateChanged = true;
              userStore.setUserInfo(userInfoData,function(data){
                console.log('===user info is set now==' + JSON.stringify(data));
                $state.go("app.home");
              });
            
            
          } else{
            
          }
        });
        authClient.login('google');
      //authClient.logout();
    };

    //$scope.logout = function(){
       //$scope.authClient.logout();
    //}
    /*if($location.absUrl().indexOf('localhost') > 0){
      $scope.googleKey = '604173908288-3st0qn4jh42uks90u4di0u6ddbdo0lcl';
    }else{
      $scope.googleKey = '604173908288-5bt8enhg4k577drgsa0prrg1ih2pboek';
    }

    $scope.status = 'success';
    $scope.$on('event:google-plus-signin-success', function (event, authResult) {
      alert('login success');
      $scope.getUserInfo(); 
      // User successfully authorized the G+ App!
      console.log('Signed in!' + JSON.stringify(authResult));
    });
    $scope.$on('event:google-plus-signin-failure', function (event, authResult) {
      // User has not authorized the G+ App!
      alert('login failed');
      $scope.status = userStore.getLoginStatus();
      $scope.$apply();
      console.log('Not signed into Google Plus.' + $scope.status);
    });

    $scope.processUserInfo = function(userInfo) {
      console.log('===in processUserInfo==');
    // You can check user info for domain.
    //if(userInfo['domain'] == 'mycompanydomain.com') {
        // Hello colleague!
    //}
      var userInfoData = {name : userInfo.displayName, email: userInfo.emails[0].value, imageurl:encodeURIComponent(userInfo.image.url)};
      userStore.setUserInfo(userInfoData,function(data){
          $scope.status = userStore.getLoginStatus();
          console.log('===user info is set now==' + $location.absUrl());
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
    };*/

  }]);