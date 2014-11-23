'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
	crypto = require('crypto');

/**
 * RSSI Schema
 */
var RssiSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    router: {
        type: Number
    },
    rssi: {
        type: Number
    },
    name: {
        type: String
    },
    mac: {
        type: String
    }
});

/**
 * Hook a pre save method to hash the mac address
 */
RssiSchema.pre('save', function(next) {
    if (this.mac) {
        this.mac = this.hashMacAddress(this.mac);
    }

    next();
});

/**
 * Create instance method for hashing a mac address
 */
RssiSchema.methods.hashMacAddress = function(macAddress) {
    if (macAddress) {
        return crypto.createHash('md5').update(macAddress).digest('hex')
    } else {
        return macAddress;
    }
};

mongoose.model('Rssi', RssiSchema);
