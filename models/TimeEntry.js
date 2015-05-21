'use strict';
var zidecoseq = require('../zidecoseq');
var Q = require('q');


module.exports = function(models) {
    var TimeEntry = zidecoseq.define(models, 'TimeEntry', {
        entryTime: {
            type: 'date',
            time: true,
            required: true
        },

        origin: {
            type: 'enum',
            values: ['manual', 'imported', 'transposed', 'scraped'],
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

    TimeEntry.deleteUserEntriesOnPeriod = function(userID, startDate, endDate, callback) {
        //We can use ORM to delete entries, by using a find and chaining a remove (See TimeEntryService for commented example anc caveat.)

        var deferred = Q.defer();
        var pars = ['unprocessed', userID, startDate, endDate];
        var sql = 'delete from "' + models.TimeEntry.table + '" where "status" = ? and "user_id" = ? and "entryTime" >= ? and "entryTime" < ? ';
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
        var opts = {
            reverse: 'timeentries',
            required: true
        };

        TimeEntry.hasOne('user', models.ZidecoUser, opts);
    };



    return postprocess;
};
