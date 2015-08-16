'use strict';
var zidecoseq = require('../zidecoseq');
var Q = require('q');
var _ = require('lodash');


module.exports = function(models) {
    var validOrigins = ['manual', 'imported', 'transposed', 'scraped'];
    var validStatuses = ['valid', 'invalid', 'canceled', 'unprocessed'];
    var TimeEntry = zidecoseq.define(models, 'TimeEntry', {
        entryTime: {
            type: 'date',
            time: true,
            required: true
        },

        origin: {
            type: 'enum',
            values: validOrigins,
            defaultValue: 'transposed',
            required: true
        },
        status: {
            type: 'enum',
            values: validStatuses,
            defaultValue: 'unprocessed',
            required: true
        }
    });

    TimeEntry.getLastScrapedEntry = function(userIdOrFilter) {
        var deferred = Q.defer();
        var filter = {};
        if (userIdOrFilter) {
            if (_.isNumber(userIdOrFilter)) {
                filter.user_id = userIdOrFilter;
            } else {
                filter = userIdOrFilter;
            }
        }
        filter.origin = 'scraped';

        TimeEntry.aggregate(filter).max('entryTime').get(function(err, maxDate) {
            if (err) {
                deferred.reject(err);
                return;
            }

            deferred.resolve(maxDate);
        });
        return deferred.promise;
    };

    TimeEntry.deleteUserEntriesOnPeriod = function(userID, startDate, endDate, excludedOrigins, callback) {
        //We can use ORM to delete entries, by using a find and chaining a remove (See TimeEntryService for commented example and caveat.)

        var deferred = Q.defer();
        var pars = ['unprocessed', userID, startDate, endDate];
        var originSQL = '';
        var originsPars = [];
        if (!_.isEmpty(excludedOrigins)) {

            _.each(excludedOrigins, function(origin) {
                if (validOrigins.indexOf(origin) >= 0) {
                    originsPars.push('\'' + origin + '\'');
                }
            });
            if (!_.isEmpty(originsPars)) {
                originSQL = ' and origin not in (' + originsPars.join(', ') + ')';
            }
        }
        var sqlWhereClaus = ' where "status" = ? and "user_id" = ? and "entryTime" >= ? and "entryTime" < ? ' + originSQL;
        var sqlSelectTimeEntryIds = 'select id from "' + models.TimeEntry.table + '"' + sqlWhereClaus;



        //TODO: Beforme we delete TimeEntries, we need to delete Periods that point to the timeentries that WILL BE DELETED.
        var sqlDeleteFromTimeEntryPeriod = 'delete from "' + models.TimeEntryPeriod.table +
            '" where "startentry_id" is not null and "startentry_id" in (' + sqlSelectTimeEntryIds + ')' +
            ' or "endentry_id" is not null and "endentry_id" in (' + sqlSelectTimeEntryIds + ')';


        var sqlDeleteFromTimeEntry = 'delete from "' + models.TimeEntry.table + '" ' + sqlWhereClaus;

        models.db.driver.execQuery(sqlDeleteFromTimeEntryPeriod, pars.concat(pars), function(err, data) {
            if (callback) {
                callback(err, data);
            }

            if (err) {
                deferred.reject(err);
                return;
            }

            models.db.driver.execQuery(sqlDeleteFromTimeEntry, pars, function(err, data) {
                if (callback) {
                    callback(err, data);
                }

                if (err) {
                    deferred.reject(err);
                    return;
                }

                deferred.resolve(data);
            });

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
