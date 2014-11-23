'use strict';

angular.module('dashboard').directive('retailRocketHeatmap', ['Visitors',
	function(Visitors) {
		return {
			restrict: 'E',
			scope: {},
			replace: true,
			link: function (scope, element, attrs) {
				// Constants
				var	pixelToMapYRatio = 575 / 751;
				var pixelsPerMetre = 150 / 8.80872;
				var originXpixel = 400,
					originYpixel = 100;

				scope.find = function() {
					scope.visitors = Visitors.all.query();
				};

				var svg = d3.select(element[0])
				            .append('svg')
				            .attr('width', 600)
				            .attr('height', 575)
				            .attr('x', 0)
				            .attr('y', 0);

			    var floorplan = svg.append('svg:image')
											.attr('xlink:href', 'http://i.imgur.com/czBvsER.png')
											.attr('width', 600)
											.attr('height', 575)
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
							                  .append('circle')
							                  .filter(function (d) { return d.x > 0});

					// var circleAttributes = circles.attr('cx', function (d) { return originXpixel; })
					// 		                      .attr('cy', function (d) { return originYpixel * pixelToMapYRatio; })
					// 		                      .attr('r', 10)
					// 		                      .style('fill', 'red');
					var circleAttributes = circles.attr('cx', function (d) { return (d.x / 100) * pixelsPerMetre + originXpixel; })
							                      .attr('cy', function (d) { return ((d.y / 100) * pixelsPerMetre + originYpixel) * pixelToMapYRatio; })
							                      .attr('r', 8)
							                      .style('fill', 'red')
							                      .style('opacity', 0.5);
				};
			}
		};
	}
]);
