'use strict';
var zidecoseq = require('../zidecoseq');

module.exports = function(sequelize, DataTypes) {
   var UserXRole = zidecoseq.define(sequelize, 'UserXRole', 
      {
         startdate: {
            type: DataTypes.DATE
            // ,
            // allowNull: false
         },
         enddate: DataTypes.DATE
      });

   return UserXRole;
};
