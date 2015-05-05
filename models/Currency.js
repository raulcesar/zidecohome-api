'use strict';
var zidecoseq = require('../zidecoseq');

module.exports = function(sequelize, DataTypes) {
   var Currency = zidecoseq.define(sequelize, 'Currency', {
         code: DataTypes.STRING,
         description: DataTypes.STRING,
         valueZidecos: DataTypes.BIGINT
      }
   );

   return Currency;
};
