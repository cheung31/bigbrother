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

Rssi.find({'processed': false}).exec(function(err, rssis) {
	var macs = {};
	var macTimeBuckets = {};

	// Break up by MAC address
	rssis.forEach(function(rssi) {
		rssi.distance = Math.pow(10, -(rssi.rssi + 2.425) / 23.28);
		if (!macs[rssi.mac]) macs[rssi.mac] = [];
		macs[rssi.mac].push(rssi);
	});

	// Break up into time buckets
	_.forIn(macs, function(value, key) {
		macTimeBuckets[key] = {};
		macs[key].forEach(function(rssi) {
			var timeBucket = (new Date(Math.round(5 * Math.round(rssi.created / 5)) * 1000)).toString();
			console.log(timeBucket)
			if (!macTimeBuckets[key][timeBucket]) macTimeBuckets[key][timeBucket] = [];
			macTimeBuckets[key][timeBucket].push(rssi);
		});
	});

	

	console.log(macTimeBuckets);
	process.exit(0);
});
