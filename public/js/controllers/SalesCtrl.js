angular.module('SalesCtrl', ['SalesService'])
.controller('SalesController', function ($scope, $http, limitToFilter, SalesService) {
  
  $scope.inventory = [];
  $scope.items = [];
  $scope.newCustomerMaster = {};
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
    return SalesService.getCustomers(customer)
    .then(
      function(response) {
        if (response.data.message) {
          console.log(response.data.message);
        }
        else {
          console.log(response.data);
          for (var i = 0; i < response.data.length; i++ ) {
            $scope.customers.push(response.data[i]);
          }
          return $scope.customers;
        }
        
      },
      function(response) {
        console.log(response.data);
      }
    );
  };

  $scope.addCustomerToOrder = function($item) {

    $scope.customer = angular.copy($item);
    console.log($scope.customer);
    // SalesService.getCustomer(customerID)
    // .then (
    //   function(response) {
    //     $scope.customer = angular.copy(response.data[0]);
    //   },
    //   function(response) {

    //   }
    // );
  };

  $scope.addCustomer= function() {
    $scope.newCustomerMaster = angular.copy($scope.newCustomer);
    console.log($scope.newCustomerMaster);
    SalesService.addCustomer($scope.newCustomerMaster)
    .then (
      function(response) {
        if(response.data.message) {
          console.log(response.data.message);
        }
        else {
          $scope.newCustomerMaster = {}
          $scope.reset();
          console.log("new customer added")

        }
        
      },
      function(response) {
        console.log("failed");
      }
    );
  };

  $scope.reset = function() {
    $scope.newCustomer = angular.copy($scope.newCustomerMaster);
  };
  $scope.searchItem = function() {
    console.log($scope.query.length);
    if($scope.query.length > 1) {
      SalesService.getProducts($scope.query)
      .then(
        function(response) {
          //console.log(typeof(response.data));
          console.log(response.data.length,"response length");
          if(response.data.length !== 0) {
            $scope.showResult = true;
            $scope.inventory = angular.copy(response.data);
          }
          
          //alert('data loaded');
        },
        function () {
          alert('failed');
        }
      );
    }
    else {
      $scope.showResult = false;
    }
  };


  $scope.showAddCustomerForm = function() {
    $scope.showAddCustomer = true;
  };

  $scope.showEditCustomerForm = function(item) {
    $scope.showEditCustomer = true;
    console.log(item);
    $scope.editCustomer.upc = item;
  };

  $scope.addProductToInvoice = function($item) {
    
    var newItem = {
      customerId: $scope.customer._id,
      comment: "",
      totalPrice: $item.price,
      upc: $item.price,
      productName: $item.name,
      quantity: $item.quantity
    };
    console.log($item);
    $scope.showInvoice = true;
    $scope.disableAddButton = true;
    $scope.items.push($item);
    console.log($scope.items);

    SalesService.addToOrder($item)
    .then(
      function(response) {
        //console.log(response.data);
        $scope.showInvoice = true;
        $scope.inventory = angular.copy(response.data);
        //alert('data loaded');
      },
      function () {
        alert('failed');
      }
    );
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