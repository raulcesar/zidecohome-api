'use strict';
var _ = require('lodash');
var zidecoUtils = require('../infra/zidecoUtils');
var Q = require('q');


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
        queryOptions = {
            resourceName: queryOptions
        };
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
    var filterObject = {
        id: req.params.id
    };

    if (_.isString(queryOptions)) {
        queryOptions = {
            resourceName: queryOptions
        };
    }

    m[queryOptions.resourceName]
        .one(filterObject,
            queryOptions.findOptions,
            cb);


};

var standardDeleteHandler = function(resourceName, req, res, dontSendResponse) {
    var deferred = Q.defer();
    var id = req.params.id;
    //Se não estiver no params, verifica no body
    if (!id) {
        id = req.body.id;
    }
    if (!id) {
        deferred.resolve();
        return;
    }
    var db = req.ormmodels.db;

    db.driver.remove(resourceName, {
        id: id
    }, function(err) {
        if (err) {
            deferred.reject(err);
            if (!dontSendResponse) {
                zidecoUtils.satandardErrorTreater(req, res)();
            }

        } else {
            deferred.resolve(id);
            if (!dontSendResponse) {
                res.send(id);
            }
        }
    });
    return deferred.promise;
};

var standardUpdateHandler = function(resourceName, req, res, dontSendResponse) {
    var deferred = Q.defer();

    //In order to update, we will create a persistent instance of the object (based on id), and merge in the sent attributes.
    //This way, if there is a "desync" between client and server, we won´t nullify properties on server.
    // var id = req.params.id;
    var recievedObject = req.body;
    req.ormmodels[resourceName].get(recievedObject.id, function(err, originalObject) {
        if (err) {
            deferred.reject(err);
            if (!dontSendResponse) {
                zidecoUtils.satandardErrorTreater(req, res)();
            }
            return;
        }
        //Merge in the recievedobject.
        _.assign(originalObject, recievedObject);
        
        //Now save the object.
        originalObject.save(function(err, savedObject) {
            if (err) {
                deferred.reject(err);
                if (!dontSendResponse) {
                    zidecoUtils.satandardErrorTreater(req, res)();
                }
            } else {
                deferred.resolve(savedObject);
                if (!dontSendResponse) {
                    res.send(savedObject);
                }
            }
        });
    });

    return deferred.promise;
};


var standardInsertHandler = function(resourceName, req, res, dontSendResponse) {
    //Just creates a resource and returns it.
    var deferred = Q.defer();
    var recievedObject = req.body;
    req.ormmodels[resourceName].create(recievedObject, function(err, savedObject) {
        if (err) {
            deferred.reject(err);
            if (!dontSendResponse) {
                zidecoUtils.satandardErrorTreater(req, res)();
            }

        } else {
            deferred.resolve(savedObject);
            if (!dontSendResponse) {
                res.send(savedObject);
            }
        }
    });
    return deferred.promise;
};


module.exports = {
    standardGetHandler: standardGetHandler,
    standardFindHandler: standardFindHandler,
    standardDeleteHandler: standardDeleteHandler,
    standardUpdateHandler: standardUpdateHandler,
    standardInsertHandler: standardInsertHandler
};
