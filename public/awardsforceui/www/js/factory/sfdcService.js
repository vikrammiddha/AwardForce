var sfdcFactory=angular.module('sfdcService',['sfdcFactory']);

sfdcFactory.factory('feedStore',['feedFactory',function(feedFactory){
		
		return {
			getAwardFeeds: function(userinfo, callback){
				feedFactory.getFeeds(userinfo, function(err,data){
				 	if(err) {
				 		var errorMessage = err.message || 'Servers temporarily not available. Please try after sometime..';
				 		alert(errorMessage);
				 		callback(null);
				 	} else {
				 		if(data === null || data === ''){
				 			alert('Servers temporarily not available. Please try after sometime.');
				 		}else{
				 			//console.log('===data1==' + JSON.stringify(data.fiList));
		  					callback(data);
				 		}
				 		
				 	}
	  			});
			},
			getToppers:function(callback){
				feedFactory.getToppers(function(err,data){
				 	if(err) {
				 		var errorMessage = err.message || 'Servers temporarily not available. Please try after sometime..';
				 		alert(errorMessage);
				 		callback(null);
				 	} else {
				 		if(data === null || data === ''){
				 			alert('Servers temporarily not available. Please try after sometime.');
				 		}else{
				 			//console.log('===toppers data1==' + JSON.stringify(data));
		  					callback(data);
				 		}
				 		
				 	}
	  			});
			},
			submitAward:function(giver,taker,comment,callback){
				feedFactory.submitAward(giver,taker,comment, function(err,data){
				 	if(err) {
				 		var errorMessage = err.message || 'Servers temporarily not available. Please try after sometime..';
				 		alert(errorMessage);
				 		callback(null);
				 	} else {
				 		if(data === null || data === ''){
				 			alert('Servers temporarily not available. Please try after sometime.');
				 		}else{
				 			//console.log('===toppers data1==' + JSON.stringify(data));
		  					callback(data);
				 		}
				 		
				 	}
	  			});
			}
		}
}]);

sfdcFactory.factory('userStore',['userFactory',function(userFactory){
		
		var UserInfo = {};
		var AllContacts = {};
		var loginStatus = '';
		var contactList = [];

		return {
			setUserInfo: function(userInfoData,callback){
				UserInfo = userInfoData;
				//console.log('==before user data 0==' + JSON.stringify(UserInfo));
				userFactory.getUserInfo(userInfoData.name, userInfoData.email, userInfoData.imageurl,userInfoData.token, userInfoData.device, function(err,data){
				 	if(err) {
				 		var errorMessage = err.message || 'Servers temporarily not available. Please try after sometime..';
				 		alert(errorMessage);
				 		callback(null);
				 	} else {
				 		if(data === null || data === ''){
				 			alert('Servers temporarily not available. Please try after sometime.');
				 		}else{
				 			//console.log('==before user data==' + JSON.stringify(UserInfo));
				 			UserInfo['sfdcId'] = data.sfdcId;
				 			//alert('==after user data==' + JSON.stringify(UserInfo));
		  					callback(UserInfo);
				 		}
				 		
				 	}
	  			});
			},
			getUserInfo:function(){
				return UserInfo;
			},
			getAllContacts:function(userId,callback){
				userFactory.getAllContacts(userId,function(err,data){
				 	if(err) {
				 		var errorMessage = err.message || 'Servers temporarily not available. Please try after sometime..';
				 		alert(errorMessage);
				 		callback(null);
				 	} else {
				 		if(data === null || data === ''){
				 			alert('Servers temporarily not available. Please try after sometime.');
				 		}else{
				 			AllContacts = data;
		  					callback(data);
				 		}
				 		
				 	}
	  			});
			},
			setContactList:function(conList){
				contactList = conList;
			},
			getContactList:function(){
				return contactList;
			},
			getSelectedContact:function(sfdcId, callback){
				userFactory.getSelectedContact(sfdcId,function(err,data){
				 	if(err) {
				 		var errorMessage = err.message || 'Servers temporarily not available. Please try after sometime..';
				 		alert(errorMessage);
				 		callback(null);
				 	} else {
				 		if(data === null || data === ''){
				 			alert('Servers temporarily not available. Please try after sometime.');
				 		}else{
		  					callback(data);
				 		}
				 		
				 	}
	  			});
			},
			setLoginStatus:function(val){
				loginStatus = val;
			},
			getLoginStatus:function(){
				return loginStatus;
			}
		}
}]);


sfdcFactory.factory('likeStore',['feedFactory', function(feedFactory){

		var likesMap = {};
		var likesCountMap = {};
		var commentsMap = {};
		var commentsCountMap = {};
		
		return {
			prepareLikesMap: function(UserInfo, feeds){
				angular.forEach(feeds, function(value, key) {	
					var likeCounter = 0;
					angular.forEach(value.Feed_Likes__r, function(v, k) {
						
						angular.forEach(v, function(vv, kk) {
							likeCounter++;
							//console.log('Feed Likes == ' + JSON.stringify(vv.Liked_By__c) + '==' + JSON.stringify(kk));
							//console.log('liked By == ' + vv.Liked_By__c + '===' + UserInfo.sfdcId );
							if(vv.Liked_By__c === UserInfo.sfdcId){
								likesMap[value.Id] = "Unlike";
								
							} 
						}); 
					}); 

					if(!likesMap.hasOwnProperty(value.Id)){
						likesMap[value.Id] = "Like";
					}
					likesCountMap[value.Id] = likeCounter;
				});
				//console.log('Map == ' + JSON.stringify(likesMap));
				//console.log('===LikesCounterMap==' + JSON.stringify(likesCountMap));
			},
			prepareCommentsMap:function(feeds){
				angular.forEach(feeds, function(value, key) {	
					var commentCounter = 0;
					angular.forEach(value.Feed_Comments__r, function(v, k) {
						
						angular.forEach(v, function(vv, kk) {
							commentCounter++;
							
						}); 
					}); 
					commentsCountMap[value.Id] = commentCounter;
					commentsMap[value.Id] = 'hide';
				});
			},
			getCommentsCountMap: function(){
				return commentsCountMap;
			},
			setCommentsCountMap: function(feedId,val){
				commentsCountMap[feedId] = val;
			},
			getCommentsMap: function(){
				return commentsMap;
			},
			setCommentsMap:function(feedId,value){
				commentsMap[feedId] = value;
			},
			getLikesMap: function(){
				return likesMap;
			},
			setLikesMap: function(awardId, value){
				likesMap[awardId] = value;
			},
			getLikesCountMap: function(){
				return likesCountMap;
			},
			setLikesCountMap: function(awardId, val){
				likesCountMap[awardId] = val;
			},
			createdeleteLikeFromSFDC: function(action,UserInfo, feedId, done){
				feedFactory.createdeleteFeedLike(action, UserInfo, feedId, function(err,data){
					done();
				 	if(err != null) {
				 		var errorMessage = err.message || 'Servers temporarily not available. Please try after sometime..';
				 		alert(errorMessage);
				 		
				 	} else {
				 		if(data === null || data === ''){
				 			alert('Servers temporarily not available. Please try after sometime.');
				 		}else{
				 			UserInfo = data;
		  					
				 		}
				 		
				 	}
	  			});
			},
			postComment: function(commentRequest,done){
				feedFactory.postComment(commentRequest, function(err,data){
					done();
				 	if(err != null) {
				 		var errorMessage = err.message || 'Servers temporarily not available. Please try after sometime..';
				 		alert(errorMessage);
				 		
				 	} else {
				 		if(data === null || data === ''){
				 			alert('Servers temporarily not available. Please try after sometime.');
				 		}else{
				 			
				 		}
				 		
				 	}
	  			});
			}
		}
}]);