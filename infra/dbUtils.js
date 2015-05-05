'use strict';
var _ = require('lodash');
var zidecoUtils = require('../infra/zidecoUtils');

var standardGetHandler = function(resourceNameOrOptions, req, res) {
    var resourceName;
    var queryOptions;
    if (_.isString(resourceNameOrOptions)) {
        resourceName = resourceNameOrOptions;
    } else {
        resourceName = resourceNameOrOptions.resourceName;
        queryOptions = resourceNameOrOptions.queryOptions;
    }
    //Check for query.
    // var findPromise;
    // if (req.query) {
    //     if (!includes) {
    //         includes = {};
    //     }
    //     includes.where = req.query;
    // }

    // findPromise = req.ormmodels[resourceName].findAll(includes);
    req.ormmodels[resourceName].findAll(queryOptions)

    .then(function(objects) {
        if (_.isEmpty(objects)) {
            res.sendStatus(204);
            return;
        }

        res.send(objects);
    }, zidecoUtils.satandardErrorTreater(req, res));
};

var standardFindHandler = function(resourceName, req, res) {
    req.ormmodels[resourceName].find(req.params.id).then(function(object) {
        if (_.isEmpty(object)) {
            res.sendStatus(204);
            return;
        }
        res.send(object);
    }, zidecoUtils.satandardErrorTreater(req, res));
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
