angular.module('SalesCtrl', ['SalesService'])
.controller('SalesController', function ($scope, $http, limitToFilter, SalesService) {

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
  $scope.showSearchProduct = false;
  $scope.showSearchCustomer = true;


  $scope.removeCustomer = function() {
    console.log($scope.customerQuery);
    // if ($scope.customerQuery.length === 0) {
    //   $scope.customer = {};
    // }
  }
  $scope.searchCustomers = function(customer) {
      
    return SalesService.getCustomers(customer)
    .then(
      function(response) {
        if (response.data.message) {
          //console.log(response.data.message);
        }
        else {
          //console.log(response.data);
          if($scope.customers.length > 0) {
            $scope.customers = [];
          }
          console.log($scope.customers);
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
    $scope.showSearchCustomer = false;
    $scope.showSearchProduct = true;
    //console.log($scope.customer);
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
    //console.log($scope.newCustomerMaster);
    SalesService.addCustomer($scope.newCustomerMaster)
    .then (
      function(response) {
        if(response.data.message) {
          //console.log(response.data.message);
        }
        else {
          $scope.newCustomerMaster = {}
          $scope.reset();
          //console.log("new customer added")

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

  $scope.searchItem = function(query) {
    //console.log(query);
    if(query.length > 0) {
      SalesService.getProducts(query)
      .then(
        function(response) {
          var orderArray = angular.copy(angular.fromJson(angular.toJson($scope.orders)));
          var responseArray = angular.copy(angular.fromJson(angular.toJson(response.data)));
          console.log(orderArray, "this is the order");
          console.log(responseArray, "this is the response");
          console.log(_.difference(responseArray, orderArray));
          // console.log(angular.toJson($scope.orders), " orders to Json");
          // console.log(angular.toJson(response.data), " response to Json");

           //console.log(angular.fromJson(angular.toJson($scope.orders)), " orders from Json");
           //console.log(angular.fromJson(angular.toJson(response.data)), " response to Json");
          //console.log(_.difference(response.data, angular.toJson($scope.orders)));
//           var bIds = {};
//           angular.fromJson(angular.toJson($scope.orders)).forEach(function(obj){
//     bIds[obj.upc] = obj;
// });
          //console.log(angular.fromJson(angular.toJson(response.data)).filter(function(obj){return !(obj.upc in bIds);}));
          $scope.showResult = true;
          $scope.products = angular.copy(_.difference(angular.fromJson(angular.toJson(response.data)), angular.fromJson(angular.toJson($scope.orders))));
            
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
    //console.log(item);
    $scope.editCustomer.upc = item;
  };

  $scope.addProductToOrder = function($item) {
    
    var newItem = {
      customerId: $scope.customer._id,
      comment: "",
      totalPrice: $item.price,
      upc: $item.price,
      productName: $item.name,
      quantity: $item.onHandQu
    };
    //console.log($item);
    //console.log($scope.customer, "customer");
    $scope.showOrder = true;
    $scope.disableAddButton = true;
    $scope.orders.push($item);
    //console.log($scope.orders);

    SalesService.addToOrder(newItem)
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


  $scope.editItem = function(item){
    var item = {
      customerId: $scope.customer._id,
      comment: '',
      totalPrice: item.price,
      upc: item.upc,
      productName: item.name,
      quantity: item.quantity,
      price: item.price,
      customerName: item.firstName + ' ' + item.lastName,
      closeOrder: $scope.orders.length === 1 ? '1' : '0'
    };
  }
  // remove item
  $scope.removeItem = function(index, item) {
    
    var item = {
      customerId: $scope.customer._id,
      comment: '',
      totalPrice: item.price,
      upc: item.upc,
      productName: item.name,
      quantity: item.quantity,
      price: item.price,
      customerName: item.firstName + ' ' + item.lastName,
      closeOrder: $scope.orders.length === 1 ? '1' : '0'
    };

    console.log(item);
    SalesService.deleteOrder(item)
    .then(
      function(response) {
        if($scope.orders.length > 0) {
          $scope.orders.splice(index, 1);
          $scope.showOrder = false;
        }
        else {
          $scope.orders.splice(index, 1);
        }
        console.log(response.data);
      },
      function(response) {
        console.log(response.data);
      }
    );
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