angular.module('InventoryCtrl', ['InventoryService', 'UserService'])
.controller('InventoryController', function ($scope, $http,$location, InventoryService, limitToFilter, mySocket, UserService) {

  $scope.inventory = {};
  $scope.newItem = {};
  $scope.editItem = {};
  $scope.numLimit = 10;
  $scope.showAddItem = false;
  $scope.showEditItem = false;
  $scope.showResult = false;

  $scope.init = function() {
    UserService.postData({})
    .then(
      function(response) {
        console.log(response.data, "from user service post");
          if(response.data.message) {
              console.log(response.data.message);
          }
          else {

              switch(response.data.role) {

                  case 1:
                      $location.path('/admin');
                      break;
                  case 2:
                    $location.path('/sales');
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

  $scope.increment = function(product) {
      console.log("Inc");
      product.quantity++;
      //$scope.value++;
  }
  $scope.decrement = function(product) {
      console.log("Dec");
      product.quantity--;
  }
  var messageId;
  //mySocket.emit('my other event', { my: 'data' });
  mySocket.on('notification', function (data) {
    console.log("messageId");
    console.log(data.quantity);
    if(data.messageId !== messageId){
        messageId = data.messageId;
        console.log("in notification:")
        if(data.quantity){
          console.log(data);
        $("#notifications").append('<li class="'+data.title+'"> <b>'+data.quantity+'</b> of a new item <b>'+data.name+'</b> was added to the inventory for: $<b>'+data.price+'</b></li>');
      }}
  });

  // $scope.products = function(product) {
  //   return $http.jsonp("http://gd.geobytes.com/AutoCompleteCity?callback=JSON_CALLBACK &filter=US&q="+product).then(function(response){
  //     //console.log('what up');
  //     return limitToFilter(response.data, 15);
  //   });
  // };
  $scope.searchItem = function() {
    //console.log($scope.query);
    // if ($scope.query.length < 3) {
    //   console.log('lesss than');
    //   $scope.showResult = false;
    // }
    InventoryService.getProducts($scope.query)
    .then(
      function(r) {
        console.log(r.data);
        $scope.showResult = true;
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
  };

  $scope.showEditForm = function(item) {
    $scope.showEditItem = true;
    //console.log(item);
    $scope.editItem.upc = item.upc;
    $scope.editItem.name = item.name;
    $scope.editItem.quantity = item.quantity;
    $scope.editItem.price = item.price;
   // $scope.editItem.price = item.price;

  };

  $scope.addItem = function(newItem) {

    console.log("in here");
    InventoryService.addItem(newItem)
    .then(
      function(r) {
        var send = r.data;
        send.notifyRole = 2;
        send.title = "added_inventory";
        mySocket.emit('notify', send);
        // console.log("********************");
        // console.log(r.data);
        // console.log("********************");

        //$scope.inventory = angular.copy(r.data);
        alert('item saved');
      },
      function () {

        alert('failed');
      }
    );
  };
  
});