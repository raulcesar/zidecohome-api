'use strict';
var moment = require('moment');
var Q = require('q');

var testService1 = function(models, serviceRequestObject, parameters) {
    //Run stuff. When finished, save new satus for serviceRequestObject
    var deferred = Q.defer();

    console.log('Doing testService1. Time: ' + moment().format('HH:mm:ss'));
    

    setTimeout(function() {
        console.log('Finished testService1. Time: ' +  moment().format('HH:mm:ss'));
        deferred.resolve('Finished testService1. Time: ' +  moment().format('HH:mm:ss'));
    }, 10000);
    return deferred.promise;
};

var testService2 = function(models, serviceRequestObject, parameters) {
    //Run stuff. When finished, save new satus for serviceRequestObject
    var deferred = Q.defer();

    console.log('Doing testService2. Time: ' + moment().format('HH:mm:ss'));

    setTimeout(function() {
        console.log('Finished testService2. Time: ' +  moment().format('HH:mm:ss'));
        deferred.resolve('Finished testService2. Time: ' +  moment().format('HH:mm:ss'));
    }, 5000);
    return deferred.promise;
};


module.exports = {
    // scrapeTimeEntries: scrapeTimeEntries,
    testService1: testService1,
    testService2: testService2
};
