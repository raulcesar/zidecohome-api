'use strict';
var zidecoseq = require('../zidecoseq');
var _ = require('lodash');
var moment = require('moment');

module.exports = function(models) {
    // var globalmixin = sequelize.globalmixin;
    var ZidecoUser = zidecoseq.define(models, 'ZidecoUser', {
            identifier: { type: 'text', size: 2000 },
            disabled: {type: 'boolean'},
            logintype: {type: 'text'},
            passhash: { type: 'text', size: 2000 },
            experationDate: {type: 'date'}
        },
        {

            methods: {
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

    // var opts = {key: true, addAccessor: 'addAlias'};
    var opts = {key: true};
    ZidecoUser.hasMany('roles', models.ZidecoUserAlias, {}, opts);
    return ZidecoUser;
};
            // classMethods: {
            //     associate: function(models) {
            //         ZidecoUser.belongsToMany(models.UserRole, {
            //             as: {
            //                 singular: 'role',
            //                 plural: 'roles'
            //             },
            //             through: {
            //                 model: models.UserXrole
            //             }
            //         });

            //         ZidecoUser.belongsToMany(models.AuthorizedSchedule, {
            //             as: {
            //                 singular: 'schedule',
            //                 plural: 'schedules'
            //             },
            //             through: models.UserXSchedule
            //         });

            //         ZidecoUser.hasMany(models.ZidecoUserAlias, {
            //             as: {
            //                 singular: 'alias',
            //                 plural: 'aliases'
            //             }
            //         });

            //     }
            // },
