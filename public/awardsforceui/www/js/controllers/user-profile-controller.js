angular.module('user-profile-controller' , ['sfdcService','homeDirective'])

.controller('userProfileController',[ '$scope', '$ionicModal','userStore', function($scope ,$ionicModal, userStore) {

	userStore.setUserInfo(function(data){
		$scope.UserInfo = data;
		console.log('==userinfo==' + data.sfdcId);
	});

}]);
