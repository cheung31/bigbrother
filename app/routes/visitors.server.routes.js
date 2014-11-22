'use strict';

/**
 * Module dependencies.
 */

module.exports = function(app) {
    // Visitors
	var visitors = require('../../app/controllers/visitors.server.controller');

	app.route('/api/visitors')
        .get(visitors.list)
	    .post(visitors.create);
};
