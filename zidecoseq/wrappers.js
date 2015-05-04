'use strict';
var Sequelize = require('sequelize');
var _ = require('lodash');

var globalmixin = {
  attributes: {
      createdBy: {
          type: Sequelize.STRING
      }
  }
};

var zidecoseq = {
	define : function(sequelize, modelname, attributes, options) {
		var extendedAttributes = _.extend(attributes, globalmixin.attributes);

		return sequelize.define(modelname, extendedAttributes, options);
	}
};


module.exports = zidecoseq;