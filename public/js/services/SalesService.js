'use strict';

angular.module('SalesService', [])
.factory('SalesService',['$http','$q', function( $http, $q) {



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
		addCustomer: function(formData) {
			return $http({
				url: '/api/user/add',
				data: JSON.stringify(formData),
				method: 'POST',
				header: {'Content-Type':'application/json'}
			});
		}
	}

}]);