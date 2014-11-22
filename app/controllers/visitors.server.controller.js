'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Visitor = mongoose.model('Visitor'),
	_ = require('lodash');

/**
 * Create a visitor
 */
exports.create = function(req, res) {
	var visitor = new Visitor();
    visitor.x = req.x;
    visitor.y = req.y;
    visitor.id = req.id;

	visitor.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(visitor);
		}
	});
};

/**
 * List of Visitors
 */
exports.list = function(req, res) {
	Visitor.find()
        .sort('-created')
        .exec(function(err, visitors) {
	        if (err) {
	        	return res.status(400).send({
	        		message: errorHandler.getErrorMessage(err)
	        	});
	        } else {
	        	res.json(visitors);
	        }
	    });
};
