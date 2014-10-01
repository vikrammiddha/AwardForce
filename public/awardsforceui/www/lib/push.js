/*
 * angular-phonegap-push-notification v0.0.3
 * (c) 2014 Patrick Heneise, patrickheneise.com
 * License: MIT
 */

angular.module('pushmodule', [])

  .factory('cordovaReady', function ($rootScope, $q, $timeout) {
    var loadingDeferred = $q.defer();
    
    document.addEventListener('deviceready', function () {
      $timeout(function() {
        $rootScope.$apply(loadingDeferred.resolve);
      });
    });
    
    return function cordovaReady() {
      return loadingDeferred.promise;
    };
  })

  .service('phone', function () {
    this.isAndroid = function () {
      var uagent = navigator.userAgent.toLowerCase();
      return uagent.search('android') > -1 ? true : false;
    };
  })

  .factory('push', function ($rootScope, phone, cordovaReady) {
    return {
      registerPush: function (fn) {
        cordovaReady().then(function () {
          var
            pushNotification = window.plugins.pushNotification,
            successHandler = function (result) {alert('sh:' + result);},
            errorHandler = function (error) {alert('eh:' + error);},
            tokenHandler = function (result) {
              alert('th:' + result);
              return fn({
                'type': 'registration',
                'id': result,
                'device': 'ios'
              });
            };

           var onNotificationAPN = function (event) {
            alert(event);
            if (event.alert) {
              navigator.notification.alert(event.alert);
            }

            if (event.sound) {
              var snd = new Media(event.sound);
              snd.play();
            }

            if (event.badge) {
              pushNotification.setApplicationIconBadgeNumber(successHandler, errorHandler, event.badge);
            }
          };

          var onNotificationGCM = function (event) {
            switch (event.event) {
              case 'registered':
                if (event.regid.length > 0) {
                  return fn({
                    'type': 'registration',
                    'id': event.regid,
                    'device': 'android'
                  });
                }
                break;

              case 'message':
                if (event.foreground) {
                  var my_media = new Media("/android_asset/www/" + event.soundname);
                  my_media.play();
                } else {
                  if (event.coldstart) {
                  } else {
                  }
                }
                break;

              case 'error':
                break;

              default:
                break;
            }
          };

          if (phone.isAndroid()) {
            pushNotification.register(successHandler, errorHandler, {
              'senderID': '{your_sender_id}',
              'ecb': 'onNotificationGCM'
            });
          } else {
            console.log('register ios');
            pushNotification.register(tokenHandler, errorHandler, {
              'badge': 'true',
              'sound': 'true',
              'alert': 'true',
              'ecb': 'onNotificationAPN'
            });
          }
        });
      }
    };
  });