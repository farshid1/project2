angular.module('AdminCtrl', [])
.controller('AdminController', function ($scope, $rootScope, $location, $timeout, AdminService, mySocket, UserService) {
 // $scope.inventory = {};
 console.log($scope.currentUser,"current user scope");
  console.log($scope.user,"toot scope");

    mySocket.on('notification', function (data) {
    console.log("in admin");
    $("#notifications").append(
      '<li class="list-group-item'+' '+data.title+'"> <b>'+data.quantity+'</b> of a new item <b>'+data.name+'</b> was added to the inventory for: $<b>'+data.price+'</b></li>'
      );
  });
  

  $scope.logOut = function() {
    UserService.logOut()
    .then
    (
      function(response) {
        $location.path('/login');
      },
      function(response) {
        console.log("something wrong happened", response.data);
      }
    )
  };

  $scope.init = function() {
    console.log("tryiiiiing");
    UserService.postData({})
    .then(
      function(response) {
        console.log(response.data, "from user service post");
          if(response.data.message) {
              console.log(response.data.message);
              $location.path('/login');
          }
          else {
              $scope.currentUser = angular.copy(response.data);
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


  $scope.addUser = function(newUser) {
    console.log(newUser);
    AdminService.addUser(newUser)
    .then(
      function(r) {
        console.log(r.data);
        $scope.newUser = [];
        $scope.userAdded = true;
        if (r.data.message === 'This user name already exists') {
          $scope.message = r.data.message;
          $scope.danger = true;
        }
        if (r.data.message === 'The user has been added') {
          $scope.message = r.data.message;
          $scope.success = true;
        }
        $timeout(function(){
          $scope.userAdded = false;
        }, 5000);
        
      },
      function () {

        //alert('failed');
      }
    );
  };
  
});