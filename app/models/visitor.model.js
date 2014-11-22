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
 * Hook a pre save method to hash the password
 */
VisitorSchema.pre('save', function(next) {
    if (this.id) {
        this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
        this.id = this.hashMacAddress(this.id);
    }

    next();
});

/**
 * Create instance method for hashing a password
 */
VisitorSchema.methods.hashMacAddress = function(macAddress) {
    if (this.salt && macAddress) {
        return crypto.pbkdf2Sync(macAddress, this.salt, 10000, 64).toString('base64');
    } else {
        return macAddress;
    }
};

mongoose.model('Visitor', VisitorSchema);
