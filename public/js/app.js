angular.module('inventoryApp', 
	['ngRoute', 'appRoutes', 'btford.socket-io', 'ui.bootstrap', 'xeditable', 'UserCtrl', 'InventoryCtrl', 'SalesCtrl', 'InventoryService', 'SalesService', 'UserService', 'mySocket'])
.run(function(editableOptions) {
  editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
});
