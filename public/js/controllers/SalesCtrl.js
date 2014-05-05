angular.module('SalesCtrl', ['SalesService'])
.controller('SalesController', function ($scope, $http, limitToFilter, SalesService) {
  
  $scope.inventory = [];
  $scope.items = [];
  $scope.newCustomer = {};
  $scope.editCustomer = {};
  $scope.customerId = '';
  $scope.customers = [];
  $scope.customer = {};
  $scope.numLimit = 10;
  $scope.showAddCustomer = false;
  $scope.showEditCustomer = false;
  $scope.showResult = false;
  $scope.showInvoice = false;
  $scope.disableAddButton = false;



  //$scope.checkUpc = function()
  $scope.searchCustomers = function(customer) {
      console.log(customer);
        SalesService.getCustomers(customer)
        .then(
          function(response) {
            if (response.data.message) {
              console.log(response.data.message);
            }
            else {
              //$scope.customers = angular.copy(response.data.message);
              $scope.searchCustomers = limitToFilter(response.data, 10);
            }
            
          },
          function(response) {
            console.log(response.data);
          }
        );
  };

  $scope.addCustomerToInvoice = function(customerID) {
    SalesService.getCustomer(customerID)
    .then (
      function(response) {
        $scope.customer = angular.copy(response.data[0]);
      },
      function(response) {

      }
    );
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
    );
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
    
    $scope.showInvoice = true;
    $scope.disableAddButton = true;
    $scope.items.push(product);
    console.log($scope.items);

    // SalesService.addToCart(product)
    // .then(
    //   function(response) {
    //     //console.log(response.data);
    //     $scope.showInvoice = true;
    //     $scope.inventory = angular.copy(response.data);
    //     //alert('data loaded');
    //   },
    //   function () {
    //     alert('failed');
    //   }
    // );
  };
  $scope.disableButton = function() {
    return false;
  };









  $scope.checkName = function(data, id) {
    if (id === 2 && data !== 'awesome') {
      return "Username 2 should be `awesome`";
    }
  };

  $scope.saveItem = function(data, id) {
    //$scope.user not updated yet
    angular.extend(data, {id: id});
    return $http.post('/saveUser', data);
  };

  // remove user
  $scope.removeItem = function(index) {
    $scope.users.splice(index, 1);
  };

  // add user
  $scope.addItem = function() {
    $scope.inserted = {
      id: $scope.users.length+1,
      name: '',
      status: null,
      group: null 
    };
    $scope.users.push($scope.inserted);
  };

  
});