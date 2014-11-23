'use strict';

angular.module('dashboard').directive('retailRocketHeatmap',
	function() {
		return {
			restrict: 'E',
			scope: {visitors: '='},
			link: function (scope, element, attrs) {
				var heatmap = d3.select(element[0]);

				var svgContainer = heatmap.append('svg')
										  .attr('width', 600)
				       					  .attr('height', 751);

			    var floorplan = svgContainer.append('svg:image')
											.attr('xlink:href', 'http://i.imgur.com/czBvsER.png')
											.attr('width', 600)
											.attr('height', 751);

				var circles = floorplan.selectAll('circle')
						                  .data(scope.visitors)
						                  .enter()
						                  .append('circle');

				var circleAttributes = circles.attr('cx', function (d) { return d.x; })
						                      .attr('cy', function (d) { return d.y; })
						                      .attr('r', 10)
						                      .style('fill', 'red');
				console.log(scope.visitors[0]);
			}
		};
	}
);