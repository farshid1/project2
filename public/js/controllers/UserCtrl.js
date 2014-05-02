angular.module('UserCtrl', ['UserService']).controller('UserController', ['$scope','$rootScope', 'UserService',

    function ($scope, $rootScope, UserService) {

    	$scope.user = {};
        $rootScope.isLoggedin = false;
        
    	$scope.submit = function(formData) {
    		$scope.master = angular.copy(formData);

    		UserService.postData($scope.master)
    		.then (
    			function(r) {
				console.log(r.data.role);
                $rootScope.role = r.data.role;

                
				//$scope.restaurants = angular.copy(r.data);
				//alert('data loaded');
			},
			function () {
				alert('failed')
			}
    		)
    	}



    }
]);