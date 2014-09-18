angular.module('home-controller' , ['sfdcService'])

.controller('homeController',[ 'feedStore', '$scope', function(feedStore, $scope ,  $ionicModal, $ionicPopup , $timeout) {
	feedStore.getAwardFeeds(function(data){
		$scope.Feeds = data;	
	});

	$scope.doRefresh = function() {
		feedStore.getAwardFeeds(function(data){
			$scope.Feeds = data;	
			$scope.$broadcast('scroll.refreshComplete');
		});    
	};
}]);

