'use strict';

angular.module('dashboard').controller('DashboardController', ['$scope', 'Authentication', 'Visitors',
	function($scope, Authentication, Visitors) {
		// This provides Authentication context.
		$scope.authentication = Authentication;

		$scope.find = function() {
			$scope.visitors = Visitors.query();
		};
	}
]);