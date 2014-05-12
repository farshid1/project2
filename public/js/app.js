window.routes =
{
    "/": {
        redirectTo: '/login'
	},
    "/login": {
        title: 'Login',
        templateUrl: 'views/login.html',
		controller: 'UserController'
    },
    "/sales": {
        title: 'Sales',
        templateUrl: 'views/sales.html',
		controller: 'SalesController'
	},
    "/inventory": {
        title: 'Inventory',
        templateUrl: 'views/inventory.html',
		controller: 'InventoryController'
    },
    "/admin": {
        title: 'Admin',
        templateUrl: 'views/admin.html',
		controller: 'AdminController'
    }
};

angular.module('inventoryApp', 
	['ngRoute', 'appRoutes', 'btford.socket-io', 'ui.bootstrap', 'xeditable', 'SessionService', 'UserCtrl', 'InventoryCtrl', 'AdminCtrl', 'AdminService', 'SalesCtrl', 'InventoryService', 'SalesService', 'UserService', 'mySocket'])
.run(function(editableOptions) {
  editableOptions.theme = 'bs3'; 

});



