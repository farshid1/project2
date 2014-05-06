angular.module('SalesCtrl', ['SalesService'])
.controller('SalesController', function ($scope, $http, limitToFilter, SalesService) {
  
  //http://stackoverflow.com/questions/1187518/javascript-array-difference
  // Array.prototype.diff = function(a) {
  //   return this.filter(function(i) {return a.indexOf(i) < 0;});
  // };


  $scope.products = [];
  $scope.orders = [];
  $scope.newCustomerMaster = {};
  $scope.editCustomer = {};
  $scope.customerId = '';
  $scope.customers = [];
  $scope.customer = {};
  $scope.numLimit = 10;
  $scope.showAddCustomer = false;
  $scope.showEditCustomer = false;
  $scope.showResult = false;
  $scope.showOrder = false;
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
    //console.log($scope.query);
    if($scope.query.length > 1) {
      SalesService.getProducts($scope.query)
      .then(
        function(response) {
          console.log(_.difference(angular.fromJson(angular.toJson(response.data)), angular.fromJson(angular.toJson($scope.orders))));
          // console.log(angular.toJson($scope.orders), " orders to Json");
          // console.log(angular.toJson(response.data), " response to Json");

          // console.log(angular.fromJson(angular.toJson($scope.orders)), " orders from Json");
          // console.log(angular.fromJson(angular.toJson(response.data)), " response to Json");
          //console.log(_.difference(response.data, angular.toJson($scope.orders)));
          $scope.showResult = true;
          $scope.products = angular.copy(_.difference(angular.fromJson(angular.toJson(response.data)), angular.fromJson(angular.toJson($scope.orders))));
          //console.log($scope.products);

          // if($scope.orders.length === 0 && response.data.length > 0) {
          //   $scope.products = angular.copy(response.data);
          // }
          // else {
          //   if(response.data.length > 0) {
          //     console.log("what up");
          //     for(var i = 0; i < response.data.length; i++) {

                
          //       for(var j = 0; j < $scope.orders.length; j++) {
          //         if($scope.orders[j].upc !== response.data[i].upc) {
          //           $scope.showResult = true;
          //           $scope.orders.push(response.data[i])
          //         }
          //       }
                
          //     }
          //   }
          // }
            
          
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

  $scope.addProductToOrder = function($item) {
    
    // var newItem = {
    //   customerId: $scope.customer._id,
    //   comment: "",
    //   totalPrice: $item.price,
    //   upc: $item.price,
    //   productName: $item.name,
    //   quantity: $item.onHandQu
    // };
    //console.log($item);
    $scope.showOrder = true;
    $scope.disableAddButton = true;
    $scope.orders.push($item);
    //console.log($scope.orders);

    SalesService.addToOrder($item)
    .then(
      function(response) {
        //console.log(response.data);
        $scope.showResult = false;
        $scope.showOrder = true;
        //$scope.orders.push(response.data);
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