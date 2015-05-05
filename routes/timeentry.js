/**
 * Created by raul on 04/05/2015.
 */
'use strict';
var dbUtils = require('../infra/dbUtils');
var moment = require('moment');
var _ = require('lodash');

var resourceName = 'TimeEntry';

function handleGet(req, res) {
    var queryOptions;
    // var startDate = moment('04-05-2015', 'DD-MM-YYYY').toDate(),
    //     endDate = moment('05-05-2015', 'DD-MM-YYYY').toDate();

    var filtro = req.query;
    var whereClause = {};
    var entryTime = {};
    
    if (filtro.start) {
        //Should we parse KNOWN format???
        // startDate = moment(filtro.start).toDate();
        entryTime.gte = moment(filtro.start).toDate();
        whereClause.entryTime = entryTime;
    }
    if (filtro.end) {
        entryTime.lt = moment(filtro.end).toDate();
        whereClause.entryTime = entryTime;
    }

    if (!_.isEmpty(whereClause)) {
        queryOptions = {
            where: whereClause
        };
    }

    dbUtils.standardGetHandler({
        resourceName: resourceName,
        queryOptions: queryOptions
    }, req, res);

}

function handleFind(req, res) {
    dbUtils.standardFindHandler(resourceName, req, res);
}

function handleUpd(req, res) {
    dbUtils.standardUpdateHandler(resourceName, req, res);
}

function handleDel(req, res) {
    dbUtils.standardDeleteHandler(resourceName, req, res);
}

function handleIns(req, res) {
    dbUtils.standardInsertHandler(resourceName, req, res);
}


//Return API
module.exports = {
    version: '1.0',
    get: handleGet,
    find: handleFind,
    ins: handleIns,
    upd: handleUpd,
    del: handleDel
};
