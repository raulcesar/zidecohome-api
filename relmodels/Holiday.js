'use strict';
var zidecoseq = require('../zidecoseq');

module.exports = function(models) {
    zidecoseq.define(models, 'Holiday', {
        day: {
            type: 'date',
            time: false,
            required: true
        },
        description: {
            type: 'text',
            size: 1000
        }
    });
};
