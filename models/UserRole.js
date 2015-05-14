'use strict';
var zidecoseq = require('../zidecoseq');

module.exports = function(models) {
    var UserRole = zidecoseq.define(models, 'UserRole', {
        code: {
            type: 'text',
            size: 100
        },
        description: {
            type: 'text',
            size: 500
        }
    });


    var userXrole = {
        startDate: {
            type: 'date',
            required: true
        },
        endDate: {
            type: 'date'
        },
    };

    var opts = {
        reverse: 'roles',
        key: true
    };
    UserRole.hasMany('users', models.ZidecoUser, userXrole, opts);

    return UserRole;
};
