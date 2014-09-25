angular.module('directive.g+signin', ['sfdcService']).
  directive('googlePlusSignin', function ($rootScope) {
  var ending = /\.apps\.googleusercontent\.com$/;

  return {
    restrict: 'E',
    template: '<span class="g-signin"></span>',
    scope:{
      status:'='
    },
    replace: true,
    link: function (scope, element, attrs) {
      attrs.clientid += (ending.test(attrs.clientid) ? '' : '.apps.googleusercontent.com');
      attrs.$set('data-clientid', attrs.clientid);

      // Some default values, based on prior versions of this directive
      var defaults = {
        callback: 'signinCallback',
        cookiepolicy: 'single_host_origin',
        requestvisibleactions: 'http://schemas.google.com/AddActivity',
        scope: 'https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/plus.me https://www.googleapis.com/auth/plus.profile.emails.read',
        width: 'wide'
      };

      // Provide default values if not explicitly set
      angular.forEach(Object.getOwnPropertyNames(defaults), function(propName) {
        if (!attrs.hasOwnProperty(propName)) {
          attrs.$set('data-' + propName, defaults[propName]);
        }
      });

      // Default language
      // Supported languages: https://developers.google.com/+/web/api/supported-languages
      attrs.$observe('language', function(value){
        window.___gcfg = {
          lang: value ? value : 'en'
        };
      });   
      
      // Asynchronously load the G+ SDK.
      (function() {
        var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
        po.src = 'https://apis.google.com/js/client:plusone.js';
        var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
      })();
    }
  };
}).run(['$window','$rootScope', 'userStore',function($window, $rootScope, userStore) {
  $window.signinCallback = function (authResult) {
    console.log(authResult);
    if (authResult && authResult.access_token){
      userStore.setLoginStatus('success');
      $rootScope.$broadcast('event:google-plus-signin-success', authResult);
    } else {
      userStore.setLoginStatus('failed');
      $rootScope.$broadcast('event:google-plus-signin-failure', authResult);
    }
  }; 
}]);