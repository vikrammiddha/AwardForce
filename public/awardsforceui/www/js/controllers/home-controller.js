angular.module('home-controller' , [])

.controller('homeController', function($scope ,  $ionicModal, $ionicPopup , $timeout) {
	$scope.contact = {

		FirstName : 'Vikram',
		LastName : 'Middha'
	};
});

