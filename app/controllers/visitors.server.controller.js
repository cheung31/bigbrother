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
	var visitor = new Visitor(req.body);

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
    var visitors;
    var createdQuery = {};

    if (Object.keys(req.query).length) {
        if (req.query.until) {
            createdQuery['$lte'] = new Date(req.query.until);
        }
        if (req.query.since) {
            createdQuery['$gte'] = new Date(req.query.since);
        }

        visitors = Visitor.find({
            created: createdQuery
        });
    } else {
        //// Show visitors within last 10 minutes by default
	    //visitors = Visitor.find({
        //    created: { '$gte': new Date(Date.now() - (60 * 10 * 1000)) }
        //});
	    visitors = Visitor.find();
    }

    visitors
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
