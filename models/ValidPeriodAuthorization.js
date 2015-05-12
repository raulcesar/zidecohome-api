'use strict';
var zidecoseq = require('../zidecoseq');

/**
    This entity represents an authorization to "validate" time entries during a certain period of time, that normally would
    be invalid.
    examples: "Noctornal Session", "Authorized overtime"
*/
module.exports = function(sequelize, DataTypes) {
    var ValidPeriodAuthorization = zidecoseq.define(sequelize, 'ValidPeriodAuthorization', {
        startAuthorization: {
            type: DataTypes.DATE,
            allowNull: false
        },
        endAuthorization: {
            type: DataTypes.DATE,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        classMethods: {
            associate: function(models) {
                ValidPeriodAuthorization.belongsTo(models.ZidecoUser, {
                    as: 'user',
                    foreignKey: {
                        allowNull: false
                    }
                });
            }
        }
    });

    return ValidPeriodAuthorization;
};
