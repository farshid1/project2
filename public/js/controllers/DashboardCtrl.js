angular.module('DashboardCtrl', ['UserService']).controller('DashboardController', ['$scope',  'UserService',

    function ($scope, UserService) {

    	$scope.user = {};

    	$scope.submit = function(formData) {
    		console.log($scope.user);
    		$scope.master = angular.copy(formData);

    		UserService.postData($scope.master)
    		.then (
    			function(r) {
				console.log(r.data);
                
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