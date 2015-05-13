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
	define : function(db, modelname, attributes, options) {
		var extendedAttributes = _.extend(attributes, globalmixin.attributes);
		var ret = db.define(modelname, extendedAttributes, options);
		return ret;
	}
};


module.exports = zidecoseq;