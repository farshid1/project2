angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

	$routeProvider

		// // home page
		// .when('/', {redirectTo: '/login'})

		// .when('/login', {
		// 	templateUrl: 'views/login.html',
		// 	controller: 'UserController'
		// })

		// .when('/register', {
		// 	templateUrl: 'views/register.html',
		// 	controller: 'UserController'	
		// })

		// .when('/sales', {
		// 	templateUrl: 'views/sales.html',
		// 	controller: 'SalesController'	
		// })

		// .when('/inventory', {
		// 	templateUrl: 'views/inventory.html',
		// 	controller: 'InventoryController'	
		// })
		 //this loads up our routes dynamically from the previous object 
    for(var path in window.routes) {
        $routeProvider.when(path, window.routes[path]);
    }
    $routeProvider.otherwise({redirectTo: '/login'});

	$locationProvider.html5Mode(true);

}]);