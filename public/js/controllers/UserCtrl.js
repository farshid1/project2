angular.module('UserCtrl', ['UserService', 'mySocket']).controller('UserController', 
    function ($scope, $rootScope, $location, UserService, mySocket) {


          mySocket.emit('my other event', { my: 'data' });
          mySocket.on('news', function (data) {
            console.log(data);
            mySocket.emit('my other event', { my: 'data' });
          });

    	$scope.user = {};
        $rootScope.isLoggedin = false;
        $rootScope.user = {};
        
    	$scope.submit = function(formData) {
    		$scope.master = angular.copy(formData);

    		UserService.postData($scope.master)
    		.then (
    			function(r) {
				console.log(r.data.role);
                $rootScope.user = angular.copy(r.data);
                switch($rootScope.user.role) {
                    case 1:
                        //$location.replace('/inventory');
                        // $scope.$apply(function() {
                        //     $location.path("/admin");
                        //     console.log($location.path());
                        //   });
                        // console.log("hey admin");
                        $location.path('/admin');
                        break;
                    case 2:
                        $location.path('/sales');
                        break;
                    case 3:
                        $location.path('/inventory');
                }
               
                
                
				//$scope.restaurants = angular.copy(r.data);
				//alert('data loaded');
			},
			function () {
				alert('failed')
			}
    		)
    	}



    }
);