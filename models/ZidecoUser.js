'use strict';
var zidecoseq = require('../zidecoseq');
var _ = require('lodash');
var moment = require('moment');

module.exports = function(sequelize, DataTypes) {
   // var globalmixin = sequelize.globalmixin;
   var ZidecoUser = zidecoseq.define(sequelize, 'ZidecoUser', {
         identifier: DataTypes.STRING,
         disabled: DataTypes.BOOLEAN,
         logintype: DataTypes.STRING,
         passhash: DataTypes.STRING,
         experationDate: DataTypes.DATE
      },

      {
         classMethods: {
            associate: function(models) {
               ZidecoUser.belongsToMany(models.UserRole, {
                  as: { singular: 'role', plural: 'roles' },
                  // through: 'UserXRole'
                  through: models.UserXRole
               });
               ZidecoUser.hasMany(models.ZidecoUserAlias, {
                  as: { singular: 'alias', plural: 'aliases' }
               });

            }
         },

         instanceMethods: {
            isValid: function(argDateToCheck) {
               if (this.disabled === true) {
                  return false;
               }
               
               var dateToCheck = argDateToCheck || moment();
               if (moment(this.experationDate).isBefore(dateToCheck)) {
                  return false;
               }
               return true;
            },

            hasValidRole: function(code, argDateToCheck) {
               // if (!this.roles || this.roles.length <= 0) {
               //    return false;
               // }
               // var dateToCheck = argDateToCheck || moment();
               // var index = this.perfilIndex[code];
               // if (!_.isUndefined(index)) {
               //    var historicoPerfil = this.roles[index];
               //    //Check that the role is not disabled.
               //    if (historicoPerfil.perfil.disabled === true) {
               //       return false;
               //    }

               //    //Check that the role is valid on the DATE being specified.
               //    if (!_.isNull(historicoPerfil.dataFim) &&
               //       !_.isUndefined(historicoPerfil.dataFim) &&
               //       moment(historicoPerfil.dataFim).isBefore(dateToCheck)) {
               //       return false;
               //    }

               //    //Has the role and it is valid!
               //    return true;

               // }

               // return false;
               return true;
            }
         }
      }

   );

   return ZidecoUser;
};
