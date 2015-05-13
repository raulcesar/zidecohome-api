'use strict';
// var Sequelize = require('sequelize');
// var Sequelize = require('../submodules/sequelize');
var _ = require('lodash');

var globalmixin = {
  attributes: {
      // createdBy: {
      //     type: Sequelize.STRING
      // }
  }
};

var zidecoseq = {
	define : function(models, modelname, attributes, options) {
		var db = models.db;
		var extendedAttributes = _.extend(attributes, globalmixin.attributes);
		var ret = db.define(modelname, extendedAttributes, options);
		models[modelname] = ret;
		return ret;
	}
};


module.exports = zidecoseq;