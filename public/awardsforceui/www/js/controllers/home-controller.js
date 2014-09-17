angular.module('home-controller' , [])

.controller('homeController', function($scope ,  $ionicModal, $ionicPopup , $timeout) {
	$scope.Feeds = {
		"001" : {
			"Giver" : "Vikram Middha",
			"Taker" : "Gulshan Middha",
			"Time" : "01/01/2014 12:00:00",
			"LikesCount" : "101",
			"CommentsCount" : "22",
			"Description" : "Good job done"
		},
		"002" : {
			"Giver" : "Vikram Middha",
			"Taker" : "Vikas Malhotra",
			"Time" : "01/01/2014 12:00:00",
			"LikesCount" : "12",
			"CommentsCount" : "20",
			"Description" : "Great Job"
		}
	}
});

