/**
 * Created by raul on 04/05/2015.
 */
'use strict';
var dbUtils = require('../infra/nodeOrm2DbUtils');
var zidecoUtils = require('../infra/zidecoUtils');

var resourceName = 'Currency';

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
  var newCurrency = req.body;
   //Currency has a uniqueness to it. Although we could let the DB deal with this, we will treat it here
   //with the help of sequelize. In part because it is a bit more elegant and also to just have an example.
   req.ormmodels.Currency.findOrCreate({
      where: {code: newCurrency.code},
      defaults: newCurrency
   }).spread(function(object, created) {
      if (!created) {
        console.log('Attempted call to insert resource ' + resourceName + ', but resource already existed.');
      }
      res.send(object);
   }, zidecoUtils.satandardErrorTreater(req, res));
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
