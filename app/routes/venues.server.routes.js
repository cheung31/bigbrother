'use strict';

/**
 * Module dependencies.
 */

module.exports = function(app) {
    // Venues
	var venues = require('../../app/controllers/venues.server.controller');

	app.route('/api/venues')
        .get(venues.list)
		.post(venues.create);

	app.route('/api/venues/:venueId')
		.get(venues.read);
		//.put(venues.update)
		//.delete(venues.delete);
};
