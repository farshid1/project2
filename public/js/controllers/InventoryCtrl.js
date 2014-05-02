angular.module('InventoryCtrl', ['InventoryService'])
.controller('InventoryController', function ($scope, $http, InventoryService, limitToFilter) {

  $scope.inventory = {};
  $scope.newItem = {};
  $scope.numLimit = 10;
  $scope.showAddItem = false;

  $scope.products = function(product) {
    return $http.jsonp("http://gd.geobytes.com/AutoCompleteCity?callback=JSON_CALLBACK &filter=US&q="+product).then(function(response){
      console.log('what up');
      return limitToFilter(response.data, 15);
    });
  };
  $scope.searchItem = function() {
    //console.log($scope.query);
    InventoryService.getProducts($scope.query)
    .then(
      function(r) {
        //console.log(r.data);
        
        $scope.inventory = angular.copy(r.data);
        //alert('data loaded');
      },
      function () {

        alert('failed');
      }
    );
  };

  $scope.showAddForm = function() {
    $scope.showAddItem = true;
  }

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