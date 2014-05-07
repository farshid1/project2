window.routes =
{
    "/": {
        templateUrl: 'views/login.html',
		controller: 'UserController', 
        requireLogin: false
	},
    "/login": {
        templateUrl: 'views/login.html',
		controller: 'UserController',
        requireLogin: false
    },
    "/logout": {
        templateUrl: 'views/login.html',
        controller: 'UserController',
        requireLogin: false
    },
    "/sales": {
        templateUrl: 'views/sales.html',
		controller: 'SalesController', 
        requireLogin: false
	},
    "/inventory": {
        templateUrl: 'views/inventory.html',
		controller: 'InventoryController',
        requireLogin: false
    },
    "/admin": {
        templateUrl: 'views/admin.html',
		controller: 'AdminController',
        requireLogin: false
    }
};

angular.module('inventoryApp', 
	['ngRoute', 'appRoutes', 'btford.socket-io', 'ui.bootstrap', 'xeditable', 'SessionService', 'UserCtrl', 'InventoryCtrl', 'AdminCtrl', 'AdminService', 'SalesCtrl', 'InventoryService', 'SalesService', 'UserService', 'mySocket'])
.run(function(editableOptions) {
  editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
//   $rootScope.$on("$locationChangeStart", function(event, next, current) {
//     for(var i in window.routes) {
//         if(next.indexOf(i) != -1) {
//             if(window.routes[i].requireLogin && !SessionService.getUserAuthenticated()) {
//                 alert("You need to be authenticated to see this page!");
//                 event.preventDefault();
//             }
//         }
//     }
// });

});



