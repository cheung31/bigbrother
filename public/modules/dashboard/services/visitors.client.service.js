'use strict';

angular.module('dashboard').factory('Visitors', ['$resource',
	function($resource) {
		return {
            all: $resource('visitors'),
            historical: $resource(
                'visitors',
                { since: '@since', until: '@until' }
            )
        };
	}
]);
