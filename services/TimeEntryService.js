'use strict';
var moment = require('moment');
var _ = require('lodash');
var Q = require('q');
// var zidecoUtils = require('../infra/zidecoUtils');

/**
    This function will process all time entries and generate TimeEntryPeriods for the date period passed in.
*/

var calculateminutes = function(timePeriod) {
    var rawMinutes = moment(timePeriod.endTime).diff(moment(timePeriod.startTime), 'minutes');
    timePeriod.rawMinutes = rawMinutes;
    timePeriod.validMinutes = rawMinutes;


    // rawMinutes: DataTypes.INTEGER,
    // validMinutes: DataTypes.INTEGER,


};

var minHour = 7; //7 horas (minimal)
var minDeltaEntries = 5; //5 minutes before considering an entry as "diferent"
var nocturnalSessionInterval = {
    startHour: 19,
    startMinute: 0,
    endHour: 19,
    endMinute: 30
};

/**
This function generates the timePeriods based on a list of timeEntry items.
It assumes all entries are from the same user.
*/
var generateEntryPeriodsSync = function(models, entries) {
    //Logic to generate time periods.
    var caps = {};

    //Sort the list.
    entries = _.sortBy(entries, function(entry) {
        return entry.entryTime;
    });

    //Now lets eliminate invalid entries. We could try to automate the "correcting", but we'll let that be manual.
    //Note that we don't eliminate invalid "late" entries. That's because these can be "caped off" easily when generating the period (if needs be).
    entries = _.filter(entries, function(entry) {
        var mEntry = moment(entry.entryTime);
        var minTime = moment(mEntry).hour(minHour).startOf('hour');

        if (mEntry.isBefore(minTime)) {
            //Put these entries in a "trash bin" that can be used to cap off unended pairs below!
            //We have an array for every (possible) "day of reference". If its a cap, the day of reference will be the day BEFORE the entry.
            var dayRef = moment(mEntry).startOf('day').subtract(1, 'day').format('DDMMYYYY');
            if (_.isUndefined(caps[dayRef])) {
                caps[dayRef] = [];
            }
            caps[dayRef].push(entry);
            return false;
        }

        return true;
    });




    //TODO: Eliminate "stuck" entries. Entries that are stuck together and probably represent an error.
    console.log('Still need to run unsticker to eliminate entries that are less than ' + minDeltaEntries + ' minutes apart.');

    //Determine periods.
    //When we get here, the list should be good to go!
    var periods = [];
    var period, startDate, startEntryId, endEntryId;
    for (var i = 0; i < entries.length; i++) {
        var entry = entries[i];
        if (!startDate) {
            startDate = entry.entryTime;
            startEntryId = entry.id;
        } else {
            //Already have a startDate, but if this date is from after the "minhour" of the following day (or after 2 days), then 
            //We need to disregard the last startDate and choose this one as a new one. 
            //Since we are removing from the last entries BEFORE the minhour, we just have to check if it is another day.
            var dayReference = moment(startDate).startOf('day');
            var endDate = entry.entryTime;
            endEntryId = entry.id;
            var startDateForPeriod = startDate;
            startDate = undefined;



            var dayOfStartDate = moment(startDateForPeriod).date();
            var dayOfEndDate = moment(endDate).date();
            //Another simplification that we can make is to just check if they are diferent. Doesn't matter which is smaller.
            if (dayOfStartDate !== dayOfEndDate) {
                //If we got in here, then the current entry needs to become the startDate, but it still might be 
                //possible to generate a period (because of next day caps). Thats why we use "startDateForPeriod" AND startDate
                startDate = entry.entryTime;

                var key = dayReference.format('DDMMYYYY');
                //Check for a possible cap.
                if (!_.isEmpty(caps[key])) {
                    var capEntries = caps[key];
                    //Here we have all the possible caps for this day... but for now, I will use only the first.
                    endDate = capEntries[0].entryTime;
                    endEntryId = capEntries[0].id;
                } else {
                    //Couldn't find a cap... oh well!
                    continue;
                }

            }

            //Create our period
            period = {
                startTime: startDateForPeriod,
                endTime: endDate,
                dayReference: dayReference,
                origin: 'generated',
                userId: entry.user.id,
                startEntryId: startEntryId,
                endEntryId: endEntryId

            };
            calculateminutes(period);
            periods.push(period);


            //Lets check if the entry is in the "nocturnal session zone"
            //If it is, we should duplicate it. This is easily done by setting it (+1 minute) to our next startdate
            var startNocturnalZone = moment(dayReference).hour(nocturnalSessionInterval.startHour).minute(nocturnalSessionInterval.startMinute);
            var endNocturnalZone = moment(dayReference).hour(nocturnalSessionInterval.endHour).minute(nocturnalSessionInterval.endMinute);
            var endMoment = moment(endDate);
            if ((endMoment.isSame(startNocturnalZone) || endMoment.isAfter(startNocturnalZone)) &&
                endMoment.isBefore(endNocturnalZone)) {
                startDate = endMoment.add(1, 'minutes').startOf('minute').toDate();
            }


        }
    }
    return periods;



};
var generateEntryPeriods = function(models, entries) {
    return Q.fcall(function() {
        return generateEntryPeriodsSync(models, entries);
    });
};

var deleteCurrentEntries = function(models, userId, startDate, endDate) {
    console.log('Deleting entries from: ' + startDate + ' to ' + endDate);
    var filter = {
        where: {
            origin: 'generated',
            userId: userId,

            $or: [{
                    startTime: {
                        gte: startDate,
                        lt: endDate
                    }
                },

                {
                    endTime: {
                        gte: startDate,
                        lt: endDate
                    }
                }

            ]
        }
    };

    return models.TimeEntryPeriod.destroy(filter).then(function(affectedRows) {
        console.log('Deleted ' + affectedRows + ' rows.');
    });
};

var persistNewEntries = function(models, periods) {
    console.log('Saving ' + periods.length + ' entries. ');
    return models.TimeEntryPeriod.bulkCreate(periods).then(function(createdPeriods) {
        console.log('created ' + createdPeriods.length + ' periods');
    });
};

var processTimeEntries = function(models, userId, argStartDate, argEndDate, options) {
    options = options || {
        saveGeneratedEntries: true,
        deleteEntriesForPeriod: true
    };

    var startDate = argStartDate ? moment(argStartDate).toDate() : moment().startOf('month');
    var endDate = argEndDate ? moment(argEndDate).toDate() : moment().startOf('month').add(1, 'months');

    var query = {
        where: {
            entryTime: {
                gte: startDate,
                lt: endDate
            },
            userId: userId
        },
        include: [{
            model: models.ZidecoUser,
            as: 'user'
        }]

    };

    //Return the promise.
    return models.TimeEntry.findAll(query).then(function(entries) {
        if (_.isEmpty(entries)) {
            return;
        }

        //Now, we will chain some promisses that will run sequentially the following fases:
        //Generate entries.
        //Delete periods (when so optionized)
        //Save new periods (when so optionized)
        return generateEntryPeriods(models, entries)
            .then(function(periods) {
                var dbDefered = Q.defer();

                if (options.deleteEntriesForPeriod) {
                    deleteCurrentEntries(models, userId, startDate, endDate).then(function() {
                        dbDefered.resolve(periods);
                    });
                } else {
                    dbDefered.resolve(periods);
                }
                return dbDefered.promise;
                // return deleteCurrentEntries(startDate, endDate);
            })
            .then(function(periods) {
                if (options.saveGeneratedEntries) {
                    return persistNewEntries(models, periods);
                }

                return periods;
            });

        //On successfull generation, do persistance stuff!


    }, function(err) {
        console.log('Error processing entries: ' + err);
        return;
    });
};

var processTimeEntriesClean = function(models, serviceRequestObject, parameters) {
    //Run stuff. When finished, save new satus for serviceRequestObject
    console.log('Will run processTimeEntriesClean for period: ' + parameters.startDate + ' to ' + parameters.endDate);
    //The service for timeentry processing should, at the least, have the userId parameter
    if (!parameters || !parameters.userId) {
        console.log('processTimeEntriesClean failed due to lack of userId param');
        serviceRequestObject.status = 'failed';
        return serviceRequestObject.save().then(function(o) {
            console.log('persisted serviceRequestObject: ' + JSON.stringify(o));
        });
    }


    return processTimeEntries(models, parameters.userId, parameters.startDate, parameters.endDate).then(function() {
        serviceRequestObject.status = 'finished';
        serviceRequestObject.save().then(function(o) {
            console.log('persisted serviceRequestObject: ' + JSON.stringify(o));
        });

    });
};



module.exports = {
    processTimeEntries: processTimeEntries,
    processTimeEntriesClean: processTimeEntriesClean
};
