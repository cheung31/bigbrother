 'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
	crypto = require('crypto');

/**
 * Visitor Schema
 */
var VisitorSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    x: {
        type: Number,
        default: 0
    },
    y: {
        type: Number,
        default: 0
    },
    id: {
        type: String
    }
});

/**
 * Hook a pre save method to hash the mac address
 */
VisitorSchema.pre('save', function(next) {
    if (this.id) {
        this.id = this.hashMacAddress(this.id);
    }

    next();
});

/**
 * Create instance method for hashing a mac address
 */
VisitorSchema.methods.hashMacAddress = function(macAddress) {
    if (macAddress) {
        return crypto.createHash('md5').update(macAddress).digest('hex');
    } else {
        return macAddress;
    }
};

mongoose.model('Visitor', VisitorSchema);
