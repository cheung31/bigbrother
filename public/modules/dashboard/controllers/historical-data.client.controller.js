'use strict';

angular.module('dashboard').controller('HistoricalDataController', ['$scope',
	function($scope) {
        $scope.singleModel = 1;

        $scope.radioModel = 'Hourly';

        $scope.checkModel = {
          hourly: true,
          daily: false
        };
	}
]);
