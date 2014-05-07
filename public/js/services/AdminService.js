'use strict';

//Articles service used for articles REST endpoint
angular.module('AdminService', []).factory('AdminService',['$http','$q', function( $http, $q) {



	return { 
		addUser: function(formData) {
			return $http({
				url: '/api/user/add',
				data: JSON.stringify(formData),
				method: 'POST',
				header: {'Content-Type':'application/json'}
			});
		}
	}

}]);