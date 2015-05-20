/**
 * Created by raul on 07/05/2015.
 */
'use strict';
var dbUtils = require('../infra/nodeOrm2DbUtils');
// var moment = require('moment');

var resourceName = 'TimeEntryPeriod';

function handleGet(req, res) {
    var filtro = req.query;
    var orm = req.ormmodels.orm;

    //Get the current user and include id in where clause.
    var whereClause = req.app.get('zUtils').getOrm2UserIdFindFilter(req);
    if (!whereClause) {
        res.sendStatus(500);
        return;
    }

    if (filtro.start) {
        whereClause.and = whereClause.and || [];
        whereClause.and.push({
            dayReference: orm.gte(filtro.start)
        });
    }
    if (filtro.end) {
        whereClause.and = whereClause.and || [];
        whereClause.and.push({
            dayReference: orm.lt(filtro.end)
        });
    }

    dbUtils.standardGetHandler({
       resourceName: resourceName,
       filterObject: whereClause,
       findOptions: {}
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
