'use strict';
var _ = require('lodash');
var Q = require('q');




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


    return deferred.promise;
};

module.exports = {
    // scrapeTimeEntries: scrapeTimeEntries,
    runServices: runServices
};
