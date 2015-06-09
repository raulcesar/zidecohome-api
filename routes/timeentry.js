/**
 * Created by raul on 04/05/2015.
 */
'use strict';
var moment = require('moment');
var dbUtils = require('../infra/nodeOrm2DbUtils');
var resourceName = 'TimeEntry';

function handleGet(req, res) {
    var orm = req.ormmodels.orm;
    var filtro = req.query;

    //Get the current user and include id in where clause.
    var query = req.app.get('zUtils').getOrm2UserIdFindFilter(req);
    if (!query) {
        res.sendStatus(500);
        return;
    }

    if (filtro.start) {
        query.and = query.and || [];
        query.and.push({
            entryTime: orm.gte(filtro.start)
        });
    }
    if (filtro.end) {
        query.and = query.and || [];
        query.and.push({
            entryTime: orm.lt(filtro.end)
        });
    }


    dbUtils.standardGetHandler({
        resourceName: resourceName,
        filterObject: query,
        findOptions: {}
    }, req, res);
}

function handleFind(req, res) {

    dbUtils.standardFindHandler(resourceName, req, res);
}

function handleUpd(req, res) {
    var momentObject = moment(req.body.entryTime, 'YYYYMMDDHH:mm');
    req.body.entryTime = momentObject.toDate();
    
    dbUtils.standardUpdateHandler(resourceName, req, res);
}

function handleDel(req, res) {
    dbUtils.standardDeleteHandler(resourceName, req, res);
}

function handleIns(req, res) {
    //Convert datetime
    var momentObject = moment(req.body.entryTime, 'YYYYMMDDHH:mm');
    req.body.entryTime = momentObject.toDate();

    //If request did not come in with a user_id, get current.
    if (!req.body.user_id) {
        var userIdQueryObj = req.app.get('zUtils').getOrm2UserIdFindFilter(req);
        req.body.user_id = userIdQueryObj.user_id;
    }

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
