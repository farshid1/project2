angular.module('AdminCtrl', ['AdminService']).controller('AdminController', function ($scope, AdminService) {
 // $scope.inventory = {};
  $scope.newUSer = {};

  
  $scope.addUSer = function(newUser) {
    AdminService.addService(newUser)
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