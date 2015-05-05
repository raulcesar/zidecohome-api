/**
 * Created by raul on 05/05/2015.
 */
'use strict';
var dbUtils = require('../infra/dbUtils');

var resourceName = 'ZidecoUser';

function handleGet(req, res) {
   var m = req.ormmodels;
   var queryOptions = {
      include: [{
         model: m.UserRole,
         as: 'roles'
      }]
   };

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
