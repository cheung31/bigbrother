'use strict';

angular.module('dashboard').factory('Visitors', ['$resource',
	function($resource) {
		return $resource('visitors/:visitorId', {
			visitorId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);