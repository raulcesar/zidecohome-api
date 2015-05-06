'use strict';
var zidecoseq = require('../zidecoseq');

module.exports = function(sequelize, DataTypes) {
   var ServiceRequest = zidecoseq.define(sequelize, 'ServiceRequest', {
      serviceCategory: DataTypes.STRING,
      serviceName: DataTypes.STRING,
      status: DataTypes.ENUM('pending', 'finished', 'failed')
   });

   return ServiceRequest;
};
