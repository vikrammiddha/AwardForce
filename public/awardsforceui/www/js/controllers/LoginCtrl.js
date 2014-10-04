angular.module('SigninAppModule', ['sfdcService','pushmodule','LocalStorageModule'])
  .controller('LoginCtrl', ['$scope', 'userStore', '$state' ,'OpenFB','push','$rootScope','localStorageService', function ($scope, userStore, $state,OpenFB, push, $rootScope, localStorageService) {
    
    //console.log('Login process started ..');
    $scope.isLoginDone = true;

    var cordovaApp = document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1;

    //localStorageService.set('test', 'test');

    console.log('===' + localStorageService.get('test'));

    var userId = localStorageService.get('email');

    console.log('userId : ' + userId);
    if(!angular.isUndefined(userId) && userId != null){
        var name = localStorageService.get('name');
        var email = localStorageService.get('email');
        var imageurl = localStorageService.get('imageurl');
        var userInfoData = {name : name, email: email, imageurl:imageurl,token:'',device:''};
        userStore.setUserInfo(userInfoData,function(data){
          console.log('got user info successfully . ');
          $state.go("app.home");
        });

    }else{
      $scope.isLoginDone = false;
    }

    

    /*var myRef = new Firebase("https://brilliant-heat-9974.firebaseio.com/");
    $rootScope.authClient = new FirebaseSimpleLogin(myRef, function(error, user) {
      if (error) {
        $scope.isLoginDone = false;
        // an error occurred while attempting login
        console.log(error);
      } else if (user) {
            console.log(JSON.stringify(user));
            if(cordovaApp){
                var result = push.registerPush(function (result) {
                console.log('===push==' + result);  
                if (result.type === 'registration') {
                    //alert('result:' + JSON.stringify(result));
                    //alert('result Id :' + result.id + '--' + result.device);
                    var userInfoData = {name : user.displayName, email: user.thirdPartyUserData.email, imageurl:encodeURIComponent('https://graph.facebook.com/'+user.id+ '/picture?width=400&height=400'),token:result.id,device:result.device};
                    userStore.setUserInfo(userInfoData,function(data){

                      $state.go("app.home");
                    });
                  //alert('==device info===' + JSON.stringify(result));
                  
                }
              });
              }else{
                  var userInfoData = {name : user.displayName, email: user.thirdPartyUserData.email, imageurl:encodeURIComponent('https://graph.facebook.com/'+user.id+ '/picture?width=400&height=400'),token : '', device : ''};
                  userStore.setUserInfo(userInfoData,function(data){
                    console.log('updated user data : ' + JSON.stringify(data) ); 
                    $state.go("app.home");
                  });

              }
        // user authenticated with Firebase
        
      } else {
        $scope.isLoginDone = false;
        // user is logged out
      }
    });

    $scope.facebookLogin = function () {
      authClient.login("facebook");
    }*/
    //$state.go("app.home");
    
    $scope.facebookLogin = function () {
          $scope.isLoginDone  = true;

          if(!cordovaApp){
            var myRef = new Firebase("https://brilliant-heat-9974.firebaseio.com/");
            $rootScope.authClient = new FirebaseSimpleLogin(myRef, function(error, user) {
              if (error) {
                $scope.isLoginDone = false;
                // an error occurred while attempting login
                console.log(error);
              } else if (user) {
                localStorageService.set('name', user.displayName);
                localStorageService.set('email', user.thirdPartyUserData.email);
                localStorageService.set('imageurl', encodeURIComponent('https://graph.facebook.com/'+user.id+ '/picture?width=400&height=400'));
                $state.go("app.home");
              }

            });
            $rootScope.authClient.login("facebook");

          }else {


                  OpenFB.login('email,read_stream,publish_stream').then(
                    function () {
                        OpenFB.get('/me').success(function (user) {
                            
                            localStorageService.set('name', user.name);
                            localStorageService.set('email', user.email);
                            localStorageService.set('imageurl', encodeURIComponent('https://graph.facebook.com/'+user.id+ '/picture?width=400&height=400'));

                            if(cordovaApp){

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

                            }else{
                                var userInfoData = {name : user.name, email: user.email, imageurl:encodeURIComponent('https://graph.facebook.com/'+user.id+ '/picture?width=400&height=400'),token:'',device:''};
                                userStore.setUserInfo(userInfoData,function(data){

                                  $state.go("app.home");
                                });

                            }
                            
                        });
                      },
                    function () {
                        alert('OpenFB login failed');
                    });


          }


          
      };

  }]);