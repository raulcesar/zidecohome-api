'use strict';
var zidecoseq = require('../zidecoseq');

/**
    This entity represents an authorization to "validate" time entries during a certain period of time, that normally would
    be invalid.
    examples: "Noctornal Session", "Authorized overtime"
*/
module.exports = function(models) {
    var TimePeriodAuthorization = zidecoseq.define(models, 'TimePeriodAuthorization', {
        startAuthorization: {
            type: 'date',
            time: true,
            required: true
        },
        endAuthorization: {
            type: 'date',
            time: true,
            required: true
        },
        description: {
            type: 'text',
            size: 2000
        }
    });

    var postprocess = function() {
        var optsForUserAssoc = {
            reverse: 'timePeriodAuthorizations'
        };

        TimePeriodAuthorization.hasOne('user', models.ZidecoUser, {}, optsForUserAssoc);
    };

    return postprocess;

};
