'use strict';
var zidecoseq = require('../zidecoseq');

module.exports = function(sequelize, DataTypes) {
   var UserXRole = zidecoseq.define(sequelize, 'UserXRole', 
      {
         startDate: {
            type: DataTypes.DATE,
            allowNull: false
         },
         endDate: DataTypes.DATE
      });

   return UserXRole;
};
