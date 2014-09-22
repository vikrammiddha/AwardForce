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
				 			console.log('===data1==' + JSON.stringify(data.fiList));
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
				 			console.log('===toppers data1==' + JSON.stringify(data));
		  					callback(data);
				 		}
				 		
				 	}
	  			});
			}
		}
}]);

sfdcFactory.factory('userStore',['userFactory',function(userFactory){
		
		var UserInfo = {};

		return {
			setUserInfo: function(callback){
				userFactory.getUserInfo(function(err,data){
				 	if(err) {
				 		var errorMessage = err.message || 'Servers temporarily not available. Please try after sometime..';
				 		alert(errorMessage);
				 		callback(null);
				 	} else {
				 		if(data === null || data === ''){
				 			alert('Servers temporarily not available. Please try after sometime.');
				 		}else{
				 			UserInfo = data;
		  					callback(data);
				 		}
				 		
				 	}
	  			});
			},
			getUserInfo:function(){
				return UserInfo;
			}
		}
}]);


sfdcFactory.factory('likeStore',['feedFactory', function(feedFactory){

		var likesMap = {};
		var likesCountMap = {};
		var commentsCountMap = {};
		
		return {
			prepareLikesMap: function(UserInfo, feeds){
				angular.forEach(feeds, function(value, key) {	
					var likeCounter = 0;
					angular.forEach(value.Feed_Likes__r, function(v, k) {
						
						angular.forEach(v, function(vv, kk) {
							likeCounter++;
							console.log('Feed Likes == ' + JSON.stringify(vv.Liked_By__c) + '==' + JSON.stringify(kk));
							console.log('liked By == ' + vv.Liked_By__c + '===' + UserInfo.sfdcId );
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
			prepareCommentsCountMap:function(feeds){
				angular.forEach(feeds, function(value, key) {	
					var commentCounter = 0;
					angular.forEach(value.Feed_Comments__r, function(v, k) {
						
						angular.forEach(v, function(vv, kk) {
							commentCounter++;
							
						}); 
					}); 
					commentsCountMap[value.Id] = commentCounter;
				});
			},
			getCommentsCountMap: function(){
				return commentsCountMap;
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
			}
		}
}]);