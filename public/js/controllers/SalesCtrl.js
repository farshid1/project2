angular.module('SalesCtrl', ['SalesService'])
.controller('SalesController', function ($scope, SalesService) {
  
  $scope.inventory = [];
  $scope.newCustomer = {};
  $scope.editCustomer = {};
  $scope.numLimit = 10;
  $scope.showAddCustomer = false;
  $scope.showEditCustomer = false;
  $scope.showResult = false;

  $scope.searchItem = function() {
    SalesService.getProducts($scope.query)
    .then(
      function(response) {
        console.log(response.data);
        $scope.showResult = true;
        $scope.inventory = angular.copy(response.data);
        //alert('data loaded');
      },
      function () {
        alert('failed');
      }
    );
  };


  $scope.showAddCustomerForm = function() {
    $scope.showAddCustomer = true;
  };

  $scope.showEditCustomerForm = function(item) {
    $scope.showEditCustomer = true;
    console.log(item);
    $scope.editCustomer.upc = item;
  };
  
  
});