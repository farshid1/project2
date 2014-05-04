'use strict';

angular.module('InventoryService', []).factory('InventoryService',['$http','$q', function( $http, $q) {



	return { 
		getProducts: function(formData) {
			// return $http({
			// 	url: '/api/inventory/search',
			// 	data: JSON.stringify(formData),
			// 	method: 'POST',
			// 	header: {'Content-Type':'application/json'}
			// });
			return $http.jsonp("http://gd.geobytes.com/AutoCompleteCity?callback=JSON_CALLBACK &filter=US&q="+formData);

		},
		addItem: function(formData) {
			return $http({
				url: '/api/inventory/addItem',
				data: JSON.stringify(formData),
				method: 'POST',
				header: {'Content-Type':'application/json'}
			});
		}
	}

}]);