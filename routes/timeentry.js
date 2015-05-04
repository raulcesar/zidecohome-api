/**
 * Created by raul on 04/05/2015.
 */
'use strict';
var dbUtils = require('../infra/dbUtils');

var resourceName = 'TimeEntry';

function handleGet(req, res) {
   dbUtils.standardGetHandler(resourceName, req, res);
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
