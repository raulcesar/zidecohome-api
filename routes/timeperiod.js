/**
 * Created by raul on 07/05/2015.
 */
'use strict';
var dbUtils = require('../infra/nodeOrm2DbUtils');
var moment = require('moment');
var _ = require('lodash');

var resourceName = 'TimeEntryPeriod';

function handleGet(req, res) {
    var queryOptions;
    var filtro = req.query;
    var dayReference = {};

    //Get the current user and include id in where clause.
    var whereClause = req.app.get('zUtils').getUserIdWhereObject(req);
    if (!whereClause) {
        res.sendStatus(500);
        return;
    }

    if (filtro.start) {
        //Should we parse KNOWN format???
        // startDate = moment(filtro.start).toDate();
        dayReference.gte = moment(filtro.start).toDate();
        whereClause.dayReference = dayReference;
    }
    if (filtro.end) {
        dayReference.lt = moment(filtro.end).toDate();
        whereClause.dayReference = dayReference;
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
