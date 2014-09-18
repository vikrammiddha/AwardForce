var sfdcFactory=angular.module('sfdcFactory',[]);

sfdcFactory.factory('feedFactory',function($http){
	return{
		getFeeds:function(callback){
		    $http.get('https://awardforce.secure.force.com/services/apexrest/awardfeeds').success(function(result){
		        	callback(null,result);
		        }).error(function(err){
		        	callback(err,null);
		    });
  		}
	}
});