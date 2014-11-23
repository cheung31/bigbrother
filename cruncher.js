// #!/bin/env node
'use strict';

var mongoose = require('mongoose'),
	_ = require('lodash'),
	async = require('async');

var db = mongoose.connect('mongodb://localhost/retail-rocket-dev', function(err) {
	if (err) {
		console.error(chalk.red('Could not connect to MongoDB!'));
		console.log(chalk.red(err));
	}
});

require('./app/models/rssi.model.js');
require('./app/models/visitor.model.js');

var Rssi = mongoose.model('Rssi');
var Visitor = mongoose.model('Visitor');

// Distances between routers in cm
var d = 880,
	i = 518,
	j = 1968;

// var rssi = new Rssi({'mac': 'fakemac', 'rssi': -65, 'processed': false, created: Date.now()});
// rssi.save(function(err) {
// 	console.log(err);
// });
async.waterfall([function(next) {
	Rssi.find({'processed': false}).limit(25000).exec(function(err, rssis) {
		var macs = {};
		var macTimeBuckets = {};
		var macTimeNode = {};
		var distances = {};

		// Break up by MAC address
		rssis.forEach(function(rssi) {
			if (!macs[rssi.mac]) macs[rssi.mac] = [];
			macs[rssi.mac].push(rssi);
		});

		// Break up into time buckets
		_.forIn(macs, function(value, key) {
			macTimeBuckets[key] = {};
			macs[key].forEach(function(rssi) {
				var timeBucket = (new Date(Math.round(5000 * Math.round(rssi.created / 5000)))).toString();
				if (!macTimeBuckets[key][timeBucket]) macTimeBuckets[key][timeBucket] = [];
				macTimeBuckets[key][timeBucket].push(rssi);
			});
		});

		// Calculate approximate distances to each node/router
		_.forIn(macTimeBuckets, function(value1, mac) {
			macTimeNode[mac] = {};
			_.forIn(macTimeBuckets[mac], function(value2, timeBucket) {
				macTimeNode[mac][timeBucket] = {};

				macTimeBuckets[mac][timeBucket].forEach(function(rssi) {
					if (!macTimeNode[mac][timeBucket][rssi.router]) macTimeNode[mac][timeBucket][rssi.router] = [];
					macTimeNode[mac][timeBucket][rssi.router].push(rssi);
				});
			});
		});
		
		_.forIn(macTimeNode, function(value1, mac) {
			distances[mac] = {};
			_.forIn(macTimeNode[mac], function(value2, timeBucket) {
				distances[mac][timeBucket] = {};
				_.forIn(macTimeNode[mac][timeBucket], function(value3, router) {
					distances[mac][timeBucket][router] = 0;

					var sortedRssis = _.sortBy(macTimeNode[mac][timeBucket][router], function(rssi) { return rssi.rssi; });
					var medianDistance = 0;
					if (sortedRssis.length === 1) {
						medianDistance = Math.pow(10, -(sortedRssis[0].rssi + 2.425) / 23.28);
					} else if (sortedRssis.length % 2 === 0) {
						var rssi1 = sortedRssis[(sortedRssis.length / 2) - 1].rssi;
						var rssi2 = sortedRssis[sortedRssis.length / 2].rssi;
						var dist1 = Math.pow(10, -(rssi1 + 2.425) / 23.28);
						var dist2 = Math.pow(10, -(rssi2 + 2.425) / 23.28);
						medianDistance = (dist1 + dist2) / 2;
					} else {
						var medianRssi = sortedRssis[Math.floor(sortedRssis.length / 2)].rssi;
						medianDistance = Math.pow(10, -(medianRssi + 2.425) / 23.28);
					}

					distances[mac][timeBucket][router] = medianDistance;
					// console.log('mac: ' + mac + ' time: ' + timeBucket + ' router: ' + router + ' dist: ' + medianDistance);
				});
			});
		});
		

		console.log(distances);

		var locations = [];

		_.forIn(distances, function(value1, mac) {
			_.forIn(distances[mac], function(value2, timeBucket) {
				if (_.size(distances[mac][timeBucket]) >= 3) {
					var x = (Math.pow(value2['1'], 2) - Math.pow(value2['2'], 2) + Math.pow(d, 2)) / (2*d);
					var y = ((Math.pow(value2['1'], 2) - Math.pow(value2['3'], 2) + Math.pow(i, 2) + Math.pow(j, 2)) / (2*j)) - (i*x/j);
					console.log('x: ' + x + ' y: ' + y);
					var location = new Visitor({id: mac, created: timeBucket, x: x, y: y});
					console.log(location);
					locations.push(location);
				}
			});
		});

		if (locations.length <= 0) {
			console.log('No locations calculated');
			next(null, rssis);
		}

		Visitor.create(locations, function(err) {
			next(err, rssis);
		});
	});
}, function(rssis, next) {
	async.times(rssis.length, function(i, next) {
		rssis[i].processed = true;
		rssis[i].save(function(err) {
			next(err);
		});
	}, function(err) {
		next(err);
	});
}], function(err) {
	if (err)
		process.exit(1);
	else
		process.exit(0);
});


