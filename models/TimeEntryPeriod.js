'use strict';
var zidecoseq = require('../zidecoseq');

/**
This entity represents a time period delimited by a start and end period.
*/
module.exports = function(models) {
    var TimeEntryPeriod = zidecoseq.define(models, 'TimeEntryPeriod', {
        startTime: {
            type: 'date',
            time: true,
            required: true
        },
        endTime: {
            type: 'date',
            time: true,
            required: true
        },
        dayReference: {
            type: 'date',
            required: true
        },
        rawMinutes: {type: 'integer', size: 4},
        validMinutes:  {type: 'integer', size: 4},
        origin: {
            type: 'enum',
            values: ['generated', 'manual'],
            defaultValue: 'generated',
            required: true
        },
        status: {
            type: 'enum',
            values: ['consolidated', 'canceled', 'new'],
            defaultValue: 'new',
            required: true
        }

    });

    var postprocess = function() {
        var optsForUserAssoc = {
            reverse: 'timeperiods',
            required: true
        };

        TimeEntryPeriod.hasOne('user', models.ZidecoUser, {}, optsForUserAssoc);
        TimeEntryPeriod.hasOne('startEntry', models.TimeEntry);
        TimeEntryPeriod.hasOne('endEntry', models.TimeEntry);
    };

    return postprocess;
};


