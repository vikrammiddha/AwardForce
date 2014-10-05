var sfdcFactory=angular.module('sfdcFactory',[]);

sfdcFactory.factory('feedFactory',function($http){
	return{
		getFeeds:function(userinfo,callback){
		    $http.get('https://awardforce.secure.force.com/services/apexrest/awardfeeds?id=' + userinfo.sfdcId).success(function(result){
		        	callback(null,result);
		        }).error(function(err){
		        	callback(err,null);
		    });
  		},
  		createdeleteFeedLike:function(action,userinfo,feedId,callback){
  			//var headers = { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' };
  			var url = 'https://awardforce.secure.force.com/services/apexrest/awardfeeds?sfdcId='+userinfo.sfdcId  + '&feedId='+feedId + '&action='+action;

  			$http.post(url).success(function(result){
		        	callback(null,result);
		        }).error(function(err){
		        	callback(err,null);
		    });
  		},
  		postComment:function(commentRequest, callback){
  			console.log('===commentRequest===' + JSON.stringify(commentRequest));
  			var url = 'https://awardforce.secure.force.com/services/apexrest/awardfeeds?action=postComment&feedId='+commentRequest.feedId + '&createdBy='+commentRequest.createdBy + '&commentBody=' + commentRequest.commentBody;

  			$http.post(url).success(function(result){
		        	callback(null,result);
		        }).error(function(err){
		        	callback(err,null);
		    });
  		},
  		getToppers:function(callback){
  			$http.get('https://awardforce.secure.force.com/services/apexrest/awardfeeds').success(function(result){
		        	callback(null,result);
		        }).error(function(err){
		        	callback(err,null);
		    });
  		},
  		submitAward:function(giver,taker,comment, callback){
  			var url = 'https://awardforce.secure.force.com/services/apexrest/awardfeeds?action=submitAward&giver='+giver + '&taker='+taker + '&comment=' + comment;

  			$http.post(url).success(function(result){
		        	callback(null,result);
		        }).error(function(err){
		        	callback(err,null);
		    });
  		}
	}
});

sfdcFactory.factory('userFactory',function($http){
	
	return{
		getUserInfo:function(name,email,imageurl,token,device,callback){
			//alert('result Id :' + token + '--' + device);
			$http.get('https://awardforce.secure.force.com/services/apexrest/awardfeeds?action=setUserInfo&email=' + email + '&name=' + name + '&imageurl=' + imageurl + '&token='+token + '&device=' + device).success(function(result){
		        	//alert('=1= ' + JSON.stringify(result));
		        	callback(null,result);
		        }).error(function(err){
		        	//alert('===2=== ' + JSON.stringify(result));
		        	callback(err,null);
		    });
		    /*var UserInfo = {
		    	name : "Vikram Middha",
		    	email : "vikram.middha@makepositive.com",
		    	sfdcId : "003w000001FM0Z5AAL"
		    };*/
  		},
  		getAllContacts:function(userId,callback){
  			$http.get('https://awardforce.secure.force.com/services/apexrest/awardfeeds?action=getAllContacts&id='+userId).success(function(result){
		        	callback(null,result);
		        }).error(function(err){
		        	callback(err,null);
		    });
  		}
	}
});