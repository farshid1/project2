angular.module('InventoryCtrl', ['InventoryService']).controller('InventoryController', function ($scope, InventoryService) {
  $scope.inventory = {};
  $scope.newItem = {};

  $scope.searchItem = function(query) {
    InventoryService.getProduct(query)
    .then(
      function(r) {
        console.log(r.data);
        
        $scope.inventory = angular.copy(r.data);
        //alert('data loaded');
      },
      function () {

        alert('failed');
      }
    );
  };

  $scope.addItem = function(newItem) {
    InventoryService.addItem(newItem)
    .then(
      function(r) {
        console.log(r.data);
        
        //$scope.inventory = angular.copy(r.data);
        alert('item saved');
      },
      function () {

        alert('failed');
      }
    );
  };
  
});