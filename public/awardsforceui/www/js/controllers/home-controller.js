angular.module('home-controller' , ['sfdcService','homeDirective'])

.controller('homeController',[ 'feedStore', 'userStore', 'likeStore' ,'$scope', function(feedStore, userStore, likeStore ,$scope ,  $ionicModal, $ionicPopup , $timeout) {

	userStore.setUserInfo(function(data){
		$scope.UserInfo = data;
		console.log('==userinfo==' + data.sfdcId);
	});

	//feedStore.getToppers(function(data){
		//$scope.toppers = data;
	//});

	feedStore.getAwardFeeds($scope.UserInfo,function(data){
		$scope.Feeds = data.fiList;
		$scope.Toppers = data.topperList;
		likeStore.prepareLikesMap($scope.UserInfo, data.fiList);	
		likeStore.prepareCommentsCountMap(data.fiList);
	});

	$scope.LikesMap = likeStore.getLikesMap();
	$scope.LikesCounterMap = likeStore.getLikesCountMap();
	$scope.CommentsCounterMap = likeStore.getCommentsCountMap();

	$scope.doRefresh = function() {
		feedStore.getAwardFeeds($scope.UserInfo,function(data){
			$scope.Feeds = data.fiList;	
			$scope.$broadcast('scroll.refreshComplete');
		});    
	};

	$scope.likeButtonPressed = function(awardId){
		if(likeStore.getLikesMap()[awardId] === "Like"){
			likeStore.setLikesMap(awardId, "Liking..");
			likeStore.createdeleteLikeFromSFDC('create',$scope.UserInfo,awardId,function(){
				likeStore.setLikesMap(awardId, "Unlike");
				likeStore.setLikesCountMap(awardId, $scope.LikesCounterMap[awardId] + 1);
				//$scope.LikesMap = likeStore.getLikesMap();
				//$scope.LikesCounterMap = likeStore.getLikesCountMap();
			});
		}else{
			likeStore.setLikesMap(awardId, "Unliking..");
			likeStore.createdeleteLikeFromSFDC('delete',$scope.UserInfo,awardId,function(){
				likeStore.setLikesMap(awardId, "Like");
				likeStore.setLikesCountMap(awardId, $scope.LikesCounterMap[awardId] - 1);
				//$scope.LikesMap = likeStore.getLikesMap();
				//$scope.LikesCounterMap = likeStore.getLikesCountMap();
			});
		};

		

		//$scope.LikesMap.apply();
	};
}]);

