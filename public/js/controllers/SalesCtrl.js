angular.module('SalesCtrl', ['SalesService'])
.controller('SalesController', function ($scope, $http, limitToFilter, SalesService) {
  
  $scope.inventory = [];
  $scope.newCustomer = {};
  $scope.editCustomer = {};
  $scope.customerId = '';
  $scope.customers = [];
  $scope.customer = {};
  $scope.numLimit = 10;
  $scope.showAddCustomer = false;
  $scope.showEditCustomer = false;
  $scope.showResult = false;

  $scope.searchCustomers = function(customer) {
    //return $http.jsonp("http://gd.geobytes.com/AutoCompleteCity?callback=JSON_CALLBACK &filter=US&q="+customer).then(function(response){
      //console.log(customer);
      SalesService.getCustomers(customer)
      .then(
        function(response) {
          //$scope.customers = angular.copy(response.data);
          console.log(response.data);
          if (response.data.message) {
            console.log(response.data.message);
          }
          else {
            return limitToFilter(response.data, 10);
          }
          
        },
        function(response) {
          console.log(response.data);
        }
      )
      // $scope.customerId = response.data[3].customerId;
  };

  $scope.addCustomerToInvoice = function(customerID) {
    SalesService.getCustomer(customerID)
    .then (
      function(response) {
        $scope.customer = angular.copy(response.data[0]);
      },
      function(response) {

      }
    )
  };

  $scope.addCustomer= function(formData) {
    SalesService.addCustomer(formData)
    .then (
      function(response) {
        if(response.data.message) {
          console.log(response.data.message);
        }
        else {
          console.log("faile")
        }
        
      },
      function(response) {

      }
    )
  };

  $scope.searchItem = function() {
    SalesService.getProducts($scope.query)
    .then(
      function(response) {
        //console.log(typeof(response.data));

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

  $scope.addProductToInvoice = function(product) {
    SalesService.addToCart(product)
    .then(
      function(response) {
        //console.log(response.data);
        $scope.showResult = true;
        $scope.inventory = angular.copy(response.data);
        //alert('data loaded');
      },
      function () {
        alert('failed');
      }
    )
  };
  
  
});