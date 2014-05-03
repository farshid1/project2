angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

	$routeProvider

		// home page
		.when('/', {
			templateUrl: 'views/inventory.html',
			controller: 'InventoryController'
		})

		.when('/login', {
			templateUrl: 'views/login.html',
			controller: 'UserController'
		})

		.when('/register', {
			templateUrl: 'views/register.html',
			controller: 'UserController'	
		})

		.when('/sales', {
			templateUrl: 'views/sales.html',
			controller: 'SalesController'	
		})

		.when('/inventory', {
			templateUrl: 'views/inventory.html',
			controller: 'InventoryController'	
		});

	$locationProvider.html5Mode(true);

}]);