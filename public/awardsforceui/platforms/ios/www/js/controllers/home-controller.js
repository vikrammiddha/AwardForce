angular.module('home-controller' , ['sfdcService','homeDirective'])

.controller('homeController',[ '$scope', '$ionicModal','feedStore', 'userStore', 'likeStore' ,'$state',function($scope ,$ionicModal, feedStore, userStore, likeStore, $state) {

	$scope.toppersLoaded = false;
	$scope.UserInfo = userStore.getUserInfo();
	//console.log('---UserInfo---' + $scope.UserInfo.name);
	if(angular.isUndefined($scope.UserInfo.name)){
		$state.go('app.login');
	}
	
	$ionicModal.fromTemplateUrl('../../templates/giveAward.html', {
    	scope: $scope,
    	animation: 'slide-in-up'
	  }).then(function(modal) {
	     $scope.modal = modal; 
	  });

	$scope.allContacts = {};
	  $scope.openModal = function() {
	    $scope.modal.show();
		
	  };

	  $scope.closeModal = function() {
	    $scope.modal.hide();
	  };

	$scope.submitAward = function(taker,comment){
		
		feedStore.submitAward($scope.UserInfo.sfdcId,taker.Id,comment,function(){
			feedStore.getAwardFeeds($scope.UserInfo,function(data){
				$scope.Feeds = data.fiList;
				$scope.Toppers = data.topperList;
				likeStore.prepareLikesMap($scope.UserInfo, data.fiList);	
				likeStore.prepareCommentsMap(data.fiList);
				$scope.LikesMap = likeStore.getLikesMap();
				$scope.LikesCounterMap = likeStore.getLikesCountMap();
				$scope.CommentsCounterMap = likeStore.getCommentsCountMap();
				$scope.CommentsMap = likeStore.getCommentsMap();
				$scope.commentBody="";
				$scope.selectedContact = "";	
				$scope.closeModal();
			});
			
		});
	};

	
	 
	feedStore.getAwardFeeds($scope.UserInfo,function(data){
		userStore.getAllContacts($scope.UserInfo.sfdcId,function(data1){
			$scope.allContacts = data1.conList;
			//console.log('===all contacts===' + JSON.stringify(data1));
			$scope.Feeds = data.fiList;
			//console.log('===feeds===' + JSON.stringify(data));
			$scope.Toppers = data.topperList;
			likeStore.prepareLikesMap($scope.UserInfo, data.fiList);	
			likeStore.prepareCommentsMap(data.fiList);
			$scope.toppersLoaded = true;
			
		});
		
	});

	$scope.LikesMap = likeStore.getLikesMap();
	$scope.LikesCounterMap = likeStore.getLikesCountMap();
	$scope.CommentsCounterMap = likeStore.getCommentsCountMap();
	$scope.CommentsMap = likeStore.getCommentsMap();

	$scope.doRefresh = function() {
		feedStore.getAwardFeeds($scope.UserInfo,function(data){
			$scope.Feeds = data.fiList;	
			$scope.Toppers = data.topperList;
			$scope.$broadcast('scroll.refreshComplete');
		});    
	};

	$scope.addComments = function(feedId){
		
		likeStore.setCommentsMap(feedId, 'show');
		console.log('====after val==' + $scope.CommentsMap[feedId]);
		$scope.CommentsMap = likeStore.getCommentsMap();
	};

	$scope.submitComment = function(feedId,commentBody){
		//
		var commentReq = {feedId:feedId, commentBody:commentBody, createdBy:$scope.UserInfo.sfdcId};
		likeStore.setCommentsMap(feedId, 'processing');
		likeStore.postComment(commentReq,function(){
			likeStore.setCommentsMap(feedId, 'hide');
			likeStore.setCommentsCountMap(feedId,$scope.CommentsCounterMap[feedId] + 1);
			$scope.commentBody={};
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