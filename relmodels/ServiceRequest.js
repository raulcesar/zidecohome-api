'use strict';
var zidecoseq = require('../zidecoseq');

module.exports = function(models) {
    var ServiceRequest = zidecoseq.define(models, 'ServiceRequest', {
        serviceCategory: {
            type: 'text',
            size: 100
        },
        serviceName: {
            type: 'text',
            size: 100
        },

        observation: {
            type: 'text',
            size: 4000
        },

        status: {
            type: 'enum',
            values: ['pending', 'finished', 'failed'],
            defaultValue: 'pending',
            required: true
        }
    });

    return;
};
