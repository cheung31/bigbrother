'use strict';

angular.module('dashboard').directive('retailRocketHeatmap', ['Visitors',
	function(Visitors) {
		return {
			restrict: 'E',
			scope: {},
			replace: true,
			link: function (scope, element, attrs) {
				scope.find = function() {
					scope.visitors = Visitors.query();
				}

				var svg = d3.select(element[0])
				            .append('svg')
				            .style('width', 600)
				            .style('height', 751);

			    var floorplan = svg.append('svg:image')
											.attr('xlink:href', 'http://i.imgur.com/czBvsER.png')
											.attr('width', 600)
											.attr('height', 751)
											.attr('x', 0)
											.attr('y', 0);

	            // watch for data changes and re-render on changes
				scope.$watch('visitors', function (newVals, oldVals) {
					if (newVals) {
						return scope.render(newVals);
					}
				}, true);

				setInterval(function() { scope.find() }, 1000);

				// define render function
				scope.render = function (data) {
					// remove all previous items before render
					svg.selectAll('circle').remove();

					var circles = svg.selectAll('circle')
							                  .data(scope.visitors)
							                  .enter()
							                  .append('circle');

					var circleAttributes = circles.attr('cx', function (d) { return d.x; })
							                      .attr('cy', function (d) { return d.y; })
							                      .attr('r', 10)
							                      .style('fill', 'red');
				};
			}
		};
	}
]);