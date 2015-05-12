'use strict';
var zidecoseq = require('../zidecoseq');

module.exports = function(sequelize, DataTypes) {
    var UserRole = zidecoseq.define(sequelize, 'UserRole', {
            code: DataTypes.STRING,
            description: DataTypes.STRING
        }, {
            classMethods: {
                associate: function(models) {
                    UserRole.belongsToMany(models.ZidecoUser, {
                        as: {
                            singular: 'user',
                            plural: 'users'
                        },

                        through: {
                            model: models.UserXrole
                        }
                    });



                }
            }
        }

    );

    return UserRole;
};
