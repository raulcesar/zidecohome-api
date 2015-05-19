'use strict';
// var moment = require('moment');
var q = require('q');

// var doNothingCB = function(err, obj) {
//     if (err) {
//         console.log('Error: ' + err);
//     }
//     // console.log(obj);
//     return;
// };




var createSchedules = function(m) {
    var deferred = q.defer();
    var schedule = {
        hourStart: 7,
        hourFinish: 19,
        minuteStart: 0,
        minuteFinish: 0,
        description: 'Horário padrão CD'
    };

    m.AuthorizedSchedule.create(schedule, function(err, schedule) {
        if (err) {
            deferred.reject(err);
        } else {
            deferred.resolve(schedule);
        }
        

    });

    return deferred.promise;

};


module.exports = {
    run: createSchedules
};
