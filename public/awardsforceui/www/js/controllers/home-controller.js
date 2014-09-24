angular.module('home-controller' , ['sfdcService','homeDirective'])

.controller('homeController',[ '$scope', '$ionicModal','feedStore', 'userStore', 'likeStore' ,function($scope ,$ionicModal, feedStore, userStore, likeStore) {

	userStore.setUserInfo(function(data){
		$scope.UserInfo = data;
		console.log('==userinfo==' + data.sfdcId);
	});

	$ionicModal.fromTemplateUrl('../../templates/giveAward.html', {
    	scope: $scope,
    	animation: 'slide-in-up'
	  }).then(function(modal) {
	     $scope.modal = modal; 
	  });

	$scope.allContacts = {};
	  $scope.openModal = function() {
	    
		userStore.getAllContacts($scope.UserInfo.sfdcId,function(data){
			$scope.allContacts = data.conList;
			$scope.modal.show();
			console.log('===all contacts===' + JSON.stringify(data));
		});
	  };

	  $scope.closeModal = function() {
	    $scope.modal.hide();
	  };

	$scope.submitAward = function(taker,comment){
		console.log('---comment---' + comment);
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
		$scope.Feeds = data.fiList;
		$scope.Toppers = data.topperList;
		likeStore.prepareLikesMap($scope.UserInfo, data.fiList);	
		likeStore.prepareCommentsMap(data.fiList);
	});

	$scope.LikesMap = likeStore.getLikesMap();
	$scope.LikesCounterMap = likeStore.getLikesCountMap();
	$scope.CommentsCounterMap = likeStore.getCommentsCountMap();
	$scope.CommentsMap = likeStore.getCommentsMap();

	$scope.doRefresh = function() {
		feedStore.getAwardFeeds($scope.UserInfo,function(data){
			$scope.Feeds = data.fiList;	
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
}])

.controller('LoginCtrl', function($scope, auth, $state) {
  auth.signin({
    popup: true,
    // Make the widget non closeable
    standalone: true,
    // This asks for the refresh token
    // So that the user never has to log in again
    offline_mode: true
  }, function() {
    $state.go('app.home');
  }, function(error) {
    console.log("There was an error logging in", error);
  });
})