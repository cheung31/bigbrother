'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Rssi = mongoose.model('Rssi'),
	_ = require('lodash');

/**
 * Create a rssi
 */
exports.create = function(req, res) {
    if (req.body.length) {
        Rssi.collection.insert(req.body, {}, function(err) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                res.json(rssi);
            }
        });
    } else {
	    var rssi = new Rssi(req.body);
        rssi.save(function(err) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                res.json(rssi);
            }
        });
    }
};

/**
 * List of Visitors
 */
exports.list = function(req, res) {
    Rssi.find()
        .sort('-created')
        .exec(function(err, rssis) {
	        if (err) {
	        	return res.status(400).send({
	        		message: errorHandler.getErrorMessage(err)
	        	});
	        } else {
	        	res.json(rssis);
	        }
	    });
};
