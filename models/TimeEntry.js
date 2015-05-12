'use strict';
var zidecoseq = require('../zidecoseq');

module.exports = function(sequelize, DataTypes) {
    var TimeEntry = zidecoseq.define(sequelize, 'TimeEntry', {
        entryTime: DataTypes.DATE,
        origin: {
            type: DataTypes.ENUM('manual', 'imported', 'transposed'),
            defaultValue: 'transposed',
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('valid', 'invalid', 'canceled', 'unprocessed'),
            defaultValue: 'unprocessed',
            allowNull: false

        }
    }, {
        classMethods: {
            associate: function(models) {
                TimeEntry.belongsTo(models.ZidecoUser, {
                    as: 'user',
                    foreignKey: {
                        allowNull: false
                    }
                });
            }
        }
    });

    return TimeEntry;
};
