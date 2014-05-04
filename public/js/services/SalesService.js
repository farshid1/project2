'use strict';

angular.module('SalesService', [])
.factory('SalesService',['$http','$q', function( $http, $q) {



	return { 
		getProducts: function(formData) {
			return $http({
				url: '/api/inventory/searchItem',
				data: {creteriaFE: formData},
				method: 'POST',
				header: {'Content-Type':'application/json'}
			});
			//return $http.jsonp("http://gd.geobytes.com/AutoCompleteCity?callback=JSON_CALLBACK &filter=US&q="+formData);

		},
		addCustomer: function(formData) {
			return $http({
				url: '/api/sales/addNewCustomer',
				data: JSON.stringify(formData),
				method: 'POST',
				header: {'Content-Type':'application/json'}
			});
		},
		getCustomers: function(formData) {
			return $http({
				url: '/api/sales/searchCustomer',
			 	data: {name: formData},
			 	method: 'POST',
			 	header: {'Content-Type':'application/json'}
			});
		},
		getCustomer: function(customerId) {
			return $http({
				url: '/api/sales/searchCustomer/'+customerId,
			 	method: 'GET',
			 	header: {'Content-Type':'application/json'}
			});
		}
	}

}]);