'use strict';
var zidecoseq = require('../zidecoseq');


module.exports = function(models) {
    var TimeEntry = zidecoseq.define(models, 'TimeEntry', {
        entryTime: {
            type: 'date',
            time: true,
            required: true
        },

        origin: {
            type: 'enum',
            values: ['manual', 'imported', 'transposed'],
            defaultValue: 'transposed',
            required: true
        },
        status: {
            type: 'enum',
            values: ['valid', 'invalid', 'canceled', 'unprocessed'],
            defaultValue: 'unprocessed',
            required: true
        }
    });

    var postprocess = function() {
        var opts = {
            reverse: 'timeentries',
            required: true
        };

        TimeEntry.hasOne('user', models.ZidecoUser, opts);
    };



    return postprocess;
};
