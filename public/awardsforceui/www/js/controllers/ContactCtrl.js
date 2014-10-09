angular.module('ContactModule', ['sfdcService'])
  .controller('ContactCtrl', ['$scope', '$state','localStorageService', '$location','userStore','$ionicModal','likeStore', function ($scope, $state, localStorageService ,$location, userStore,$ionicModal, likeStore) {
    
    var sfdcId = ($location.search()).sfdcId;
    $scope.selectedContact = {};
    console.log('sfdcId :' + sfdcId);

    userStore.getSelectedContact(sfdcId,function(data){
		//console.log(JSON.stringify(data))	
		$scope.selectedContact.name = data.selectedContact.Name;
		$scope.selectedContact.email = data.selectedContact.Email;
		$scope.selectedContact.imageurl = data.selectedContact.Image_URL__c;	
		$scope.sfdcId = data.sfdcId;
		$scope.Feeds = data.fiList;
		//console.log('===feeds===' + JSON.stringify(data));
		likeStore.prepareLikesMap($scope.UserInfo, data.fiList);	
		likeStore.prepareCommentsMap(data.fiList);
	});

    $scope.redirect = function(sfdcId){
    	userStore.getSelectedContact(sfdcId,function(data){
		//console.log(JSON.stringify(data))	
			$scope.selectedContact.name = data.selectedContact.Name;
			$scope.selectedContact.email = data.selectedContact.Email;
			$scope.selectedContact.imageurl = data.selectedContact.Image_URL__c;	
			$scope.sfdcId = data.sfdcId;
			$scope.Feeds = data.fiList;
			//console.log('===feeds===' + JSON.stringify(data));
			likeStore.prepareLikesMap($scope.UserInfo, data.fiList);	
			likeStore.prepareCommentsMap(data.fiList);
		});
    }

	$scope.UserInfo = userStore.getUserInfo();
		
	$ionicModal.fromTemplateUrl('./templates/giveAward.html', {
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

	 $scope.isSubmitInProcess = false; 
	$scope.submitAward = function(taker,comment){
		$scope.isSubmitInProcess = true;
		feedStore.submitAward($scope.UserInfo.sfdcId,taker.Id,comment,function(){
			feedStore.getAwardFeeds($scope.UserInfo,function(data){
				$scope.Feeds = data.fiList;
				likeStore.prepareLikesMap($scope.UserInfo, data.fiList);	
				likeStore.prepareCommentsMap(data.fiList);
				$scope.LikesMap = likeStore.getLikesMap();
				$scope.LikesCounterMap = likeStore.getLikesCountMap();
				$scope.CommentsCounterMap = likeStore.getCommentsCountMap();
				$scope.CommentsMap = likeStore.getCommentsMap();
				$scope.commentBody="";
				$scope.selectedContact = "";
				$scope.isSubmitInProcess = false;	
				$scope.closeModal();
			});
			
		});
	};

	
	 

	$scope.LikesMap = likeStore.getLikesMap();
	$scope.LikesCounterMap = likeStore.getLikesCountMap();
	$scope.CommentsCounterMap = likeStore.getCommentsCountMap();
	$scope.CommentsMap = likeStore.getCommentsMap();

	$scope.doRefresh = function() {
		userStore.getSelectedContact(sfdcId,function(data){
		//console.log(JSON.stringify(data))	
			$scope.selectedContact.name = data.selectedContact.Name;
			$scope.selectedContact.email = data.selectedContact.Email;
			$scope.selectedContact.imageurl = data.selectedContact.Image_URL__c;
			$scope.sfdcId = data.sfdcId	
			$scope.Feeds = data.fiList;
			//console.log('===feeds===' + JSON.stringify(data));
			likeStore.prepareLikesMap($scope.UserInfo, data.fiList);	
			likeStore.prepareCommentsMap(data.fiList);
			$scope.$broadcast('scroll.refreshComplete');
		});
		  
	};

	$scope.addComments = function(feedId){
		
		likeStore.setCommentsMap(feedId, 'show');
		//console.log('====after val==' + $scope.CommentsMap[feedId]);
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