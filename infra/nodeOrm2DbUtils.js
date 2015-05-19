'use strict';
var _ = require('lodash');
var zidecoUtils = require('../infra/zidecoUtils');

var getDefaultCB = function(req, res) {
    return function(err, object) {
        if (err) {
            zidecoUtils.satandardErrorTreater(req, res)();
            return;
        }
        if (_.isEmpty(object)) {
            res.sendStatus(204);
            return;
        }
        res.send(object);
    };
};


var standardGetHandler = function(queryOptions, req, res) {
    var m = req.ormmodels;

    if (_.isString(queryOptions)) {
        queryOptions = {resourceName: queryOptions};
    }


    var cb = queryOptions.cb || getDefaultCB(req, res);

    m[queryOptions.resourceName]
        .find(
            queryOptions.filterObject,
            queryOptions.findOptions,
            cb);
};



var standardFindHandler = function(queryOptions, req, res) {
    var m = req.ormmodels;
    var cb = queryOptions.cb || getDefaultCB(req, res);
    var filterObject = {id: req.params.id};
    
    if (_.isString(queryOptions)) {
        queryOptions = {resourceName: queryOptions};
    }

    m[queryOptions.resourceName]
        .one(filterObject,
            queryOptions.findOptions,
            cb);


};

var standardDeleteHandler = function(resourceName, req, res) {
    var id = req.params.id;

    req.ormmodels[resourceName].find(id).then(function(originalObject) {
        originalObject.destroy().then(function() {
            res.sendStatus(200);
        }, zidecoUtils.satandardErrorTreater(req, res));
    }, zidecoUtils.satandardErrorTreater(req, res));

};

var standardUpdateHandler = function(resourceName, req, res) {

    //In order to update, we will create a persistent instance of the object (based on id), and merge in the sent attributes.
    //This way, if there is a "desync" between client and server, we won´t nullify properties on server.
    var id = req.params.id;
    var recievedObject = req.body;

    req.ormmodels[resourceName].find(id).then(function(originalObject) {
        _.assign(originalObject, recievedObject);
        originalObject.save().then(function(savedObject) {
            res.send(savedObject);
        }, zidecoUtils.satandardErrorTreater(req, res));
    }, zidecoUtils.satandardErrorTreater(req, res));

};

var standardInsertHandler = function(resourceName, req, res) {
    //Just creates a resource and returns it.
    var recievedObject = req.body;
    req.ormmodels[resourceName].create(recievedObject).then(function(savedObject) {
        res.send(savedObject);
    }, zidecoUtils.satandardErrorTreater(req, res));

};


module.exports = {
    standardGetHandler: standardGetHandler,
    standardFindHandler: standardFindHandler,
    standardDeleteHandler: standardDeleteHandler,
    standardUpdateHandler: standardUpdateHandler,
    standardInsertHandler: standardInsertHandler
};
