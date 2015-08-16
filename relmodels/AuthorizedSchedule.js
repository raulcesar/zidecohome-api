'use strict';
var zidecoseq = require('../zidecoseq');

/**
    This entity represents an authorized schedule for normal dates

*/
module.exports = function(models) {
    var AuthorizedSchedule = zidecoseq.define(models, 'AuthorizedSchedule', {

        hourStart: {
            type: 'integer',
            size: 4
        },
        hourFinish: {
            type: 'integer',
            size: 4
        },
        minuteStart: {
            type: 'integer',
            size: 4
        },
        minuteFinish: {
            type: 'integer',
            size: 4
        },

        description: {
            type: 'text',
            size: 200
        }
    });

    var postprocess = function() {
        var userXauthorizedSchedule = {
            startDate: {
                type: 'date',
                required: true
            },
            endDate: {
                type: 'date'
            }
        };

        var opts = {
            reverse: 'authorizedSchedules',
            reverseAddAccessor: 'addAuthorizedSchedule', //This is only valid in my version!
            key: true,
            addAccessor: 'addUser',
            mergeTable: 'userXauthorizedSchedule',
            mergeId: 'authorizedSchedule_id',
            mergeAssocId: 'user_id'
        };

        AuthorizedSchedule.hasMany('users', models.ZidecoUser, userXauthorizedSchedule, opts);



        // TimeEntryPeriod.hasOne('startEntry', models.TimeEntry);
        // TimeEntryPeriod.hasOne('endEntry', models.TimeEntry);
    };

    return postprocess;

};

