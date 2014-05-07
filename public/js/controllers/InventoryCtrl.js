angular.module('InventoryCtrl', ['InventoryService'])
.controller('InventoryController', function ($scope, $http, InventoryService, limitToFilter, mySocket) {

  $scope.inventory = {};
  $scope.newItem = {};
  $scope.editItem = {};
  $scope.numLimit = 10;
  $scope.showAddItem = false;
  $scope.showEditItem = false;
  $scope.showResult = false;

  $scope.increment = function(product) {
      console.log("Inc");
      product.onHandQu++;
      //$scope.value++;
  }
  $scope.decrement = function(product) {
      console.log("Dec");
      product.onHandQu--;
  }

  mySocket.emit('my other event', { my: 'data' });
  mySocket.on('news', function (data) {
    console.log(data);
    mySocket.emit('my other event', { my: 'data' });
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
    console.log(item);
    $scope.editItem.upc = item.upc;
    $scope.editItem.name = item.name;
    $scope.editItem.quantity = item.onHandQu;
    $scope.editItem.price = item.price;
   // $scope.editItem.price = item.price;

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