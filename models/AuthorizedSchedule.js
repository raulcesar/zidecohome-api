'use strict';
var zidecoseq = require('../zidecoseq');

/**
    This entity represents an authorized schedule for normal dates

*/
module.exports = function(sequelize, DataTypes) {
    var AuthorizedSchedule = zidecoseq.define(sequelize, 'AuthorizedSchedule', {

        dayStart: DataTypes.INTEGER,
        dayFinish: DataTypes.INTEGER,
        hourStart: DataTypes.INTEGER,
        hourFinish: DataTypes.INTEGER,
        minuteStart: DataTypes.INTEGER,
        minuteFinish: DataTypes.INTEGER,

        description: DataTypes.STRING
    }, {
        classMethods: {
            associate: function(models) {

                AuthorizedSchedule.belongsToMany(models.ZidecoUser, {
                    through: models.UserXSchedule,
                    as: 'user'
                });

            }
        }
    });

    return AuthorizedSchedule;
};
