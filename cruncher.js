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
var d = 500,
	i = 500,
	j = 500;

Rssi.find({'processed': false}).exec(function(err, rssis) {

	var macs = {};
	var macTimeBuckets = {};
	var macTimeNode = {};

	// Break up by MAC address
	rssis.forEach(function(rssi) {
		if (!macs[rssi.mac]) macs[rssi.mac] = [];
		macs[rssi.mac].push(rssi);
	});

	// Break up into time buckets
	_.forIn(macs, function(value, key) {
		macTimeBuckets[key] = {};
		macs[key].forEach(function(rssi) {
			var timeBucket = (new Date(Math.round(5 * Math.round(rssi.created / 5)))).toString();
			if (!macTimeBuckets[key][timeBucket]) macTimeBuckets[key][timeBucket] = [];
			macTimeBuckets[key][timeBucket].push(rssi);
		});
	});

	// Calculate approximate distances to each node/router
	_.forIn(macTimeBuckets, function(value1, mac) {
		macTimeNode[mac] = {};
		_.forIn(macTimeBuckets[mac], function(value2, timeBucket) {
			macTimeNode[mac][timeBucket] = {};
			var totalDistance = {};
			var count = {};
			macTimeBuckets[mac][timeBucket].forEach(function(rssi) {
				// approximate distance in cm
				totalDistance[rssi.router] = (totalDistance[rssi.router] || 0) + Math.pow(10, -(rssi.rssi + 2.425) / 23.28);
				count[rssi.router] = (count[rssi.router] || 0) + 1;
			});

			_.forIn(totalDistance, function(dist, router) {
				if (count[router] > 0)
					macTimeNode[mac][timeBucket][router] = dist / count[router];
			});
		});
	});

	var locations = [];

	_.forIn(macTimeNode, function(value1, mac) {
		_.forIn(macTimeNode[mac], function(value2, timeBucket) {
			if (_.size(macTimeNode[mac][timeBucket]) >= 3) {
				var x = (pow(value2['1'], 2) - pow(value2['2'], 2) + pow(d, 2)) / (2*d);
				var y = ((pow(value2['1'], 2) - pow(value2['3'], 2) + pow(i, 2) + pow(j, 2)) / (2*j)) - (i*x/j);
				var location = new Visitor({id: mac, created: timeBucket, x: x, y: y});
				locations.push(location);
			}
		});
	});

	if (locations.length <= 0) {
		console.log('No locations calculated');
		process.exit(0);
	}

	Visitor.create(locations, function(err) {
		if (err)
			process.exit(1);
		else
			process.exit(0);
	});
});
