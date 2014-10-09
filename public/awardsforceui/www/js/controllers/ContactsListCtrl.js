angular.module('ContactsListModule', ['sfdcService'])
  .controller('ContactsListCtrl', ['$scope', '$state', 'userStore', function ($scope, $state, userStore) {
    
    $scope.contactsList = userStore.getContactList();
    
  }]);