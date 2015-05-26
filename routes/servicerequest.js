/**
 * Created by raul on 04/05/2015.
 */
'use strict';
var dbUtils = require('../infra/nodeOrm2DbUtils');
var eventosio = require('../infra/eventosIoSocket');
// var moment = require('moment');
// var _ = require('lodash');
// var zidecoUtils = require('../infra/zidecoUtils');


var resourceName = 'ServiceRequest';


var TimeEntryServices = require('../services/TimeEntryService');
var TimeEntryScrapingServices = require('../services/TimeEntryScrapingService');

var ServicesByCategories = {
    TimeEntryServices: TimeEntryServices,
    TimeEntryScrapingServices: TimeEntryScrapingServices
};

function handleGet(req, res) {
    dbUtils.standardGetHandler(resourceName, req, res);
}

function handleFind(req, res) {
    dbUtils.standardFindHandler(resourceName, req, res);
}

function handleIns(req, res) {

    //We insert the service request and start the specified service.
    var recievedObject = req.body;
    var serviceParameters = recievedObject.serviceParameters;

    var service = ServicesByCategories[recievedObject.serviceCategory][recievedObject.serviceName];
    if (!service) {
        res.status(500).send('Service ' + recievedObject.serviceCategory + '.' + recievedObject.serviceName + ' not available');
        return;
    }

    recievedObject.status = 'pending';
    //Save service request in DB and call the actual service method.

    serviceParameters.appconfig = req.app.get('conf');
    serviceParameters.req = req;


    req.ormmodels.ServiceRequest.create(recievedObject, function(err, savedObject) {
        service(req.ormmodels, savedObject, serviceParameters).then(function(finishedServiceObj) {
            var io = req.io;
            var messageObj = {
                serviceRequestObj: finishedServiceObj
            };

            if (!io) {
                console.log('No io to send message... but service request finished: ' + messageObj );
                return;
            }
            console.log('Going to try to send message via IO: ' + messageObj );

            //Call io to send socket message.
            io.sockets.emit(eventosio.zEvtServiceRequestDone, messageObj);
        });
        res.send(savedObject);
    });

    // dbUtils.standardInsertHandler(resourceName, req, res);
}


//Return API
module.exports = {
    version: '1.0',
    ins: handleIns,
    get: handleGet,
    find: handleFind
        // upd: handleUpd,
        // del: handleDel
};
