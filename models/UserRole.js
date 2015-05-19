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



    var postprocess = function() {
        var userXrole = {
            startDate: {
                type: 'date',
                required: true
            },
            endDate: {
                type: 'date'
            }
        };

        var opts = {
            reverse: 'roles',
            reverseAddAccessor: 'addRole', //This is only valid in my version!
            key: true,
            addAccessor: 'addUser',
            mergeTable: 'userXrole',
            mergeId: 'role_id',
            mergeAssocId: 'user_id'
        };

        UserRole.hasMany('users', models.ZidecoUser, userXrole, opts);
    };


    return postprocess;
};
