angular.module('AdminCtrl', ['AdminService']).controller('AdminController', function ($scope, $rootScope, AdminService) {
 // $scope.inventory = {};
 console.log($rootScope.user,"toot scope");
  console.log($scope.user,"toot scope");
  
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