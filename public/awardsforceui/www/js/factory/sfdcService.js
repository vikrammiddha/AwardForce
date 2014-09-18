var sfdcFactory=angular.module('sfdcService',['sfdcFactory']);

sfdcFactory.factory('feedStore',['feedFactory',function(feedFactory){
		
		return {
			getAwardFeeds: function(callback){
				feedFactory.getFeeds(function(err,data){
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
			}
		}
}]);