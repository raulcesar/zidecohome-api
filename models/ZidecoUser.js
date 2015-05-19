'use strict';
var zidecoseq = require('../zidecoseq');
// var _ = require('lodash');
var moment = require('moment');


/**
ZidecoUsers have the following "reverse" associations:

roles
aliases
timeentires
timeperiods

*/
module.exports = function(models) {
    // var globalmixin = sequelize.globalmixin;
    var ZidecoUser = zidecoseq.define(models, 'ZidecoUser', {
            identifier: {
                type: 'text',
                size: 2000
            },
            disabled: {
                type: 'boolean'
            },
            logintype: {
                type: 'text'
            },
            passhash: {
                type: 'text',
                size: 2000
            },
            experationDate: {
                type: 'date'
            }
        }, {

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



    // var postprocess = function() {
    //     var userXrole = {
    //         startDate: {
    //             type: 'date',
    //             required: true
    //         },
    //         endDate: {
    //             type: 'date'
    //         }
    //     };

    //     var opts = {
    //         // reverse: 'roles',
    //         key: true,
    //         addAccessor: 'addRole',
    //         mergeTable: 'userXrole',
    //         mergeId: 'user_id',
    //         mergeAssocId: 'role_id'
            
    //     };
    // If we want all the members on "roles", than this is what we need to run!


    //     ZidecoUser.hasMany('roles', models.UserRole, userXrole, opts);
    // };

    // return postprocess;
    return;
};
