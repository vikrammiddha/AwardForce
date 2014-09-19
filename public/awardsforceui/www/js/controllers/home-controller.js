angular.module('home-controller' , ['sfdcService'])

.controller('homeController',[ 'feedStore', 'userStore', 'likeStore' ,'$scope', function(feedStore, userStore, likeStore ,$scope ,  $ionicModal, $ionicPopup , $timeout) {

	userStore.setUserInfo(function(data){
		$scope.UserInfo = data;
		console.log('==userinfo==' + data.sfdcId);
	});

	feedStore.getAwardFeeds($scope.UserInfo,function(data){
		$scope.Feeds = data;
		likeStore.prepareLikesMap($scope.UserInfo, data);	
		
	});

	$scope.LikesMap = likeStore.getLikesMap();
	$scope.LikesCounterMap = likeStore.getLikesCountMap();

	$scope.doRefresh = function() {
		feedStore.getAwardFeeds(function(data){
			$scope.Feeds = data;	
			$scope.$broadcast('scroll.refreshComplete');
		});    
	};

	$scope.likeButtonPressed = function(awardId){
		if(likeStore.getLikesMap()[awardId] === "Like"){
			likeStore.setLikesMap(awardId, "Unlike");
			likeStore.setLikesCountMap(awardId, $scope.LikesCounterMap[awardId] + 1);
		}else{
			likeStore.setLikesMap(awardId, "Like");
			likeStore.setLikesCountMap(awardId, $scope.LikesCounterMap[awardId] - 1);
			likeStore.deleteLikeFromSFDC($scope.UserInfo,awardId);
		};

		$scope.LikesMap = likeStore.getLikesMap();
		$scope.LikesCounterMap = likeStore.getLikesCountMap();

		//$scope.LikesMap.apply();
	};
}]);

