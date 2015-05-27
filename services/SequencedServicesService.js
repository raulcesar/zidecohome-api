'use strict';
var request = require('request').defaults({
    jar: true
});
var _ = require('lodash');
var cheerio = require('cheerio');
var moment = require('moment');
var Q = require('q');
var PhaseController = require('../infra/PhaseController');



var phaseController;
var deferredScrapeEntries;
var scrapingResultObj = {
    messages: [],
    timeEntries: []
};


var scrapingAllDone = function() {
    deferredScrapeEntries.resolve(scrapingResultObj);
};




var runServices = function(models, serviceRequestObject, parameters) {
    //Run stuff. When finished, save new satus for serviceRequestObject
    var deferred = Q.defer();
    console.log('Will run Sequenced Services: ' + parameters.startDate + ' to ' + parameters.endDate);
    //If we did not recieve userId, than get it from request.
    var userId;
    if (parameters && !parameters.userId && parameters.req && parameters.req.user) {
        userId = parameters.req.user.id;
    }


    //First, we need to get services
    //Extract objects from array:
    var services = [];

    var innerServiceRequestObjects = parameters.innerServiceRequestObjects;
    _.each(innerServiceRequestObjects, function(innerServiceRequestObject) {
        // recievedObject.serviceCategory][recievedObject.serviceName
        var serviceModule = require('../services/' + innerServiceRequestObject.serviceCategory);
        var service = serviceModule[innerServiceRequestObject.serviceName];
        if (!service) {
            //If we were unable to find ANY of the inner service modules, than fail the outer service WITHOUT running anything!
            serviceRequestObject.status = 'failed';
            serviceRequestObject.observation = 'Service ' +
                innerServiceRequestObject.serviceCategory + ' - ' + innerServiceRequestObject.serviceName +
                'does not exist. Failing SequencedService without running any inner services!';
            serviceRequestObject.save(function(err, o) {
                if (err) {
                    deferred.reject(err);
                    return;
                }
                deferred.resolve(o);
                console.log('persisted serviceRequestObject: ' + JSON.stringify(o));
            });

            return deferred.promise;
        }

        //found inner service. Push to doable array.
        innerServiceRequestObject.serviceParameters.appconfig = parameters.appconfig;
        innerServiceRequestObject.serviceParameters.req = parameters.req;

        services.push({
            service: service,
            serviceRequestObject: innerServiceRequestObject
        });
    });

    //Now that we have the array of service modules, let's run the individual services.

    //Get first promise:

    // Q(services[0]);

    // var runService = function(serviceWrapperWithServiceToRun) {
    //     var serviceParameters = serviceWrapperWithServiceToRun.serviceRequestObject.serviceParameters;
    //     return function() {
    //         // var deferred = Q.defer();
    //         console.log('returning promise to SAVE and EXECUTE internal service: ' + JSON.stingify(serviceWrapperWithServiceToRun.serviceRequestObject));
    //         return Q.nfcall(models.ServiceRequest.create, serviceWrapperWithServiceToRun.serviceRequestObject).then(function(savedObject) {
    //             console.log('Resolving promise after saving internal service: ' + JSON.stingify(savedObject));
    //             return serviceWrapperWithServiceToRun.service(models, savedObject, serviceParameters);
    //         });

    //         // models.ServiceRequest.create(serviceWrapperWithServiceToRun.serviceRequestObject, function(err, savedObject) {
    //         //     console.log('Resolving promise after saving internal service: ' + JSON.stingify(savedObject));
    //         //     // deferred.resolve(savedObject);
    //         //     return serviceWrapperWithServiceToRun.service(models, savedObject, serviceParameters);
    //         // });
    //         // return deferred.promise;
    //     };
    // };

    var createRunServicePromise = function(serviceWrapperWithServiceToRun) {
        var internalName = serviceWrapperWithServiceToRun.serviceRequestObject.serviceCategory + serviceWrapperWithServiceToRun.serviceRequestObject.serviceName;
        var innerfunctionRunDeffered = Q.defer();
        var serviceParameters = serviceWrapperWithServiceToRun.serviceRequestObject.serviceParameters;

        return function() {
            models.ServiceRequest.create(serviceWrapperWithServiceToRun.serviceRequestObject, function(err, savedObject) {
                serviceWrapperWithServiceToRun.service(models, savedObject, serviceParameters).then(function(innerserviceSavedObject) {
                    console.log('Resolving promise after saving internal service ' + internalName + ': ' + innerserviceSavedObject);
                    if (innerserviceSavedObject.status === 'failed') {
                        console.log('Inside save callback of FAILED internal service ' + internalName);
                        innerfunctionRunDeffered.reject('Failed service ' + internalName + '. Obs: ' + innerserviceSavedObject.observation);
                    } else {
                        innerfunctionRunDeffered.resolve(savedObject);
                    }
                }, function(err) {
                    innerfunctionRunDeffered.reject(err);
                });
            });
            return innerfunctionRunDeffered.promise;
        };


    };

    var firstFuncDeferred = Q.defer();
    var chainedPromisses = firstFuncDeferred.promise;
    // var chainedPromisses = createRunServicePromise(services[0]);

    // var firstFuncDeferred = Q.defer();
    // var chainedPromisses = firstFuncDeferred.promise;


    // var serviceParameters = services[0].serviceRequestObject.serviceParameters;
    // models.ServiceRequest.create(services[0].serviceRequestObject, function(err, savedObject) {
    //     services[0].service(models, savedObject, serviceParameters).then(function(innerserviceSavedObject) {
    //         console.log('Resolving promise after saving internal service: ' + innerserviceSavedObject);
    //         if (innerserviceSavedObject.status === 'failed') {
    //             firstFuncDeferred.reject('Failed service 0. Obs: ' + innerserviceSavedObject.observation);
    //         } else {
    //             firstFuncDeferred.resolve(savedObject);
    //         }

    //     }, function(err) {
    //         firstFuncDeferred.reject(err);
    //     });
    // });
    // services[0].service(models, services[0].serviceRequestObject, services[0].serviceRequestObject.serviceParameters);

    for (var i = 0; i < services.length; i++) {
        chainedPromisses = chainedPromisses.then(createRunServicePromise(services[i]));
    }

    firstFuncDeferred.resolve('start');

    chainedPromisses.then(function(resolveObject) {
        //Here we should save the object...
        // var deferred = Q.defer();
        console.log('Success of sequenced services...' + resolveObject);
        serviceRequestObject.status = 'finished';
        serviceRequestObject.save(function(err, o) {
            deferred.resolve(o);
        });
        //need to return promise from here.
        // return deferred.promise;


        // deferred.resolve(result);
    }, function(error) {
        console.log('Failed sequenced services...' + error);
        serviceRequestObject.status = 'failed';
        // serviceRequestObject.observation = error;
        serviceRequestObject.save(function(err, o) {
            deferred.resolve(o);
        });

        // deferred.reject(error);
    });


    // funcs.forEach(function (f) {
    //    esult = result.then(f);
    // });
    return deferred.promise;

    // _.each(services, function(serviceWrapperObject) {
    //     serviceWrapperObject.service(models, serviceWrapperObject.serviceRequestObject, serviceWrapperObject.serviceRequestObject.serviceParameters)
    //         .then(function(finishedServiceObj) {
    //             var messageObj = {
    //                 serviceRequestObj: finishedServiceObj
    //             };

    //             console.log('No io to send message... but service request finished: ' + messageObj);
    //             return;
    //         });

    // });

    // var TimeEntryServices = require('../services/TimeEntryService');
    // var TimeEntryScrapingServices = require('../services/TimeEntryScrapingService');

    // var ServicesByCategories = {
    //     TimeEntryServices: TimeEntryServices,
    //     TimeEntryScrapingServices: TimeEntryScrapingServices
    // };



    // //The service for timeentry processing should, at the least, have a username and password that we will need to authenticate before scraping.
    // if (!parameters || !userId || !parameters.username || !parameters.password) {
    //     console.log('scrapeTimeEntriesClean failed due to lack of required parameters');
    //     serviceRequestObject.status = 'failed';
    //     serviceRequestObject.save(function(err, o) {
    //         if (err) {
    //             deferred.reject(err);
    //             return;
    //         }
    //         deferred.resolve(o);
    //         console.log('persisted serviceRequestObject: ' + JSON.stringify(o));
    //     });

    //     return deferred.promise;
    // }

    // return scrapeTimeEntries(parameters.appconfig, models, userId, parameters.username, parameters.password, parameters.startDate, parameters.endDate)
    //     .then(function(resolveObject) {
    //         //Scraped all timeEntries. Now we can persist them
    //         //Delete, then save, then finish by updating servicerequest.

    //         return deleteCurrentEntries(models, userId, parameters.startDate, parameters.endDate)
    //             .then(function() {
    //                 return persistNewEntries(models, scrapingResultObj.timeEntries);
    //             })
    //             .then(function() {
    //                 var deferred = Q.defer();
    //                 serviceRequestObject.status = 'finished';
    //                 serviceRequestObject.observation = resolveObject.messages.join('\n');
    //                 serviceRequestObject.save(function(err, o) {
    //                     deferred.resolve(o);
    //                     return o;
    //                 });
    //                 //need to return promise from here.
    //                 return deferred.promise;

    //             });

    //     });

};

module.exports = {
    // scrapeTimeEntries: scrapeTimeEntries,
    runServices: runServices
};
