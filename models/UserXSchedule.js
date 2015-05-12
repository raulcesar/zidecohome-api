'use strict';
var zidecoseq = require('../zidecoseq');

module.exports = function(sequelize, DataTypes) {
   var UserXSchedule = zidecoseq.define(sequelize, 'UserXSchedule', 
      {
        validSince: {
            type: DataTypes.DATE,
            allowNull: false
        },

        //Null value indicates STILL valid.
        validUntil: {
            type: DataTypes.DATE,
            allowNull: true
        },
      });

   return UserXSchedule;
};


