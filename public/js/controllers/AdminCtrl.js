angular.module('AdminCtrl', ['AdminService','UserService'])
.controller('AdminController', function ($scope, $rootScope,$location, AdminService, mySocket, UserService) {
 // $scope.inventory = {};
 console.log($rootScope.user,"toot scope");
  console.log($scope.user,"toot scope");

    mySocket.on('notification', function (data) {
    console.log("in admin");
    $("#notifications").append(
      '<li class="'+data.title+'"> <b>'+data.quantity+'</b> of a new item <b>'+data.name+'</b> was added to the inventory for: $<b>'+data.price+'</b></li>'
      );
  });
  

  $scope.logOut = function() {
    UserService.logOut()
    .then
    (
      function(response) {
        console.logOut(response.data);
        $location.path('/login');
      },
      function(response) {
        console.log("something wrong happened", response.data);
      }
    )
  };

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


  $scope.addUSer = function() {
    console.log($rootScope.user,"toot scope");
    console.log($scope.user,"toot scope");
    AdminService.addUser($scope.user)
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