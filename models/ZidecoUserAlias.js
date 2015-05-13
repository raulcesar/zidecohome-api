'use strict';
var zidecoseq = require('../zidecoseq');

module.exports = function(db, DataTypes) {
   // var globalmixin = sequelize.globalmixin;
   var ZidecoUserAlias = zidecoseq.define(db, 'ZidecoUserAlias', {
         identifier: { type: 'text', size: 2000 }
      }
      // ,

      // {
      //    classMethods: {
      //       associate: function(models) {
      //          ZidecoUserAlias.belongsTo(models.ZidecoUser, {as: 'user', foreignKey: { allowNull: false } });
      //       }
      //    },
      // }

   );

   return ZidecoUserAlias;
};
