angular.module('SalesCtrl', ['SalesService', 'UserService'])
.controller('SalesController', function ($scope, $http, $rootScope, $location, limitToFilter, SalesService, UserService, mySocket) {

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
  $scope.showCustomerDetails = false;
  $scope.showPendingOrders = true;




  $scope.grandTotal = function() {
    var total = 0;
    angular.forEach($scope.orders, function(order) {
        total += order.quantity * order.price;
    })

    return total;
  }

  //mySocket.emit('my other event', { my: 'data' });
  mySocket.on('notification', function (data) {
    console.log("messageId");
    console.log(data.quantity);
        console.log("in notification:")
          console.log(data);
        $("#notifications").append('<li class="'+data.title+'"> <b>'+data.quantity+'</b> of a new item <b>'+data.name+'</b> was added to the inventory for: $<b>'+data.price+'</b></li>');
  });

  $scope.finalize = function() {
    SalesService.finalizeOrder({customerId: $scope.customer._id})
    .then(
      function(response) {
        $scope.showOrder = false;
        $scope.showCustomerDetails = false;
        $scope.customer = {};
        $scope.orders = [];
        
      },
      function(response) {

      }
    );
  };
  $scope.showAllPendingOrders = function() {
    $scope.showAddCustomer = false;
    $scope.showEditCustomer = false;
    $scope.showResult = false;
    $scope.showOrder = false;
    $scope.disableAddButton = false;
    $scope.showSearchProduct = false;
    $scope.showSearchCustomer = true;
    $scope.showCustomerDetails = false;
    $scope.showPendingOrders = true;
    
    SalesService.getPendingOrders()
    .then
    (
      function(response) {
        console.log(response,"pending stuff");
        $scope.pendingOrders = [];
        $scope.pendingOrders = angular.copy(response.data);
      },
      function(response) {
        //console.log
      }
    );
  };  

  //add this init inventory ctrl
  $scope.init = function() {
    UserService.postData({})
    .then(
      function(response) {
        console.log(response.data, "from user service post");
          if(response.data.message) {
              console.log(response.data.message);
              $location.path('/login');
          }
          else {
              // $rootScope.user = angular.copy(response.data);
              // $rootScope.isLoggedin = true;
              //console.log(response.data.role);

              switch(response.data.role) {

                  case 1:
                      $location.path('/admin');
                      break;
                  case 2:
                    SalesService.getPendingOrders()
                    .then
                    (
                      function(response) {
                        console.log(response,"pending stuff");
                        $scope.pendingOrders = [];
                        $scope.pendingOrders = angular.copy(response.data);
                      },
                      function(response) {
                        //console.log
                      }
                    );
                    break;
                  case 3:
                      $location.path('/inventory');
                      break;
                  default:
                      $location.path('/login');
                      break;
              }


          }
      },
      function(response) {

      }
    );
   
    
  };
  $scope.getPendingOrder = function(order) {
    //console.log(order.products);
    SalesService.getCustomer(order.customerId)
    .then(
      function(response) {
        console.log(response.data);
        $scope.customer = angular.copy(response.data);
        $scope.addCustomerToOrder($scope.customer);
        $scope.showPendingOrders = false;
        $scope.showOrder = true;
        $scope.orders = [];
        $scope.orders = angular.copy(order.products);
        

      },
      function(response) {
        
      }
    );
  };
  $scope.searchCustomer = function(customerId) {
    SalesService.getCustomer(customerId)
    .then(
      function(response) {
        //console.log(response.data);
        $scope.customer = angular.copy(response.data);
      },
      function(response) {
        
      }
    );
  };
  $scope.saveCustomer = function() {
    console.log('saving cys');
    SalesService.editCustomer($scope.customer)
    .then
    (
      function(response) {
        //console.log(response.data);
        //$scope.customer = angular.copy(response.data);
        if(response.data.message) {
          alert("customer saved");
        }
      },
      function(response) {
        
      }
    );
  };

  $scope.removeCustomer = function() {
    //console.log($scope.customerQuery);
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
          //console.log($scope.customers);
          for (var i = 0; i < response.data.length; i++ ) {
            $scope.customers.push(response.data[i]);
          }
          return $scope.customers;
        }
        
      },
      function(response) {
        //console.log(response.data);
      }
    );
  };

  $scope.addCustomerToOrder = function($item) {

    console.log($item,"customer persumably");
    $scope.orders = [];
    $scope.showOrder = false;
    $scope.customer = angular.copy($item);
    $scope.showSearchCustomer = false;
    $scope.showSearchProduct = true;
    $scope.showCustomerDetails = true;
    $scope.showPendingOrders = false;

    //console.log($scope.customer);
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
          
          console.log(response.data, "res data from search item");
          $scope.products = [];
          _.each(response.data, function(product){
            var flag = false;
            for(var i = 0; i < $scope.orders.length; i++) {
              if($scope.orders[i].upc === product.upc) {
                flag = true;
              }
            }
            if(!flag) {
              $scope.products.push(product);
            }
          });
          $scope.showResult = true;
        
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
    $scope.showAddCustomer = !$scope.showAddCustomer;
    $scope.showOrder = false;
    $scope.showResult = false;
    $scope.showPendingOrders = false;
    $scope.showSearchProduct = false;
  };

  $scope.showEditCustomerForm = function(item) {
    $scope.showEditCustomer = true;
    //console.log(item);
    $scope.editCustomer.upc = item;
  };

  $scope.addProductToOrder = function($item) {
    console.log($scope.grandTotal());
    var newItem = {
      customerId: $scope.customer._id,
      comment: "",
      totalPrice: $scope.grandTotal(),
      upc: $item.upc,
      productName: $item.name,
      quantity: $item.quantity,
      customerName: $scope.customer.firstName + ' ' + $scope.customer.lastName,
      price: $item.price
    };
    console.log(newItem,"new item");
    //console.log($scope.customer, "customer");
    
    $scope.showOrder = true;
    $scope.disableAddButton = true;
    $scope.orders.push($item);
    //console.log($scope.orders);

    SalesService.addToOrder(newItem)
    .then(
      function(response) {
        var send = newItem;
        send.notifyRole = 3;
        send.title = "inventory_sold";
        mySocket.emit('notify', send);
        console.log(response.data, "response from server");
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


  $scope.checkQuantity = function(data, qty) {
   
    if(data > qty) {
      return "You cannot exceed the max quantity";
    }
    if(data < 0) {
      return "You cannot have negative values for quantity";
    }
  };



  $scope.editItem = function(item){
    var item = {
      customerId: $scope.customer._id,
      comment: '',
      totalPrice: $scope.grandTotal(),
      upc: item.upc,
      productName: item.name,
      quantity: item.quantity,
      price: item.price,
      customerName: item.firstName + ' ' + item.lastName,
      closeOrder: $scope.orders.length === 1 ? '1' : '0'
    };

    SalesService.editOrder(item)
    .then(
      function(response) {
        console.log(response.data, "response from server");
        
      },
      function () {
        alert('failed');
      }
    );
  };
  // remove item
  $scope.removeItem = function(index, item) {
    
    $scope.orders.splice(index, 1);
    console.log($scope.orders.length,"orders length *****");
    var item = {
      customerId: $scope.customer._id,
      comment: '',
      totalPrice: $scope.grandTotal(),
      upc: item.upc,
      productName: item.name,
      quantity: item.quantity,
      price: item.price,
      customerName: item.firstName + ' ' + item.lastName,
      closeOrder: $scope.orders.length === 1 ? '0' : '1'
    };

    console.log(item.closeOrder,"close order");
    SalesService.deleteOrder(item)
    .then(
      function(response) {
        
        if($scope.orders.length === 0) {
          $scope.showOrder = false;
        }
        // console.log(response.data);
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



  $scope.logOut = function() {
    UserService.logOut()
    .then
    (
      function(response) {
        console.log(response.data);
        $location.path('/login');
      },
      function(response) {
        console.log("something wrong happened", response.data);
      }
    )
};
  
});