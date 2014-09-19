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
  		deleteFeedLike:function(userinfo,feedId,callback){
  			var headers = { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' };
  			var url = 'https://awardforce.secure.force.com/services/apexrest/awardfeeds?sfdcId=' + userinfo.sfdcId + '&feedId='+feedId ;

  			$http.delete(url).success(function(result){
		        	callback(null,result);
		        }).error(function(err){
		        	callback(err,null);
		    });
  		}
	}
});

sfdcFactory.factory('userFactory',function($http){
	return{
		getUserInfo:function(callback){
		    var UserInfo = {
		    	name : "Vikram Middha",
		    	email : "vikram.middha@makepositive.com",
		    	sfdcId : "003w000001FM0Z5AAL"
		    };
		    callback(null, UserInfo);
  		}
	}
});