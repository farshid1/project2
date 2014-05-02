'use strict';

//Articles service used for articles REST endpoint
angular.module('UserService', []).factory('UserService',['$http','$q', function( $http, $q) {



	return { 
		postData: function(formData) {
			return $http({
				url: '/api/user/login',
				data: JSON.stringify(formData),
				method: 'POST',
				header: {'Content-Type':'application/json'}
			});
		}
	}

}]);