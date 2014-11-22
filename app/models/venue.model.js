 'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    uuid = require('node-uuid');

/**
 * Venue Schema
 */
var VenueSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    image_url: {
        type: String
    },
    width: {
        type: Number
    },
    height: {
        type: Number
    },
    name: {
        type: String
    },
    id: {
        type: String,
        default: uuid.v4()
    }
});

mongoose.model('Venue', VenueSchema);
