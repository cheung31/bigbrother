'use strict';

module.exports = function(app) {
	var rssi = require('../../app/controllers/rssi.server.controller');

	app.route('/rssi')
        .get(rssi.list)
		.post(rssi.create);
};
