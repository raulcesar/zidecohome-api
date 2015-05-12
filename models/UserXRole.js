'use strict';
var zidecoseq = require('../zidecoseq');

module.exports = function(sequelize, DataTypes) {
   var UserXrole = zidecoseq.define(sequelize, 'UserXrole', 
      {
         startDate: {
            type: DataTypes.DATE,
            allowNull: false
         },
         endDate: DataTypes.DATE
      });

   return UserXrole;
};
