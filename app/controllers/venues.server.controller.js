'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    Venue = mongoose.model('Venue'),
    _ = require('lodash');

/**
 * Create a Venue
 */
exports.create = function(req, res) {
    var venue = new Venue(req.body);
    venue.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(venue);
        }
    });
};

/**
 * Read a venue
 */
exports.read = function(req, res) {
    Venue.find({ id: req.id }, function (err, venue) {
        if (err) {
            return res.status(404).send({
                message: errorHandler.getErrorMessage(err)
            });
        } 

        if (venue) {
            res.json(venue);
        }
    });
};

/**
 * List of Venues
 */
exports.list = function(req, res) {
    Venue.find()
        .sort('-created')
        .exec(function(err, venues) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                res.json(venues);
            }
        });
};
