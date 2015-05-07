'use strict';
var zidecoseq = require('../zidecoseq');

module.exports = function(sequelize, DataTypes) {
   // var globalmixin = sequelize.globalmixin;
   var ZidecoUserAlias = zidecoseq.define(sequelize, 'ZidecoUserAlias', {
         identifier: DataTypes.STRING
      },

      {
         classMethods: {
            associate: function(models) {
               ZidecoUserAlias.belongsTo(models.ZidecoUser, {as: 'user', foreignKey: { allowNull: false } });
            }
         },
      }

   );

   return ZidecoUserAlias;
};
