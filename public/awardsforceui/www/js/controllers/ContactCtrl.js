angular.module('ContactModule', ['sfdcService'])
  .controller('ContactCtrl', ['$scope', '$state','localStorageService', '$location','userStore','$ionicModal','likeStore', 'feedStore','$rootScope',
  							function ($scope, $state, localStorageService ,$location, userStore,$ionicModal, likeStore, feedStore, $rootScope) {
    
    var sfdcId = ($location.search()).sfdcId;
    $scope.selContact = {};
    if(!angular.isUndefined(sfdcId)){
    	$scope.selContact.sfdcId = sfdcId;
    	$rootScope.sfdcId = sfdcId;
    }else{
    	$scope.selContact.sfdcId = $rootScope.sfdcId;
    }
    console.log('sfdcId :' + sfdcId);
    $scope.showContactList= false;

    userStore.getSelectedContact($scope.selContact.sfdcId,function(data){
		//console.log(JSON.stringify(data))	
		$scope.selContact.name = data.selectedContact.Name;
		$scope.selContact.email = data.selectedContact.Email;
		$scope.selContact.imageurl = data.selectedContact.Image_URL__c;	
		//$scope.selContact.sfdcId = data.sfdcId;
		$scope.Feeds = data.fiList;
		//console.log('taker===' + $scope.selContact.sfdcId);
		//console.log('===feeds===' + JSON.stringify(data));
		likeStore.prepareLikesMap($scope.UserInfo, data.fiList);	
		likeStore.prepareCommentsMap(data.fiList);
	});

	$scope.contactList = [];
	$scope.showLikesWindow = function(feedId){
		console.log('entered ' + feedId);
	  	$scope.FeedLikesList = {};
	  	for(i=0; i< $scope.Feeds.length; i++){
	  		try{
	  			if($scope.Feeds[i].Id === feedId)
	  				$scope.FeedLikesList = $scope.Feeds[i].Feed_Likes__r.records;
	  			//
	  		}catch(e){

	  		}
	  	}
	  	console.log('FeedLikesList : ' + JSON.stringify($scope.FeedLikesList));
	  	if(!angular.isUndefined($scope.FeedLikesList)){
	  		for(i=0; i < $scope.FeedLikesList.length; i++){
	  			//console.log('row : ' + JSON.stringify($scope.FeedLikesList[i]));
	  			var row = {name : $scope.FeedLikesList[i].Liked_By__r.Name, imageurl : $scope.FeedLikesList[i].Liked_By__r.Image_URL__c, id : $scope.FeedLikesList[i].Liked_By__r.Id};
	  			
	  			$scope.contactList.push(row);
	  		}
	  		console.log('$scope.contactList : ' + JSON.stringify($scope.contactList));
	  		userStore.setContactList($scope.contactList);
	  		$state.go('app.contactslist');
	  	}
	}


    $scope.redirect = function(sfdcId){
    	userStore.getSelectedContact(sfdcId,function(data){
		//console.log(JSON.stringify(data))	
			$scope.selContact.name = data.selectedContact.Name;
			$scope.selContact.email = data.selectedContact.Email;
			$scope.selContact.imageurl = data.selectedContact.Image_URL__c;	
			$scope.selContact.sfdcId = data.sfdcId;
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

	  $scope.openModal = function(feedId) {
	  	
	    $scope.modal.show();
		
	  };

	  $scope.closeModal = function() {
	    $scope.modal.hide();
	  };

	 $scope.isSubmitInProcess = false; 
	$scope.submitAward = function(taker,comment){
		$scope.isSubmitInProcess = true;

		feedStore.submitAward($scope.UserInfo.sfdcId,$scope.selContact.sfdcId,comment,function(){
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