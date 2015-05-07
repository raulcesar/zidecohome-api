/**
 * Created by raul on 04/05/2015.
 */
'use strict';
var dbUtils = require('../infra/dbUtils');
var moment = require('moment');
var _ = require('lodash');
var zidecoUtils = require('../infra/zidecoUtils');

var resourceName = 'ServiceRequest';


var TimeEntryServices = require('../services/TimeEntryService');

var ServicesByCategories = {
    TimeEntryServices: TimeEntryServices
};

function handleGet(req, res) {
    // var whereClause = {userId: usu.id};

    dbUtils.standardGetHandler(resourceName, req, res);

    // var queryOptions;
    // // var startDate = moment('04-05-2015', 'DD-MM-YYYY').toDate(),
    // //     endDate = moment('05-05-2015', 'DD-MM-YYYY').toDate();

    // var filtro = req.query;
    // var whereClause = {};
    // var entryTime = {};
    
    // if (filtro.start) {
    //     //Should we parse KNOWN format???
    //     // startDate = moment(filtro.start).toDate();
    //     entryTime.gte = moment(filtro.start).toDate();
    //     whereClause.entryTime = entryTime;
    // }
    // if (filtro.end) {
    //     entryTime.lt = moment(filtro.end).toDate();
    //     whereClause.entryTime = entryTime;
    // }

    // if (!_.isEmpty(whereClause)) {
    //     queryOptions = {
    //         where: whereClause
    //     };
    // }

    // dbUtils.standardGetHandler({
    //     resourceName: resourceName,
    //     queryOptions: queryOptions
    // }, req, res);

}

function handleFind(req, res) {
    dbUtils.standardFindHandler(resourceName, req, res);
}

// function handleUpd(req, res) {
//     dbUtils.standardUpdateHandler(resourceName, req, res);
// }

// function handleDel(req, res) {
//     dbUtils.standardDeleteHandler(resourceName, req, res);
// }

function handleIns(req, res) {

    //We insert the service request and start the specified service.
    var recievedObject = req.body;
    var serviceParameters = recievedObject.parameters;

    var service = ServicesByCategories[recievedObject.serviceCategory][recievedObject.serviceName];
    if (!service) {
        res.status(500).send('Service ' + recievedObject.serviceCategory + '.' + recievedObject.serviceName + ' not available');
        return;
    }

    // res.send('test');
    recievedObject.status = 'pending';
    req.ormmodels.ServiceRequest.create(recievedObject).then(function(savedObject) {
        service(req.ormmodels, savedObject, serviceParameters).then(function(ret) {
            //Call io to send socket message.
            console.log('Will eventually Call io to send socket message. ret: ' + ret);
        });
        res.send(savedObject);
    }, zidecoUtils.satandardErrorTreater(req, res));

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
