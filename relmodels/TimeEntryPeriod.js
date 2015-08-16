'use strict';
var zidecoseq = require('../zidecoseq');
var Q = require('q');

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
            required: false
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

    TimeEntryPeriod.deleteUserEntriesOnPeriod = function(userID, startDate, endDate, callback) {
        //We can use ORM to delete entries, by using a find and chaining a remove (like below).
        //However, this generates 1 select that returns ids of timeentries and then a delete with an "in" clause.
        //I find this to be inefficient, so I will instead use a raw query.
        //     var query = {
        //     user_id: userId,
        //     and: [{
        //         entryTime: orm.gte(startDate)
        //     }, {
        //         entryTime: orm.lt(endDate)
        //     }]
        // };
        var deferred = Q.defer();
        var pars = [userID, startDate, endDate];
        var sql = 'delete from "' + models.TimeEntryPeriod.table + '" where "user_id" = ? and "dayReference" >= ? and "dayReference" < ? ';
        models.db.driver.execQuery(sql, pars, function(err, data) {
            if (callback) {
                callback(err, data);
            }

            if (err) {
                deferred.reject(err);
                return;
            }

            deferred.resolve(data);
        });
        return deferred.promise;

    };
    

    var postprocess = function() {
        var optsForUserAssoc = {
            reverse: 'timeperiods',
            required: true
        };

        TimeEntryPeriod.hasOne('user', models.ZidecoUser, optsForUserAssoc);
        TimeEntryPeriod.hasOne('startEntry', models.TimeEntry);
        TimeEntryPeriod.hasOne('endEntry', models.TimeEntry);
    };

    return postprocess;
};


